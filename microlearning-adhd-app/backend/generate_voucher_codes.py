import sys

from app.config.config import VOUCHER_CODES_PATH
from app.services.voucher import create_voucher_codes


def main() -> None:
    try:
        codes = create_voucher_codes(VOUCHER_CODES_PATH)
    except FileExistsError:
        sys.exit(f"{VOUCHER_CODES_PATH} already exists and was left unchanged.")

    print(f"{len(codes)} voucher codes written to {VOUCHER_CODES_PATH}")


if __name__ == "__main__":
    main()
