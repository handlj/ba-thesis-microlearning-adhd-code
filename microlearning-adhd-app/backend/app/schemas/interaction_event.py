from pydantic import BaseModel
from datetime import datetime

class InteractionEventRequest(BaseModel):
    group: str
    page: str
    event_type: str
    occurred_at: datetime
    payload: dict[str, str | int | float | bool | None] | None = None


class InteractionEventResponse(BaseModel):
    id: int
    received_at: datetime