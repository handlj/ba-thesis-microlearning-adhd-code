from datetime import datetime
from sqlmodel import Field, SQLModel

class PostInterventionResponse(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    assignment: str
    open_feedback: str
    submitted_at: datetime
