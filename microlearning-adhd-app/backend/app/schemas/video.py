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
