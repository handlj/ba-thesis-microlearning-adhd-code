from fastapi import APIRouter, Request
from app.config import NUMBER_OF_EXPERIMENTAL_VIDEOS
from app.schemas import ControlVideo, ExperimentalVideo, InstructionVideo


router = APIRouter(prefix="/api")


@router.get("/control-video", response_model=ControlVideo)
def get_control_video(request: Request):
    return ControlVideo(
        title="",
        description="",
        video_url=str(request.url_for("media", path="video-full-v1.mp4")),
    )


@router.get("/instruction-video", response_model=InstructionVideo)
def get_instruction_video(request: Request):
    return InstructionVideo(
        video_url=str(request.url_for("media", path="video-instructions-v1.mp4")),
    )


@router.get("/experimental-videos", response_model=list[ExperimentalVideo])
def get_experimental_videos(request: Request):
    return [
        ExperimentalVideo(
            id=f"experimental-video-{index}",
            title="",
            description="",
            video_url=str(request.url_for("media", path=f"video{index}.mp4")),
        )
        # This sends exactly NUMBER_OF_EXPERIMENTAL_VIDEOS experimental videos. Do not change!
        for index in range(1, NUMBER_OF_EXPERIMENTAL_VIDEOS + 1)
    ]
