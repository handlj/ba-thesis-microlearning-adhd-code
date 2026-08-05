from datetime import datetime

from pydantic import BaseModel


class LikertQuestionnaireRequest(BaseModel):
    assignment: str
    subgroup: str
    answers: dict[str, int]


class QuestionnaireResponsePayload(BaseModel):
    participant_id: str
    submitted_at: datetime
