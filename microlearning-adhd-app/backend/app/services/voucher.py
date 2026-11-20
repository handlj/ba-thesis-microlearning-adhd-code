import csv
import os
import secrets
from pathlib import Path
from threading import Lock

from app.config.config import VOUCHER_CODES_PATH
from app.config.errors import ERROR_VOUCHER_CODES_INVALID, ERROR_VOUCHER_CODES_MISSING
from app.config.voucher import (
    VOUCHER_CODE_COUNT,
    VOUCHER_CODE_DIGITS,
    VOUCHER_CODE_GROUP_SIZE,
    VOUCHER_CSV_HEADER,
    VOUCHER_ISSUED,
    VOUCHER_UNISSUED,
)

_voucher_lock = Lock()


def generate_voucher_code() -> str:
    return f"{secrets.randbelow(10**VOUCHER_CODE_DIGITS):0{VOUCHER_CODE_DIGITS}d}"


def format_voucher_code(code: str) -> str:
    return "-".join(
        code[i : i + VOUCHER_CODE_GROUP_SIZE] for i in range(0, len(code), VOUCHER_CODE_GROUP_SIZE)
    )


def generate_voucher_codes(count: int) -> list[str]:
    codes: set[str] = set()
    while len(codes) < count:
        codes.add(format_voucher_code(generate_voucher_code()))
    return sorted(codes)


def create_voucher_codes(path: Path) -> list[str]:
    codes = generate_voucher_codes(VOUCHER_CODE_COUNT)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "x", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(VOUCHER_CSV_HEADER)
        writer.writerows([code, VOUCHER_UNISSUED] for code in codes)
        file.flush()
        os.fsync(file.fileno())
    _sync_directory(path.parent)
    return codes


def _is_well_formed(code: str) -> bool:
    digits = code.replace("-", "")
    return (
        len(digits) == VOUCHER_CODE_DIGITS
        and digits.isascii()
        and digits.isdigit()
        and format_voucher_code(digits) == code
    )


def _invalid(path: Path, reason: str) -> ValueError:
    return ValueError(ERROR_VOUCHER_CODES_INVALID.format(path=path, reason=reason))


def read_voucher_codes(path: Path) -> list[list[str]]:
    if not path.is_file():
        raise FileNotFoundError(ERROR_VOUCHER_CODES_MISSING.format(path=path))

    with open(path, newline="", encoding="utf-8") as file:
        content = list(csv.reader(file))

    if not content or content[0] != VOUCHER_CSV_HEADER:
        raise _invalid(path, f"header must be {','.join(VOUCHER_CSV_HEADER)}")

    rows = content[1:]
    if len(rows) != VOUCHER_CODE_COUNT:
        raise _invalid(path, f"expected {VOUCHER_CODE_COUNT} codes, found {len(rows)}")
    if any(len(row) != len(VOUCHER_CSV_HEADER) for row in rows):
        raise _invalid(path, "every row needs a code and an issued value")

    codes = [code for code, _ in rows]
    if len(set(codes)) != len(codes):
        raise _invalid(path, "duplicate codes")
    if not all(_is_well_formed(code) for code in codes):
        raise _invalid(path, "malformed codes")
    if any(issued not in (VOUCHER_ISSUED, VOUCHER_UNISSUED) for _, issued in rows):
        raise _invalid(path, f"issued values must be {VOUCHER_ISSUED} or {VOUCHER_UNISSUED}")

    return rows


def _sync_directory(directory: Path) -> None:
    descriptor = os.open(directory, os.O_RDONLY)
    try:
        os.fsync(descriptor)
    finally:
        os.close(descriptor)


def write_voucher_codes(path: Path, rows: list[list[str]]) -> None:
    temporary_path = path.with_name(f"{path.name}.tmp")
    with open(temporary_path, "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(VOUCHER_CSV_HEADER)
        writer.writerows(rows)
        file.flush()
        os.fsync(file.fileno())
    os.replace(temporary_path, path)
    _sync_directory(path.parent)


def draw_voucher_code() -> str | None:
    with _voucher_lock:
        rows = read_voucher_codes(VOUCHER_CODES_PATH)
        unissued = [row for row in rows if row[1] == VOUCHER_UNISSUED]
        if not unissued:
            return None

        drawn = secrets.choice(unissued)
        drawn[1] = VOUCHER_ISSUED
        write_voucher_codes(VOUCHER_CODES_PATH, rows)
        return drawn[0]


def release_voucher_code(code: str) -> None:
    with _voucher_lock:
        rows = read_voucher_codes(VOUCHER_CODES_PATH)
        for row in rows:
            if row[0] == code:
                row[1] = VOUCHER_UNISSUED
        write_voucher_codes(VOUCHER_CODES_PATH, rows)


def ensure_voucher_codes_ready() -> None:
    read_voucher_codes(VOUCHER_CODES_PATH)
