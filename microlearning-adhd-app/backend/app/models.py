from datetime import datetime
from uuid import uuid4

from sqlmodel import Field, SQLModel


class ParticipantSession(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    consented: bool
    consented_at: datetime
    created_at: datetime
    assignment: str | None = None
    adhd_screen_positive: bool | None = None


class Demographics(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    age: int
    study_background: str
    adhd_diagnosis: str
    submitted_at: datetime


class InteractionEvent(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    group: str
    page: str
    event_type: str
    occurred_at: datetime
    received_at: datetime
    payload_json: str | None = None


class PostInterventionResponse(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    assignment: str
    open_feedback: str
    submitted_at: datetime


class AdhdScreeningResponse(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    assignment: str
    adhd1: int
    adhd2: int
    adhd3: int
    adhd4: int
    adhd5: int
    adhd6: int
    submitted_at: datetime


class PanasPreResponse(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    assignment: str
    panas1: int
    panas2: int
    panas3: int
    panas4: int
    panas5: int
    panas6: int
    panas7: int
    panas8: int
    panas9: int
    panas10: int
    panas11: int
    panas12: int
    panas13: int
    panas14: int
    panas15: int
    panas16: int
    panas17: int
    panas18: int
    panas19: int
    panas20: int
    submitted_at: datetime


class PanasPostResponse(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    assignment: str
    panas1: int
    panas2: int
    panas3: int
    panas4: int
    panas5: int
    panas6: int
    panas7: int
    panas8: int
    panas9: int
    panas10: int
    panas11: int
    panas12: int
    panas13: int
    panas14: int
    panas15: int
    panas16: int
    panas17: int
    panas18: int
    panas19: int
    panas20: int
    submitted_at: datetime


class FamResponse(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    assignment: str
    fam1: int
    fam2: int
    fam3: int
    fam4: int
    fam5: int
    fam6: int
    fam7: int
    fam8: int
    fam9: int
    fam10: int
    fam11: int
    fam12: int
    fam13: int
    fam14: int
    fam15: int
    fam16: int
    fam17: int
    fam18: int
    submitted_at: datetime


class UesResponse(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    participant_id: str = Field(foreign_key="participantsession.id")
    assignment: str
    ues1: int
    ues2: int
    ues3: int
    ues4: int
    ues5: int
    ues6: int
    ues7: int
    ues8: int
    ues9: int
    ues10: int
    ues11: int
    ues12: int
    ues13: int
    ues14: int
    ues15: int
    ues16: int
    ues17: int
    ues18: int
    ues19: int
    ues20: int
    ues21: int
    ues22: int
    ues23: int
    ues24: int
    ues25: int
    ues26: int
    ues27: int
    ues28: int
    ues29: int
    ues30: int
    submitted_at: datetime


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
