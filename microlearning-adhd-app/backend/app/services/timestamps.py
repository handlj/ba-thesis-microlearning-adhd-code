from datetime import UTC, datetime


def current_utc_timestamp() -> datetime:
    return datetime.now(UTC)
