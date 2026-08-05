from datetime import datetime

from pydantic import BaseModel


class AdhdScreeningRequest(BaseModel):
    answers: dict[str, int]


class AdhdScreeningResponsePayload(BaseModel):
    participant_id: str
    assignment: str
    subgroup: str
    submitted_at: datetime
