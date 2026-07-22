from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import MEDIA_DIR, ORIGINS
from app.database import create_db_and_tables
from app.routes import (
    consent, 
    demographics, 
    interaction_events, 
    post_intervention, 
    questionnaires, 
    quiz, 
    videos, 
    config
)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

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
