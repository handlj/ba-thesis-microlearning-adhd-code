from datetime import datetime
from sqlmodel import Field, Field, SQLModel

class InteractionEvent(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    group: str
    page: str
    event_type: str
    occurred_at: datetime
    received_at: datetime
    payload_json: str | None = None
