from app.config import (
    ADHD_HYPERACTIVITY_QUESTION_IDS,
    ADHD_HYPERACTIVITY_THRESHOLD,
    ADHD_INATTENTION_QUESTION_IDS,
    ADHD_INATTENTION_THRESHOLD,
    ADHD_SCREEN_POSITIVE_MARKS,
)


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
