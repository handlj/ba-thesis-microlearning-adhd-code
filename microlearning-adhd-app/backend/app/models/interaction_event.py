from datetime import datetime

from sqlmodel import Field, SQLModel

from app.timestamps import UtcDateTime


class InteractionEvent(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    assignment: str
    subgroup: str
    page: str
    event_type: str
    occurred_at: datetime = Field(sa_type=UtcDateTime)
    received_at: datetime = Field(sa_type=UtcDateTime)
    payload_json: str | None = None
