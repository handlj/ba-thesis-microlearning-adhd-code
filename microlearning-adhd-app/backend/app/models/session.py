from datetime import datetime
from uuid import uuid4

from sqlmodel import Field, SQLModel

from app.timestamps import UtcDateTime


class ParticipantSession(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    consented: bool
    consented_at: datetime = Field(sa_type=UtcDateTime)
    created_at: datetime = Field(sa_type=UtcDateTime)
    assignment: str | None = None
    subgroup: str | None = None
    adhd_screen_positive: bool | None = None
    prior_programming_experience_score: int | None = None
