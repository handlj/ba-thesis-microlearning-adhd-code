from pydantic import BaseModel

from app.timestamps import UtcTimestamp


class InteractionEventRequest(BaseModel):
    assignment: str
    subgroup: str
    page: str
    event_type: str
    occurred_at: UtcTimestamp
    payload: dict[str, str | int | float | bool | None] | None = None


class InteractionEventResponse(BaseModel):
    id: int
    received_at: UtcTimestamp
