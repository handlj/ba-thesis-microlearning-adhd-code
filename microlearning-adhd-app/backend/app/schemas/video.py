from pydantic import BaseModel

class ControlVideo(BaseModel):
    video_url: str


class InstructionVideo(BaseModel):
    video_url: str


class ExperimentalVideo(BaseModel):
    id: str
    video_url: str
