from datetime import datetime

from sqlmodel import Field, SQLModel

from app.timestamps import UtcDateTime


class Demographics(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    submitted_at: datetime = Field(sa_type=UtcDateTime)
    age: int
    gender: str
    gender_other: str
    highest_education: str
    currently_studying: str
    study_background: str
    adhd_diagnosis: str
    adhd_official_diagnosis: str
    adhd_medication: str
    has_other_diagnoses: str
    other_diagnoses: str
    device: str
    python_programming_experience: str
    python_programming_ability: str
    other_programming_experience: str
    other_programming_languages: str
    general_programming_ability: str
    prior_programming_experience_score: int
