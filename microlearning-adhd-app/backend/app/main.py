from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config.config import FRONTEND_DIST_DIR, IS_PRODUCTION, MEDIA_DIR, ORIGINS
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
)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    create_db_and_tables()
    yield


docs_kwargs = {"docs_url": None, "redoc_url": None, "openapi_url": None} if IS_PRODUCTION else {}

app = FastAPI(lifespan=lifespan, **docs_kwargs)

if ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.mount("/api/media", StaticFiles(directory=MEDIA_DIR), name="media")

app.include_router(consent.router)
app.include_router(demographics.router)
app.include_router(interaction_events.router)
app.include_router(post_intervention.router)
app.include_router(questionnaires.router)
app.include_router(quiz.router)
app.include_router(videos.router)
app.include_router(config.router)

if FRONTEND_DIST_DIR is not None:
    app.mount("/", StaticFiles(directory=FRONTEND_DIST_DIR, html=True), name="frontend")
