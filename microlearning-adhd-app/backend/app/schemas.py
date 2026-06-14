from datetime import datetime

from pydantic import BaseModel


class ControlVideo(BaseModel):
    title: str
    description: str
    video_url: str


class InstructionVideo(BaseModel):
    video_url: str


class ExperimentalVideo(BaseModel):
    id: str
    title: str
    description: str
    video_url: str


class ConsentRequest(BaseModel):
    consented: bool


class ConsentResponse(BaseModel):
    participant_id: str
    consented_at: datetime


class DemographicsRequest(BaseModel):
    age: int
    study_background: str
    adhd_diagnosis: str


class DemographicsResponse(BaseModel):
    participant_id: str
    assignment: str


class InteractionEventRequest(BaseModel):
    group: str
    page: str
    event_type: str
    occurred_at: datetime
    payload: dict[str, str | int | float | bool | None] | None = None


class InteractionEventResponse(BaseModel):
    id: int
    received_at: datetime


class PostInterventionRequest(BaseModel):
    assignment: str
    attention_support: str
    content_clarity: str
    workload_fit: str
    preferred_format: str
    open_feedback: str


class PostInterventionResponsePayload(BaseModel):
    participant_id: str
    submitted_at: datetime


class LikertQuestionnaireRequest(BaseModel):
    assignment: str
    answers: dict[str, int]


class QuestionnaireResponsePayload(BaseModel):
    participant_id: str
    submitted_at: datetime


class QuizSubmissionRequest(BaseModel):
    group: str
    video_id: str | None = None
    video_index: int | None = None
    topic_id: str
    answers: dict[str, list[str]]


class QuizSubmissionResponse(BaseModel):
    participant_id: str
    answer_count: int
    submitted_at: datetime
