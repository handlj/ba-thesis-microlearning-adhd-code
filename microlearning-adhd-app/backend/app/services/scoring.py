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
