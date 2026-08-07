from datetime import datetime

from sqlmodel import Field, SQLModel

from app.timestamps import UtcDateTime


class PostInterventionResponse(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    assignment: str
    subgroup: str
    open_feedback: str
    submitted_at: datetime = Field(sa_type=UtcDateTime)
