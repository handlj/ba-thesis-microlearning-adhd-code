from datetime import datetime
from sqlmodel import Field, SQLModel

class QuizAnswer(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    group: str
    video_id: str | None = None
    video_index: int | None = None
    topic_id: str
    question_id: str
    selected_options: str
    submitted_at: datetime
