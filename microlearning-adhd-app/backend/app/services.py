from datetime import datetime, timezone

from fastapi import HTTPException
from sqlmodel import Session, select

from app.models import ParticipantSession
from app.schemas import DemographicsRequest


def current_utc_timestamp() -> datetime:
    return datetime.now(timezone.utc)


def stable_serialize(data: dict[str, str]) -> str:
    return "|".join(f"{key}:{data[key]}" for key in sorted(data))


def hash_djb2(value: str) -> int:
    hash_value = 5381
    for character in value:
        hash_value = ((hash_value * 33) ^ ord(character)) & 0xFFFFFFFF
    return hash_value


def assign_deterministic_group(demographics: DemographicsRequest) -> str:
    serialized = stable_serialize(
        {
            "age": str(demographics.age),
            "studyBackground": demographics.study_background,
            "adhdDiagnosis": demographics.adhd_diagnosis,
        }
    )
    return "control" if hash_djb2(serialized) % 2 == 0 else "experimental"


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
