#!/usr/bin/env python3

"""Merge the raw study.db CSV export into one dataset with a single row per participant.

The script consumes a ``study_db_export_<timestamp>`` folder produced by
``../export_study_db.py`` and writes ``merged-dataset-<YYYY-MM-DD-HHMMSS>.csv`` next to this
file. No cleaning is performed: values are carried over verbatim, repeated measurements are
serialised as index-aligned JSON arrays, and the raw exports are never modified.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from collections.abc import Iterable, Sequence
from datetime import UTC, datetime
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BACKEND_DIR / "data"
OUTPUT_DIR = Path(__file__).resolve().parent / "datasets"
EXPORT_DIR_PREFIX = "study_db_export_"

SESSION_TABLE = "participantsession"
DEMOGRAPHICS_TABLE = "demographics"
ADHD_TABLE = "adhdscreeningresponse"
PANAS_PRE_TABLE = "panaspreresponse"
PANAS_POST_TABLE = "panaspostresponse"
FAM_TABLE = "famresponse"
UES_TABLE = "uesresponse"
QUIZ_TABLE = "quizsubmission"
INTERACTION_TABLE = "interactionevent"
POST_INTERVENTION_TABLE = "postinterventionresponse"

REQUIRED_TABLES: tuple[str, ...] = (
    SESSION_TABLE,
    DEMOGRAPHICS_TABLE,
    ADHD_TABLE,
    PANAS_PRE_TABLE,
    PANAS_POST_TABLE,
    FAM_TABLE,
    UES_TABLE,
    QUIZ_TABLE,
    INTERACTION_TABLE,
    POST_INTERVENTION_TABLE,
)

# Field maps are ordered ``(target_column, source_column)`` pairs. Their concatenation defines
# the column order of the merged dataset, so keep them in the order given by the analysis plan.
SESSION_FIELDS: tuple[tuple[str, str], ...] = (
    ("participant_id", "id"),
    ("consented", "consented"),
    ("consented_at", "consented_at"),
    ("created_at", "created_at"),
    ("assignment", "assignment"),
    ("subgroup", "subgroup"),
    ("adhd_screen_positive", "adhd_screen_positive"),
)

DEMOGRAPHICS_FIELDS: tuple[tuple[str, str], ...] = (
    ("age", "age"),
    ("gender", "gender"),
    ("highest_education", "highest_education"),
    ("currently_studying", "currently_studying"),
    ("study_background", "study_background"),
    ("adhd_diagnosis", "adhd_diagnosis"),
    ("adhd_official_diagnosis", "adhd_official_diagnosis"),
    ("adhd_medication", "adhd_medication"),
    ("demographics_submitted_at", "submitted_at"),
    ("device", "device"),
)

ADHD_FIELDS: tuple[tuple[str, str], ...] = tuple(
    (f"adhd{item}", f"adhd{item}") for item in range(1, 20)
) + (("adhd_submitted_at", "submitted_at"),)

PANAS_PRE_FIELDS: tuple[tuple[str, str], ...] = tuple(
    (f"prepanas{item}", f"panas{item}") for item in range(1, 21)
) + (("prepanas_submitted_at", "submitted_at"),)

PANAS_POST_FIELDS: tuple[tuple[str, str], ...] = tuple(
    (f"postpanas{item}", f"panas{item}") for item in range(1, 21)
) + (("postpanas_submitted_at", "submitted_at"),)

FAM_FIELDS: tuple[tuple[str, str], ...] = tuple(
    (f"fam{item}", f"fam{item}") for item in range(1, 20)
) + (("fam_submitted_at", "submitted_at"),)

UES_FIELDS: tuple[tuple[str, str], ...] = tuple(
    (f"ues{item}", f"ues{item}") for item in range(1, 32)
) + (("ues_submitted_at", "submitted_at"),)

POST_INTERVENTION_FIELDS: tuple[tuple[str, str], ...] = (
    ("feedback", "open_feedback"),
    ("feedback_submitted_at", "submitted_at"),
)

INTERACTION_FIELDS: tuple[tuple[str, str], ...] = (
    ("interaction_page", "page"),
    ("interaction_type", "event_type"),
    ("interaction_time_occurred", "occurred_at"),
    ("interaction_time_received", "received_at"),
    ("interaction_payload", "payload_json"),
)

# Quizzes that the study design allows exactly once: their values stay scalar.
SINGLE_ATTEMPT_QUIZZES: tuple[tuple[str, str], ...] = (
    ("prequiz", "pre-quiz"),
    ("cq", "control-quiz"),
)

# Quizzes that the study design allows to be repeated: their values become JSON arrays.
REPEATED_QUIZZES: tuple[tuple[str, str], ...] = (
    ("eq_1", "a"),
    ("eq_2", "b"),
    ("eq_3", "c"),
    ("eq_4", "d"),
)

# Columns whose raw source already holds a JSON document; they are re-embedded as JSON values
# instead of JSON strings so that the aggregated arrays stay machine readable.
JSON_SOURCE_COLUMNS = frozenset({"answers_json", "payload_json"})

# Columns that are parsed to integers before aggregation.
INTEGER_SOURCE_COLUMNS = frozenset({"answer_count", "attempt"})


class MergeError(RuntimeError):
    """Raised when the export folder cannot be merged into a dataset."""


def warn(message: str) -> None:
    print(f"Warning: {message}", file=sys.stderr)


def read_table(export_directory: Path, table_name: str) -> list[dict[str, str]]:
    # utf-8-sig also accepts plain UTF-8; it only guards against a byte order mark that a
    # spreadsheet application may have added to a raw export.
    path = export_directory / f"{table_name}.csv"
    with path.open(newline="", encoding="utf-8-sig") as csv_file:
        return list(csv.DictReader(csv_file))


def read_header(export_directory: Path, table_name: str) -> list[str]:
    path = export_directory / f"{table_name}.csv"
    with path.open(newline="", encoding="utf-8-sig") as csv_file:
        return next(csv.reader(csv_file), [])


def resolve_export_directory(data_directory: Path, export_folder: str | None) -> Path:
    if not data_directory.is_dir():
        raise MergeError(f"Data directory not found: {data_directory}")

    if export_folder is not None:
        candidate = Path(export_folder)
        if not candidate.is_absolute():
            candidate = data_directory / export_folder
        if not candidate.is_dir():
            raise MergeError(
                f"Export folder not found: {candidate}. "
                f"Pass a folder name that exists inside {data_directory}."
            )
        return candidate

    candidates = sorted(
        item for item in data_directory.glob(f"{EXPORT_DIR_PREFIX}*") if item.is_dir()
    )
    if not candidates:
        raise MergeError(
            f"No '{EXPORT_DIR_PREFIX}*' folder found in {data_directory}. "
            "Run export_study_db.py first."
        )
    return candidates[-1]


def required_source_columns() -> dict[str, set[str]]:
    """Return the raw columns each table must provide for the merge to be complete."""
    return {
        SESSION_TABLE: {source for _, source in SESSION_FIELDS},
        DEMOGRAPHICS_TABLE: {"participant_id", *(source for _, source in DEMOGRAPHICS_FIELDS)},
        ADHD_TABLE: {"participant_id", *(source for _, source in ADHD_FIELDS)},
        PANAS_PRE_TABLE: {"participant_id", *(source for _, source in PANAS_PRE_FIELDS)},
        PANAS_POST_TABLE: {"participant_id", *(source for _, source in PANAS_POST_FIELDS)},
        FAM_TABLE: {"participant_id", *(source for _, source in FAM_FIELDS)},
        UES_TABLE: {"participant_id", *(source for _, source in UES_FIELDS)},
        QUIZ_TABLE: {
            "participant_id",
            "topic_id",
            "attempt",
            "answers_json",
            "answer_count",
            "submitted_at",
        },
        INTERACTION_TABLE: {"participant_id", *(source for _, source in INTERACTION_FIELDS)},
        POST_INTERVENTION_TABLE: {
            "participant_id",
            *(source for _, source in POST_INTERVENTION_FIELDS),
        },
    }


def verify_export(export_directory: Path) -> None:
    """Fail early and descriptively on an incomplete or schema-drifted export folder."""
    missing_tables = [
        f"{table}.csv"
        for table in REQUIRED_TABLES
        if not (export_directory / f"{table}.csv").is_file()
    ]
    if missing_tables:
        raise MergeError(
            f"Incomplete export in {export_directory}. Missing raw table(s): "
            f"{', '.join(missing_tables)}. The merged dataset cannot be created."
        )

    problems: list[str] = []
    for table, required in required_source_columns().items():
        missing_columns = sorted(required - set(read_header(export_directory, table)))
        if missing_columns:
            problems.append(f"{table}.csv is missing column(s): {', '.join(missing_columns)}")
    if problems:
        raise MergeError(
            f"Unexpected raw table schema in {export_directory}. "
            f"{'; '.join(problems)}. The merged dataset cannot be created."
        )


def build_column_order() -> list[str]:
    columns: list[str] = []
    for field_map in (
        SESSION_FIELDS,
        DEMOGRAPHICS_FIELDS,
        ADHD_FIELDS,
        PANAS_PRE_FIELDS,
        PANAS_POST_FIELDS,
        FAM_FIELDS,
        UES_FIELDS,
    ):
        columns.extend(target for target, _ in field_map)

    prefix, _ = SINGLE_ATTEMPT_QUIZZES[0]
    columns.extend([f"{prefix}_answers", f"{prefix}_answers_count", f"{prefix}_submitted_at"])

    for prefix, _ in REPEATED_QUIZZES:
        columns.extend(
            [
                f"{prefix}_answers",
                f"{prefix}_answers_count",
                f"{prefix}_attempts",
                f"{prefix}_submitted_at",
            ]
        )

    prefix, _ = SINGLE_ATTEMPT_QUIZZES[1]
    columns.extend([f"{prefix}_answers", f"{prefix}_answers_count", f"{prefix}_submitted_at"])

    columns.extend(target for target, _ in INTERACTION_FIELDS)
    columns.extend(target for target, _ in POST_INTERVENTION_FIELDS)
    return columns


def group_by_participant(
    rows: Iterable[dict[str, str]],
    key: str = "participant_id",
) -> dict[str, list[dict[str, str]]]:
    grouped: dict[str, list[dict[str, str]]] = {}
    for row in rows:
        grouped.setdefault(row[key], []).append(row)
    return grouped


def report_unknown_participants(
    grouped: dict[str, list[dict[str, str]]],
    known_participants: Sequence[str],
    table_name: str,
) -> None:
    unknown = sorted(set(grouped) - set(known_participants))
    if unknown:
        warn(
            f"{table_name}.csv references {len(unknown)} participant id(s) that are absent from "
            f"{SESSION_TABLE}.csv: {', '.join(unknown)}. Their rows are not merged."
        )


def sort_key_submitted_at(row: dict[str, str]) -> tuple[str, int]:
    return row.get("submitted_at", ""), parse_int(row.get("id"), default=0)


def sort_key_attempt(row: dict[str, str]) -> tuple[int, str]:
    return parse_int(row.get("attempt"), default=0), row.get("submitted_at", "")


def sort_key_occurred_at(row: dict[str, str]) -> tuple[str, int]:
    return row.get("occurred_at", ""), parse_int(row.get("id"), default=0)


def parse_int(value: str | None, default: int) -> int:
    try:
        return int(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return default


def convert_value(source_column: str, value: str) -> object:
    """Return the value in the representation used inside aggregated JSON arrays."""
    if value == "":
        return None
    if source_column in JSON_SOURCE_COLUMNS:
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            warn(f"Column '{source_column}' holds invalid JSON; kept as raw string.")
            return value
    if source_column in INTEGER_SOURCE_COLUMNS:
        try:
            return int(value)
        except ValueError:
            return value
    return value


def latest_row(
    rows: Sequence[dict[str, str]],
    table_name: str,
    participant_id: str,
) -> dict[str, str]:
    """Return the most recent row, warning when a table unexpectedly holds repeated rows."""
    if len(rows) > 1:
        warn(
            f"{table_name} holds {len(rows)} rows for participant {participant_id}; "
            "the most recent one is used."
        )
    return max(rows, key=sort_key_submitted_at)


def merge_flat_table(
    record: dict[str, object],
    rows: Sequence[dict[str, str]] | None,
    field_map: Sequence[tuple[str, str]],
    table_name: str,
    participant_id: str,
) -> None:
    if not rows:
        for target, _ in field_map:
            record[target] = ""
        return

    row = latest_row(rows, table_name, participant_id)
    for target, source in field_map:
        record[target] = row.get(source, "")


def merge_single_attempt_quiz(
    record: dict[str, object],
    prefix: str,
    rows: Sequence[dict[str, str]],
    participant_id: str,
) -> None:
    if not rows:
        record[f"{prefix}_answers"] = ""
        record[f"{prefix}_answers_count"] = ""
        record[f"{prefix}_submitted_at"] = ""
        return

    row = latest_row(rows, f"{QUIZ_TABLE} ({prefix})", participant_id)
    record[f"{prefix}_answers"] = row.get("answers_json", "")
    record[f"{prefix}_answers_count"] = row.get("answer_count", "")
    record[f"{prefix}_submitted_at"] = row.get("submitted_at", "")


def merge_repeated_quiz(
    record: dict[str, object],
    prefix: str,
    rows: Sequence[dict[str, str]],
) -> None:
    ordered = sorted(rows, key=sort_key_attempt)
    record[f"{prefix}_answers"] = dump_series(ordered, "answers_json")
    record[f"{prefix}_answers_count"] = dump_series(ordered, "answer_count")
    record[f"{prefix}_attempts"] = dump_series(ordered, "attempt")
    record[f"{prefix}_submitted_at"] = dump_series(ordered, "submitted_at")


def merge_interaction_events(
    record: dict[str, object],
    rows: Sequence[dict[str, str]],
) -> None:
    ordered = sorted(rows, key=sort_key_occurred_at)
    for target, source in INTERACTION_FIELDS:
        record[target] = dump_series(ordered, source)


def dump_series(rows: Sequence[dict[str, str]], source_column: str) -> str:
    """Serialise one column of an ordered row sequence as a JSON array.

    Empty sequences become ``[]`` so that the column type stays stable across participants.
    """
    values = [convert_value(source_column, row.get(source_column, "")) for row in rows]
    return json.dumps(values, ensure_ascii=False)


def build_records(export_directory: Path) -> list[dict[str, object]]:
    sessions = read_table(export_directory, SESSION_TABLE)
    if not sessions:
        warn(f"{SESSION_TABLE}.csv contains no participants; the merged dataset stays empty.")

    tables = {
        table: read_table(export_directory, table)
        for table in REQUIRED_TABLES
        if table != SESSION_TABLE
    }
    grouped = {table: group_by_participant(rows) for table, rows in tables.items()}

    participant_ids = [session["id"] for session in sessions]
    duplicates = sorted({item for item in participant_ids if participant_ids.count(item) > 1})
    if duplicates:
        warn(f"{SESSION_TABLE}.csv contains duplicate participant id(s): {', '.join(duplicates)}.")
    for table, rows_by_participant in grouped.items():
        report_unknown_participants(rows_by_participant, participant_ids, table)

    flat_tables = (
        (DEMOGRAPHICS_TABLE, DEMOGRAPHICS_FIELDS),
        (ADHD_TABLE, ADHD_FIELDS),
        (PANAS_PRE_TABLE, PANAS_PRE_FIELDS),
        (PANAS_POST_TABLE, PANAS_POST_FIELDS),
        (FAM_TABLE, FAM_FIELDS),
        (UES_TABLE, UES_FIELDS),
    )

    records: list[dict[str, object]] = []
    for session in sorted(sessions, key=lambda row: (row.get("created_at", ""), row["id"])):
        participant_id = session["id"]
        record: dict[str, object] = {
            target: session.get(source, "") for target, source in SESSION_FIELDS
        }

        for table, field_map in flat_tables:
            merge_flat_table(
                record,
                grouped[table].get(participant_id),
                field_map,
                table,
                participant_id,
            )

        quiz_rows = grouped[QUIZ_TABLE].get(participant_id, [])
        by_topic = group_by_participant(quiz_rows, key="topic_id")
        merge_single_attempt_quiz(
            record,
            SINGLE_ATTEMPT_QUIZZES[0][0],
            by_topic.get(SINGLE_ATTEMPT_QUIZZES[0][1], []),
            participant_id,
        )
        for prefix, topic_id in REPEATED_QUIZZES:
            merge_repeated_quiz(record, prefix, by_topic.get(topic_id, []))
        merge_single_attempt_quiz(
            record,
            SINGLE_ATTEMPT_QUIZZES[1][0],
            by_topic.get(SINGLE_ATTEMPT_QUIZZES[1][1], []),
            participant_id,
        )

        unexpected_topics = sorted(
            set(by_topic)
            - {topic for _, topic in SINGLE_ATTEMPT_QUIZZES}
            - {topic for _, topic in REPEATED_QUIZZES}
        )
        if unexpected_topics:
            warn(
                f"{QUIZ_TABLE}.csv holds unmapped topic_id(s) for participant {participant_id}: "
                f"{', '.join(unexpected_topics)}. They are not merged."
            )

        merge_interaction_events(record, grouped[INTERACTION_TABLE].get(participant_id, []))
        merge_flat_table(
            record,
            grouped[POST_INTERVENTION_TABLE].get(participant_id),
            POST_INTERVENTION_FIELDS,
            POST_INTERVENTION_TABLE,
            participant_id,
        )
        records.append(record)

    return records


def write_dataset(records: Sequence[dict[str, object]], output_directory: Path) -> Path:
    output_directory.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
    output_path = output_directory / f"merged-dataset-{timestamp}.csv"

    with output_path.open("w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=build_column_order())
        writer.writeheader()
        writer.writerows(records)

    return output_path


def merge_export(
    data_directory: Path,
    export_folder: str | None,
    output_directory: Path,
) -> Path:
    export_directory = resolve_export_directory(data_directory, export_folder)
    verify_export(export_directory)
    print(f"Merging raw tables from: {export_directory}")

    records = build_records(export_directory)
    output_path = write_dataset(records, output_directory)

    print(f"Merged {len(records)} participant row(s) into {len(build_column_order())} columns")
    print(f"Merged dataset written to: {output_path}")
    return output_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Merge one raw study.db CSV export into a single dataset with one row per participant."
        ),
    )
    parser.add_argument(
        "export_folder",
        nargs="?",
        default=None,
        help=(
            "Name of the export folder inside the data directory. Defaults to the most recent one."
        ),
    )
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=DATA_DIR,
        help=f"Directory holding the export folders. Defaults to {DATA_DIR}.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=OUTPUT_DIR,
        help=f"Directory the merged dataset is written to. Defaults to {OUTPUT_DIR}.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    try:
        merge_export(args.data_dir, args.export_folder, args.output_dir)
    except MergeError as error:
        print(f"Error: {error}", file=sys.stderr)
        raise SystemExit(1) from error


if __name__ == "__main__":
    main()
