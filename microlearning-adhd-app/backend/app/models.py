from datetime import datetime
from uuid import uuid4

from sqlmodel import Field, SQLModel


class ParticipantSession(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    consented: bool
    consented_at: datetime
    created_at: datetime
    assignment: str | None = None


class Demographics(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    age: int
    study_background: str
    adhd_diagnosis: str
    submitted_at: datetime


class InteractionEvent(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    group: str
    page: str
    event_type: str
    occurred_at: datetime
    received_at: datetime
    payload_json: str | None = None


class PostInterventionResponse(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    assignment: str
    attention_support: str
    content_clarity: str
    workload_fit: str
    preferred_format: str
    open_feedback: str
    submitted_at: datetime
