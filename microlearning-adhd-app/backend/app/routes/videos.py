from fastapi import APIRouter, Request



from app.schemas import ControlVideo, ExperimentalVideo, InstructionVideo


router = APIRouter(prefix="/api")


@router.get("/control-video", response_model=ControlVideo)
def get_control_video(request: Request):
    return ControlVideo(
        title="Control group reference video",
        description="A short placeholder video served from the backend for control-group testing.",
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
            title=f"Experimental video {index}",
            description=(
                "A short placeholder video served from the backend for "
                f"experimental lesson {index}."
            ),
            video_url=str(request.url_for("media", path=f"video{index}.mp4")),
        )
        for index in range(1, 4)
    ]
