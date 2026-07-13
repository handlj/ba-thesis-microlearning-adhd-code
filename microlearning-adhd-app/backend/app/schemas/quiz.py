from pydantic import BaseModel
from datetime import datetime

class QuizSubmissionRequest(BaseModel):
    group: str
    video_id: str | None = None
    video_index: int | None = None
    topic_id: str
    answers: dict[str, list[str]]
    attempt: int | None = None


class QuizSubmissionResponse(BaseModel):
    participant_id: str
    answer_count: int
    submitted_at: datetime
