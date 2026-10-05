from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.config.config import MEDIA_DIR
from app.database import create_db_and_tables
from app.routes import (
    config,
    consent,
    demographics,
    interaction_events,
    post_intervention,
    questionnaires,
    quiz,
    videos,
    voucher,
)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.mount("/api/media", StaticFiles(directory=MEDIA_DIR), name="media")

app.include_router(consent.router)
app.include_router(demographics.router)
app.include_router(interaction_events.router)
app.include_router(post_intervention.router)
app.include_router(questionnaires.router)
app.include_router(quiz.router)
app.include_router(videos.router)
app.include_router(voucher.router)
app.include_router(config.router)
