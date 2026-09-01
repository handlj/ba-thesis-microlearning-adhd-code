from fastapi import HTTPException
from sqlmodel import Session, select

from app.config import (
    ADHD_PART_A_QUESTION_IDS,
    ADHD_PART_A_SCORE_THRESHOLD,
    ADHD_PART_B_QUESTION_IDS,
    ADHD_PART_B_SCORE_THRESHOLD,
    ERROR_DEMOGRAPHICS_NOT_FOUND,
    HTTP_404_NOT_FOUND,
)
from app.models.demographics import Demographics


def get_adhd_status(session: Session, participant_id: str, answers: dict[str, int]) -> bool:
    """Reconcile self-reported ADHD diagnosis, medication and ADHD screener results
    into a combined ADHD status measure for group allocation.

    Return true if both of the following hold:
      - Participant is officially diagnosed (self-reported)
      - Participant either has a positive ADHD screener result or
        self-reports taking ADHD medication

    Return false otherwise.
    """

    positive_screener_result = _get_adhd_screener_result(answers)
    is_diagnosed, is_medicated = _get_adhd_diagnosis_and_medication(session, participant_id)

    return is_diagnosed and (positive_screener_result or is_medicated)


def _get_adhd_screener_result(answers: dict[str, int]) -> bool:
    """German ASRS-v1.1 result scoring for online group allocation:

    Return true if either:
      - Part A score >= 14 (+ 6 (1 per question) since 1-5 likert scales are used instead of 0-4)
      - Part B score >= 27 (+ 12 for the same reason)

    This is based on the scoring update issued by Harvard Medical School in 2024.
    For a source on this policy, see: https://novopsych.com/assessments/diagnosis/adult-adhd-self-report-scale-asrs/
    """

    part_a_score = sum(answers[question_id] for question_id in ADHD_PART_A_QUESTION_IDS)
    part_b_score = sum(answers[question_id] for question_id in ADHD_PART_B_QUESTION_IDS)

    return (
        part_a_score >= ADHD_PART_A_SCORE_THRESHOLD or part_b_score >= ADHD_PART_B_SCORE_THRESHOLD
    )


def _get_adhd_diagnosis_and_medication(session: Session, participant_id: str) -> tuple[bool, bool]:
    """Return a tuple of (is_diagnosed, is_medicated) for the given participant."""

    demographics_record = session.exec(
        select(Demographics).where(Demographics.participant_id == participant_id)
    ).first()

    if demographics_record is None:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=ERROR_DEMOGRAPHICS_NOT_FOUND.format(participant_id=participant_id),
        )

    valid_diagnosis = demographics_record.adhd_diagnosis == "diagnosed"
    valid_medication = demographics_record.adhd_medication == "yes"

    return valid_diagnosis is True, valid_medication is True


def score_prior_programming_experience(
    general_programming_ability: str, python_programming_ability: str
) -> int:
    """Score prior programming experience based on the participant's answers.

    The scoring is based on the questions for general programming ability and
    python programming ability. Answers are scored as follows:
    - 0: No experience
    - 1: "Anfänger*in" (Beginner)
    - 2: "Fortgeschrittene*r" (Intermediate)
    - 3: "Expert*in" (Expert)

    The total score is the sum of the scores for general programming ability and
    python programming ability, resulting in a score ranging from 0 to 6.
    """

    # Keys are type-sensitive, have to match frontend/src/content/demographics.ts
    ability_score_mapping = {
        "no-python-experience": 0,
        "no-experience": 0,
        "beginner": 1,
        "intermediate": 2,
        "expert": 3,
    }

    python_ability_score = ability_score_mapping.get(python_programming_ability, 0)
    general_ability_score = ability_score_mapping.get(general_programming_ability, 0)

    total_score = python_ability_score + general_ability_score
    return total_score
