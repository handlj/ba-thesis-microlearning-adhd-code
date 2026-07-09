from fastapi import APIRouter
from app.schemas import config as ConfigSchemas

from app.config import MIN_AGE, MAX_AGE

router = APIRouter(prefix="/api")


@router.get("/config", response_model=ConfigSchemas.Config)
def get_config():
    return ConfigSchemas.Config(
        min_age=MIN_AGE,
        max_age=MAX_AGE
    )
