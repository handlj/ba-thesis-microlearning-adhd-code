from datetime import datetime

from pydantic import BaseModel


class PostInterventionRequest(BaseModel):
    assignment: str
    subgroup: str
    open_feedback: str


class PostInterventionResponsePayload(BaseModel):
    participant_id: str
    submitted_at: datetime
