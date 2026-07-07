from pydantic import BaseModel
from datetime import datetime

class LikertQuestionnaireRequest(BaseModel):
    assignment: str
    answers: dict[str, int]


class QuestionnaireResponsePayload(BaseModel):
    participant_id: str
    submitted_at: datetime