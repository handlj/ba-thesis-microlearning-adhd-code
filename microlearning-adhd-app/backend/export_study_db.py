from __future__ import annotations

import csv
import sqlite3
from datetime import UTC, datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DEFAULT_DB_PATH = DATA_DIR / "study.db"

_OUTPUT_PATH = BASE_DIR.parent / "data" / "exports" / "study_db"


def quote_identifier(identifier: str) -> str:
    return f'"{identifier.replace(chr(34), chr(34) * 2)}"'


def get_table_names(connection: sqlite3.Connection) -> list[str]:
    rows = connection.execute(
        """
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name NOT LIKE 'sqlite_%'
          AND name NOT LIKE 'vouchercode'
        ORDER BY name
        """
    ).fetchall()
    return [row[0] for row in rows]


def export_table(
    connection: sqlite3.Connection,
    table_name: str,
    output_directory: Path,
) -> int:
    cursor = connection.execute(f"SELECT * FROM {quote_identifier(table_name)}")
    output_path = output_directory / f"{table_name}.csv"

    with output_path.open("w", newline="", encoding="utf-8") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow([column[0] for column in cursor.description])
        row_count = 0
        for row in cursor:
            writer.writerow(row)
            row_count += 1

    return row_count


def export_database(db_path: Path, output_root: Path) -> Path:
    if not db_path.exists():
        raise FileNotFoundError(f"Database file not found: {db_path}")

    timestamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
    output_directory = output_root / f"study_db_export_{timestamp}"
    output_directory.mkdir(parents=True, exist_ok=False)

    with sqlite3.connect(db_path) as connection:
        table_names = get_table_names(connection)

        for table_name in table_names:
            row_count = export_table(connection, table_name, output_directory)
            print(f"Exported {table_name}: {row_count} rows")

    print(f"CSV export written to: {output_directory}")
    return output_directory


def main() -> None:
    export_database(DEFAULT_DB_PATH, _OUTPUT_PATH)


if __name__ == "__main__":
    main()
