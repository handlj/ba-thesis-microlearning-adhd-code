import csv
import sqlite3
from pathlib import Path

from app.config.config import DATA_DIR
from app.services.voucher import format_voucher_code

_BASE_DIR = Path(__file__).resolve().parent

_OUTPUT_PATH = _BASE_DIR.parent / "data" / "exports" / "voucher_codes" / "voucher-codes-export.csv"
EXPORT_HEADER_ROW = ["Vouchercodes"]

SELECTION_QUERY = "SELECT code FROM vouchercode ORDER BY code"


def main() -> None:
    connection = sqlite3.connect(f"file:{DATA_DIR / 'study.db'}?mode=ro", uri=True)
    try:
        codes = [row[0] for row in connection.execute(SELECTION_QUERY)]
    finally:
        connection.close()

    _OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    with open(_OUTPUT_PATH, "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(EXPORT_HEADER_ROW)
        writer.writerows([format_voucher_code(code)] for code in codes)

    print(f"{len(codes)} voucher codes written to {_OUTPUT_PATH}")


if __name__ == "__main__":
    main()
