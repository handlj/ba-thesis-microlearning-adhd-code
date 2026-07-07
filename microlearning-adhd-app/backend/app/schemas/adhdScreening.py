from pydantic import BaseModel
from datetime import datetime

class AdhdScreeningRequest(BaseModel):
    answers: dict[str, int]


class AdhdScreeningResponsePayload(BaseModel):
    participant_id: str
    assignment: str
    submitted_at: datetime
