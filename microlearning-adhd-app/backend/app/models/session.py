from datetime import datetime
from uuid import uuid4
from sqlmodel import Field, Field, SQLModel

class ParticipantSession(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    consented: bool
    consented_at: datetime
    created_at: datetime
    assignment: str | None = None
    adhd_screen_positive: bool | None = None
