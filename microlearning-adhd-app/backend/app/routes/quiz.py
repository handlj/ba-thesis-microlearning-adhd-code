import json

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.schemas import QuizSchemas
from app.models import QuizAnswer
from app.database import get_session
from app.services import (
    ensure_participant_exists,
    current_utc_timestamp,
    validate_assignment,
)

from app.config import HTTP_400_BAD_REQUEST, ERROR_QUIZ_ANSWERS_REQUIRED


router = APIRouter(prefix="/api/participants")


@router.post(
    "/{participant_id}/quiz",
    response_model=QuizSchemas.QuizSubmissionResponse,
)
def submit_quiz(
    participant_id: str,
    submission: QuizSchemas.QuizSubmissionRequest,
    session: Session = Depends(get_session),
):
    ensure_participant_exists(participant_id, session)

    # FIXME: Rename to assignment for consistency with other models
    group = validate_assignment(submission.group)

    if not submission.answers:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=ERROR_QUIZ_ANSWERS_REQUIRED)

    submitted_at = current_utc_timestamp()

    for question_id, selected_options in submission.answers.items():
        quiz_answer = QuizAnswer(
            participant_id=participant_id,
            group=group,
            video_id=submission.video_id,
            video_index=submission.video_index,
            topic_id=submission.topic_id,
            question_id=question_id,
            selected_options=json.dumps(selected_options),
            attempt=submission.attempt,
            submitted_at=submitted_at,
        )
        session.add(quiz_answer)
    
    session.commit()

    return QuizSchemas.QuizSubmissionResponse(
        participant_id=participant_id,
        answer_count=len(submission.answers),
        submitted_at=submitted_at,
    )
