from datetime import datetime

from sqlmodel import Field, SQLModel, UniqueConstraint


class QuizSubmission(SQLModel, table=True):
    __table_args__ = (
        UniqueConstraint(
            "participant_id",
            "topic_id",
            "attempt",
            name="uq_quiz_submission_participant_topic_attempt",
        ),
    )

    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    assignment: str
    subgroup: str
    video_id: str | None = None
    video_index: int | None = None
    topic_id: str
    answers_json: str
    answer_count: int
    attempt: int = Field(default=1)
    submitted_at: datetime
