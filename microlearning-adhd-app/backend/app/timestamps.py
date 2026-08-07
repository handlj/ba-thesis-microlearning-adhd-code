from datetime import UTC, datetime
from typing import Annotated

from pydantic import AfterValidator, AwareDatetime
from sqlalchemy import String, TypeDecorator

from app.config import ERROR_NAIVE_TIMESTAMP_WRITE

CANONICAL_TIMESTAMP_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"
CANONICAL_TIMESTAMP_LENGTH = 32


def current_utc_timestamp() -> datetime:
    return datetime.now(UTC)


def _to_utc(value: datetime) -> datetime:
    return value.astimezone(UTC)


UtcTimestamp = Annotated[AwareDatetime, AfterValidator(_to_utc)]


class UtcDateTime(TypeDecorator[datetime]):
    impl = String(CANONICAL_TIMESTAMP_LENGTH)
    cache_ok = True

    def process_bind_param(self, value: datetime | None, dialect) -> str | None:
        if value is None:
            return None
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError(ERROR_NAIVE_TIMESTAMP_WRITE)
        return _to_utc(value).strftime(CANONICAL_TIMESTAMP_FORMAT)

    def process_result_value(self, value: str | None, dialect) -> datetime | None:
        if value is None:
            return None
        parsed = datetime.fromisoformat(value)
        return parsed if parsed.tzinfo is not None else parsed.replace(tzinfo=UTC)
