from fastapi import APIRouter, Request
from app.config import NUMBER_OF_EXPERIMENTAL_VIDEOS, CONTROL_VIDEO_FILENAME, INSTRUCTION_VIDEO_FILENAME, EXPERIMENTAL_VIDEO_FILENAME_TEMPLATE
from app.schemas import video as VideoSchemas


router = APIRouter(prefix="/api")


@router.get("/control-video", response_model=VideoSchemas.ControlVideo)
def get_control_video(request: Request):
    return VideoSchemas.ControlVideo(
        video_url=str(request.url_for("media", path=CONTROL_VIDEO_FILENAME)),
    )


@router.get("/instruction-video", response_model=VideoSchemas.InstructionVideo)
def get_instruction_video(request: Request):
    return VideoSchemas.InstructionVideo(
        video_url=str(request.url_for("media", path=INSTRUCTION_VIDEO_FILENAME)),
    )


@router.get("/experimental-videos", response_model=list[VideoSchemas.ExperimentalVideo])
def get_experimental_videos(request: Request):
    return [
        VideoSchemas.ExperimentalVideo(
            id=f"experimental-video-{index}",
            video_url=str(request.url_for("media", path=EXPERIMENTAL_VIDEO_FILENAME_TEMPLATE.format(index=index))),
        )
        for index in range(1, NUMBER_OF_EXPERIMENTAL_VIDEOS + 1)
    ]
