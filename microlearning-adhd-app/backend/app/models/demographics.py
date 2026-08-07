from datetime import datetime

from sqlmodel import Field, SQLModel

from app.timestamps import UtcDateTime


class Demographics(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    age: int
    gender: str
    highest_education: str
    currently_studying: str
    study_background: str
    adhd_diagnosis: str
    adhd_official_diagnosis: str
    adhd_medication: str
    device: str
    submitted_at: datetime = Field(sa_type=UtcDateTime)
