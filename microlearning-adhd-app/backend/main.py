# -------------------------------------
# Microlearning ADHD App - Backend
# -------------------------------------
# This is the main entry point for the FastAPI backend server.

import uvicorn
import json
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from pathlib import Path
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import AsyncGenerator, Generator
from uuid import uuid4


BASE_DIR = Path(__file__).resolve().parent
MEDIA_DIR = BASE_DIR / "media"
DATA_DIR = BASE_DIR / "data"
DATABASE_URL = f"sqlite:///{DATA_DIR / 'study.db'}"

sqlite_engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

VALID_STUDY_BACKGROUNDS = {
    "computer-science",
    "stem-other",
    "non-stem",
    "not-studying",
}
VALID_ADHD_DIAGNOSES = {
    "diagnosed",
    "not-diagnosed",
    "prefer-not-to-say",
}

origins = [
    "http://localhost:5173"
]


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


class ParticipantSession(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    consented: bool
    consented_at: datetime
    created_at: datetime
    assignment: str | None = None


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
    attention_support: str
    content_clarity: str
    workload_fit: str
    preferred_format: str
    open_feedback: str
    submitted_at: datetime


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


def current_utc_timestamp() -> datetime:
    return datetime.now(timezone.utc)


def create_db_and_tables() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    SQLModel.metadata.create_all(sqlite_engine)


def get_session() -> Generator[Session, None, None]:
    with Session(sqlite_engine) as session:
        yield session


def stable_serialize(data: dict[str, str]) -> str:
    return "|".join(f"{key}:{data[key]}" for key in sorted(data))


def hash_djb2(value: str) -> int:
    hash_value = 5381
    for character in value:
        hash_value = ((hash_value * 33) ^ ord(character)) & 0xFFFFFFFF
    return hash_value


def assign_deterministic_group(demographics: DemographicsRequest) -> str:
    serialized = stable_serialize(
        {
            "age": str(demographics.age),
            "studyBackground": demographics.study_background,
            "adhdDiagnosis": demographics.adhd_diagnosis,
        }
    )
    return "control" if hash_djb2(serialized) % 2 == 0 else "experimental"


def ensure_participant_exists(participant_id: str, session: Session) -> ParticipantSession:
    participant = session.exec(
        select(ParticipantSession).where(ParticipantSession.id == participant_id)
    ).first()

    if participant is None:
        raise HTTPException(status_code=404, detail="Participant session not found.")

    return participant


def require_non_empty_text(value: str, field_name: str) -> str:
    normalized_value = value.strip()
    if not normalized_value:
        raise HTTPException(status_code=400, detail=f"{field_name} is required.")

    return normalized_value


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/api/media", StaticFiles(directory=MEDIA_DIR), name="media")


@app.post("/api/participants/consent", response_model=ConsentResponse)
def create_consent_session(
    consent: ConsentRequest,
    session: Session = Depends(get_session),
):
    if not consent.consented:
        raise HTTPException(
            status_code=400,
            detail="Consent must be provided before starting the study.",
        )

    timestamp = current_utc_timestamp()
    participant = ParticipantSession(
        consented=True,
        consented_at=timestamp,
        created_at=timestamp,
    )
    session.add(participant)
    session.commit()
    session.refresh(participant)

    return ConsentResponse(
        participant_id=participant.id,
        consented_at=participant.consented_at,
    )


@app.post(
    "/api/participants/{participant_id}/demographics",
    response_model=DemographicsResponse,
)
def submit_demographics(
    participant_id: str,
    demographics: DemographicsRequest,
    session: Session = Depends(get_session),
):
    participant = ensure_participant_exists(participant_id, session)

    if demographics.age < 13 or demographics.age > 120:
        raise HTTPException(
            status_code=400,
            detail="Age must be between 13 and 120.",
        )

    if demographics.study_background not in VALID_STUDY_BACKGROUNDS:
        raise HTTPException(status_code=400, detail="Invalid study background.")

    if demographics.adhd_diagnosis not in VALID_ADHD_DIAGNOSES:
        raise HTTPException(status_code=400, detail="Invalid ADHD diagnosis status.")

    assignment = assign_deterministic_group(demographics)
    participant.assignment = assignment

    demographics_row = Demographics(
        participant_id=participant.id,
        age=demographics.age,
        study_background=demographics.study_background,
        adhd_diagnosis=demographics.adhd_diagnosis,
        submitted_at=current_utc_timestamp(),
    )
    session.add(participant)
    session.add(demographics_row)
    session.commit()

    return DemographicsResponse(
        participant_id=participant.id,
        assignment=assignment,
    )


@app.post(
    "/api/participants/{participant_id}/events",
    response_model=InteractionEventResponse,
)
def record_interaction_event(
    participant_id: str,
    event: InteractionEventRequest,
    session: Session = Depends(get_session),
):
    ensure_participant_exists(participant_id, session)

    interaction_event = InteractionEvent(
        participant_id=participant_id,
        group=event.group,
        page=event.page,
        event_type=event.event_type,
        occurred_at=event.occurred_at,
        received_at=current_utc_timestamp(),
        payload_json=json.dumps(event.payload) if event.payload else None,
    )
    session.add(interaction_event)
    session.commit()
    session.refresh(interaction_event)

    return InteractionEventResponse(
        id=interaction_event.id,
        received_at=interaction_event.received_at,
    )


@app.post(
    "/api/participants/{participant_id}/post-intervention",
    response_model=PostInterventionResponsePayload,
)
def submit_post_intervention(
    participant_id: str,
    questionnaire: PostInterventionRequest,
    session: Session = Depends(get_session),
):
    ensure_participant_exists(participant_id, session)

    assignment = require_non_empty_text(questionnaire.assignment, "Assignment")
    if assignment not in {"control", "experimental"}:
        raise HTTPException(status_code=400, detail="Invalid assignment.")

    submitted_at = current_utc_timestamp()
    post_intervention_response = PostInterventionResponse(
        participant_id=participant_id,
        assignment=assignment,
        attention_support=require_non_empty_text(
            questionnaire.attention_support,
            "Attention support",
        ),
        content_clarity=require_non_empty_text(
            questionnaire.content_clarity,
            "Content clarity",
        ),
        workload_fit=require_non_empty_text(
            questionnaire.workload_fit,
            "Workload fit",
        ),
        preferred_format=require_non_empty_text(
            questionnaire.preferred_format,
            "Preferred format",
        ),
        open_feedback=require_non_empty_text(
            questionnaire.open_feedback,
            "Open feedback",
        ),
        submitted_at=submitted_at,
    )
    session.add(post_intervention_response)
    session.commit()

    return PostInterventionResponsePayload(
        participant_id=participant_id,
        submitted_at=submitted_at,
    )


@app.get("/api/control-video", response_model=ControlVideo)
def get_control_video():
    return ControlVideo(
        title="Control group reference video",
        description="A short placeholder video served from the backend for control-group testing.",
        video_url="http://localhost:8000/api/media/control-preview.mp4",
    )


@app.get("/api/instruction-video", response_model=InstructionVideo)
def get_instruction_video():
    return InstructionVideo(
        video_url="http://localhost:8000/api/media/control-preview.mp4",
    )


@app.get("/api/experimental-videos", response_model=list[ExperimentalVideo])
def get_experimental_videos():
    sample_video_url = "http://localhost:8000/api/media/video-topic-a-v1.mp4"
    return [
        ExperimentalVideo(
            id=f"experimental-video-{index}",
            title=f"Experimental video {index}",
            description=(
                "A short placeholder video served from the backend for "
                f"experimental lesson {index}."
            ),
            video_url=sample_video_url,
        )
        for index in range(1, 5)
    ]


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
