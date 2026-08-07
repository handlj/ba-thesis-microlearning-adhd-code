import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from app.config import ERROR_QUIZ_ANSWERS_REQUIRED, HTTP_400_BAD_REQUEST
from app.database import get_session
from app.models import QuizSubmission
from app.schemas import QuizSchemas
from app.services import (
    ensure_participant_exists,
    validate_assignment,
    validate_subgroup,
)
from app.timestamps import current_utc_timestamp

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

    assignment = validate_assignment(submission.assignment)
    subgroup = validate_subgroup(submission.subgroup, assignment)

    attempt = submission.attempt if submission.attempt is not None else 1

    if not submission.answers:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=ERROR_QUIZ_ANSWERS_REQUIRED)

    def stored_response(record: QuizSubmission) -> QuizSchemas.QuizSubmissionResponse:
        return QuizSchemas.QuizSubmissionResponse(
            participant_id=record.participant_id,
            answer_count=record.answer_count,
            submitted_at=record.submitted_at,
        )

    def find_existing() -> QuizSubmission | None:
        return session.exec(
            select(QuizSubmission)
            .where(QuizSubmission.participant_id == participant_id)
            .where(QuizSubmission.topic_id == submission.topic_id)
            .where(QuizSubmission.attempt == attempt)
        ).first()

    existing = find_existing()
    if existing is not None:
        return stored_response(existing)

    record = QuizSubmission(
        participant_id=participant_id,
        assignment=assignment,
        subgroup=subgroup,
        video_id=submission.video_id,
        video_index=submission.video_index,
        topic_id=submission.topic_id,
        answers_json=json.dumps(submission.answers),
        answer_count=len(submission.answers),
        attempt=attempt,
        submitted_at=current_utc_timestamp(),
    )
    session.add(record)

    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        existing = find_existing()
        if existing is None:
            raise
        return stored_response(existing)

    session.refresh(record)
    return stored_response(record)
