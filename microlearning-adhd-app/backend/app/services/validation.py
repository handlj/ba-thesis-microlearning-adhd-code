from fastapi import HTTPException
from sqlmodel import Session, select

from app.config import MAX_AGE, MIN_AGE, VALID_ADHD_DIAGNOSES, VALID_ASSIGNMENTS
from app.models.session import ParticipantSession


def ensure_participant_exists(
    participant_id: str,
    session: Session,
) -> ParticipantSession:
    participant = session.exec(
        select(ParticipantSession).where(ParticipantSession.id == participant_id)
    ).first()

    if participant is None:
        raise HTTPException(status_code=404, detail="Participant session not found.")

    return participant


def require_non_empty_text(value: str, field_name: str) -> str:
    normalized_value = value.strip()
    if not normalized_value:
        raise HTTPException(status_code=400, detail=f"{field_name} is required.")

    return normalized_value


def validate_assignment(assignment: str) -> str:
    normalized = require_non_empty_text(assignment, "Assignment")
    if normalized not in VALID_ASSIGNMENTS:
        raise HTTPException(status_code=400, detail="Invalid assignment.")
    return normalized


def validate_age(age: int) -> int:
    if age < MIN_AGE or age > MAX_AGE:
        raise HTTPException(
            status_code=400,
            detail=f"Age must be between {MIN_AGE} and {MAX_AGE}.",
        )
    return age


def validate_adhd_diagnosis(diagnosis: str) -> str:
    if diagnosis not in VALID_ADHD_DIAGNOSES:
        raise HTTPException(status_code=400, detail="Invalid ADHD diagnosis status.")
    return diagnosis


def validate_likert_answers(
    answers: dict[str, int],
    expected_ids: set[str],
    min_value: int,
    max_value: int,
) -> dict[str, int]:
    if set(answers) != expected_ids:
        missing = expected_ids - set(answers)
        unexpected = set(answers) - expected_ids
        details = []
        if missing:
            details.append(f"missing: {', '.join(sorted(missing))}")
        if unexpected:
            details.append(f"unexpected: {', '.join(sorted(unexpected))}")
        raise HTTPException(
            status_code=400,
            detail=f"Invalid questionnaire answers ({'; '.join(details)}).",
        )

    for question_id, value in answers.items():
        if value < min_value or value > max_value:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Answer for {question_id} must be between "
                    f"{min_value} and {max_value}."
                ),
            )

    return answers
