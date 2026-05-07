# -------------------------------------
# Microlearning ADHD App - Backend
# -------------------------------------
# This is the main entry point for the FastAPI backend server.
# 
# In its current state, it is only a mock up, following the 
# tutorial at https://www.youtube.com/watch?v=aSdVU9-SxH4 to 
# set up the basic structure.

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from pathlib import Path
from typing import List

class Item(BaseModel):
    id: int
    name: str
    description: str

class Items(BaseModel):
    items: List[Item]


class ControlVideo(BaseModel):
    title: str
    description: str
    video_url: str

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent
MEDIA_DIR = BASE_DIR / "media"

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/api/media", StaticFiles(directory=MEDIA_DIR), name="media")

memory_items = {"items": []}

@app.get("/items", response_model=Items)
def get_items():
    return Items(items=memory_items["items"])

@app.post("/items", response_model=Items)
def add_item(item: Item):
    memory_items["items"].append(item)
    return Items(items=memory_items["items"])


@app.get("/api/control-video", response_model=ControlVideo)
def get_control_video():
    return ControlVideo(
        title="Control group reference video",
        description="A short placeholder video served from the backend for control-group testing.",
        video_url="http://localhost:8000/api/media/control-preview.mp4",
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
