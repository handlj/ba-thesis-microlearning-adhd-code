# -------------------------------------
# Microlearning ADHD App - Backend
# -------------------------------------
# This is the main entry point for the FastAPI backend server.

import uvicorn
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
    participant = session.exec(
        select(ParticipantSession).where(ParticipantSession.id == participant_id)
    ).first()

    if participant is None:
        raise HTTPException(status_code=404, detail="Participant session not found.")

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


@app.get("/api/control-video", response_model=ControlVideo)
def get_control_video():
    return ControlVideo(
        title="Control group reference video",
        description="A short placeholder video served from the backend for control-group testing.",
        video_url="http://localhost:8000/api/media/control-preview.mp4",
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
