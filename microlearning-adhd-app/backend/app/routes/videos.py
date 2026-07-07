from fastapi import APIRouter, Request
from app.config import NUMBER_OF_EXPERIMENTAL_VIDEOS
from app.schemas import video as VideoSchemas


router = APIRouter(prefix="/api")


@router.get("/control-video", response_model=VideoSchemas.ControlVideo)
def get_control_video(request: Request):
    return VideoSchemas.ControlVideo(
        title="",
        description="",
        video_url=str(request.url_for("media", path="video-full-v1.mp4")),
    )


@router.get("/instruction-video", response_model=VideoSchemas.InstructionVideo)
def get_instruction_video(request: Request):
    return VideoSchemas.InstructionVideo(
        video_url=str(request.url_for("media", path="video-instructions-v1.mp4")),
    )


@router.get("/experimental-videos", response_model=list[VideoSchemas.ExperimentalVideo])
def get_experimental_videos(request: Request):
    return [
        VideoSchemas.ExperimentalVideo(
            id=f"experimental-video-{index}",
            title="",
            description="",
            video_url=str(request.url_for("media", path=f"video{index}.mp4")),
        )
        # This sends exactly NUMBER_OF_EXPERIMENTAL_VIDEOS experimental videos. Do not change!
        for index in range(1, NUMBER_OF_EXPERIMENTAL_VIDEOS + 1)
    ]
