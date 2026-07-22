from pydantic import BaseModel
from datetime import datetime

class PostInterventionRequest(BaseModel):
    assignment: str
    open_feedback: str


class PostInterventionResponsePayload(BaseModel):
    participant_id: str
    submitted_at: datetime
