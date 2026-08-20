from datetime import datetime

from sqlmodel import Field, SQLModel

from app.timestamps import UtcDateTime


class AllocationLog(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    adhd_screen_positive: bool
    prior_programming_experience_score: int | None = None
    score_missing: bool = False
    state_before_json: str
    imbalance_json: str
    preferred_conditions: str
    took_preferred: bool
    assignment: str
    subgroup: str
    allocated_at: datetime = Field(sa_type=UtcDateTime)
