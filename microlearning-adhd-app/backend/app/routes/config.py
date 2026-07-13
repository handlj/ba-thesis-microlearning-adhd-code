from fastapi import APIRouter
from app.schemas import config as ConfigSchemas

from app.config import MIN_AGE, MAX_AGE, QUIZ_PASS_THRESHOLD, QUIZ_MAX_ATTEMPTS

router = APIRouter(prefix="/api")


@router.get("/config", response_model=ConfigSchemas.Config)
def get_config():
    return ConfigSchemas.Config(
        min_age=MIN_AGE,
        max_age=MAX_AGE,
        quiz_pass_threshold=QUIZ_PASS_THRESHOLD,
        quiz_max_attempts=QUIZ_MAX_ATTEMPTS
    )
