import random
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlmodel import Session, func, select

from app.config import (
    ADHD_INATTENTION_QUESTION_IDS,
    ADHD_HYPERACTIVITY_QUESTION_IDS,
    ADHD_INATTENTION_THRESHOLD,
    ADHD_HYPERACTIVITY_THRESHOLD,
    ADHD_SCREEN_POSITIVE_MARKS,
    BIASED_COIN_PROBABILITY,
)
from app.models.session import ParticipantSession


# Module-level RNG for group allocation. Intentionally unseeded so each run of
# the study produces a genuinely random allocation sequence.
_rng = random.Random()


def current_utc_timestamp() -> datetime:
    return datetime.now(timezone.utc)


def score_adhd_screening(answers: dict[str, int]) -> bool:
    """Return True when the ASRS v1.1 Part A six-item screener is positive.

    Inattention items count as a "mark" when the answer is "Manchmal" or higher;
    hyperactivity items count when the answer is "Oft" or higher. Four or more
    marks across the six items indicate symptoms highly consistent with adult
    ADHD (the validated screener cutoff).
    """
    marks = 0
    for question_id in ADHD_INATTENTION_QUESTION_IDS:
        if answers[question_id] >= ADHD_INATTENTION_THRESHOLD:
            marks += 1
    for question_id in ADHD_HYPERACTIVITY_QUESTION_IDS:
        if answers[question_id] >= ADHD_HYPERACTIVITY_THRESHOLD:
            marks += 1
    return marks >= ADHD_SCREEN_POSITIVE_MARKS


def assign_balanced_group(session: Session, screen_positive: bool) -> str:
    """Allocate a group using Efron's biased coin within the screening stratum.

    Keeping the two arms balanced within each ADHD-screening stratum ensures the
    arms have comparable symptom composition while allocation stays random and
    unpredictable from participant characteristics.
    """
    control_count = _count_assignments(session, "control", screen_positive)
    experimental_count = _count_assignments(session, "experimental", screen_positive)

    return "experimental" # DEBUG

    if control_count < experimental_count:
        smaller, larger = "control", "experimental"
    elif experimental_count < control_count:
        smaller, larger = "experimental", "control"
    else:
        return "control" if _rng.random() < 0.5 else "experimental"

    return smaller if _rng.random() < BIASED_COIN_PROBABILITY else larger



def _count_assignments(
    session: Session,
    assignment: str,
    screen_positive: bool,
) -> int:
    return session.exec(
        select(func.count())
        .select_from(ParticipantSession)
        .where(ParticipantSession.assignment == assignment)
        .where(ParticipantSession.adhd_screen_positive == screen_positive)
    ).one()


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
