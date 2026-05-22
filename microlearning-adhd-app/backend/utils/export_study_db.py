#!/usr/bin/env python3

from __future__ import annotations

import argparse
import csv
import sqlite3
from datetime import datetime
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DEFAULT_DB_PATH = DATA_DIR / "study.db"


def quote_identifier(identifier: str) -> str:
    return f'"{identifier.replace(chr(34), chr(34) * 2)}"'


def get_table_names(connection: sqlite3.Connection) -> list[str]:
    rows = connection.execute(
        """
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name NOT LIKE 'sqlite_%'
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

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_directory = output_root / f"study_db_export_{timestamp}"
    output_directory.mkdir(parents=True, exist_ok=False)

    with sqlite3.connect(db_path) as connection:
        table_names = get_table_names(connection)

        for table_name in table_names:
            row_count = export_table(connection, table_name, output_directory)
            print(f"Exported {table_name}: {row_count} rows")

    print(f"CSV export written to: {output_directory}")
    return output_directory


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Export every user table from study.db to CSV files.",
    )
    parser.add_argument(
        "--db",
        type=Path,
        default=DEFAULT_DB_PATH,
        help=f"Path to the SQLite database. Defaults to {DEFAULT_DB_PATH}.",
    )
    parser.add_argument(
        "--output-root",
        type=Path,
        default=DATA_DIR,
        help=f"Directory where the export folder is created. Defaults to {DATA_DIR}.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    export_database(args.db, args.output_root)


if __name__ == "__main__":
    main()
