from fastapi import HTTPException
from sqlmodel import Session, select

from app.config import (
    ERROR_FIELD_REQUIRED,
    ERROR_INVALID_ADHD_DIAGNOSIS,
    ERROR_INVALID_AGE,
    ERROR_INVALID_ASSIGNMENT,
    ERROR_INVALID_SUBGROUP,
    ERROR_PARTICIPANT_NOT_FOUND,
    ERROR_SUBGROUP_ASSIGNMENT_MISMATCH,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    MAX_AGE,
    MIN_AGE,
    VALID_ADHD_DIAGNOSES,
    VALID_ASSIGNMENTS,
    VALID_SUBGROUPS,
    VALID_SUBGROUPS_BY_ASSIGNMENT,
)
from app.models.session import ParticipantSession


def ensure_participant_exists(
    participant_id: str,
    session: Session,
) -> ParticipantSession:
    participant = session.exec(
        select(ParticipantSession).where(ParticipantSession.id == participant_id)
    ).first()

    if participant is None:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail=ERROR_PARTICIPANT_NOT_FOUND)

    return participant


def require_non_empty_text(value: str, field_name: str) -> str:
    normalized_value = value.strip()
    if not normalized_value:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=ERROR_FIELD_REQUIRED.format(field_name=field_name),
        )

    return normalized_value


def validate_assignment(assignment: str) -> str:
    normalized = require_non_empty_text(assignment, "Assignment")
    if normalized not in VALID_ASSIGNMENTS:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=ERROR_INVALID_ASSIGNMENT)
    return normalized


def validate_subgroup(subgroup: str, assignment: str) -> str:
    normalized = require_non_empty_text(subgroup, "Subgroup")

    if normalized not in VALID_SUBGROUPS:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=ERROR_INVALID_SUBGROUP)

    if normalized not in VALID_SUBGROUPS_BY_ASSIGNMENT.get(assignment, set()):
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST, detail=ERROR_SUBGROUP_ASSIGNMENT_MISMATCH
        )

    return normalized


def validate_age(age: int) -> int:
    if age < MIN_AGE or age > MAX_AGE:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=ERROR_INVALID_AGE.format(MIN_AGE=MIN_AGE, MAX_AGE=MAX_AGE),
        )
    return age


def validate_adhd_diagnosis(diagnosis: str) -> str:
    if diagnosis not in VALID_ADHD_DIAGNOSES:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=ERROR_INVALID_ADHD_DIAGNOSIS)
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
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid questionnaire answers ({'; '.join(details)}).",
        )

    for question_id, value in answers.items():
        if value < min_value or value > max_value:
            raise HTTPException(
                status_code=HTTP_400_BAD_REQUEST,
                detail=(f"Answer for {question_id} must be between {min_value} and {max_value}."),
            )

    return answers
