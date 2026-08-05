from datetime import datetime

from pydantic import BaseModel


class InteractionEventRequest(BaseModel):
    assignment: str
    subgroup: str
    page: str
    event_type: str
    occurred_at: datetime
    payload: dict[str, str | int | float | bool | None] | None = None


class InteractionEventResponse(BaseModel):
    id: int
    received_at: datetime
