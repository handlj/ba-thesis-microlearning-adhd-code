from datetime import datetime
from sqlmodel import Field, SQLModel

class Demographics(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    age: int
    study_background: str
    adhd_diagnosis: str
    submitted_at: datetime
