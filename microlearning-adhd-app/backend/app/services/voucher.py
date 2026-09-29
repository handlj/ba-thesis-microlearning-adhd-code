import secrets

from app.config.voucher import VOUCHER_CODE_DIGITS, VOUCHER_CODE_GROUP_SIZE


def generate_voucher_code() -> str:
    return f"{secrets.randbelow(10**VOUCHER_CODE_DIGITS):0{VOUCHER_CODE_DIGITS}d}"


def format_voucher_code(code: str) -> str:
    return "-".join(
        code[i : i + VOUCHER_CODE_GROUP_SIZE] for i in range(0, len(code), VOUCHER_CODE_GROUP_SIZE)
    )
