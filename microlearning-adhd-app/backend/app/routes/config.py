from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.config.demographics_validation import MAX_AGE, MIN_AGE
from app.config.intervention import QUIZ_MAX_ATTEMPTS, QUIZ_PASS_THRESHOLD
from app.database import get_session
from app.schemas import config as ConfigSchemas
from app.services import is_study_full

router = APIRouter(prefix="/api")


@router.get("/config", response_model=ConfigSchemas.Config)
def get_config(session: Session = Depends(get_session)):
    return ConfigSchemas.Config(
        min_age=MIN_AGE,
        max_age=MAX_AGE,
        quiz_pass_threshold=QUIZ_PASS_THRESHOLD,
        quiz_max_attempts=QUIZ_MAX_ATTEMPTS,
        study_closed=is_study_full(session),
    )
