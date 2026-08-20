from app.config import (
    LEARNING_CONDITION_LABELS,
    LEARNING_CONDITION_TARGET_WEIGHTS,
    PRIOR_PROGRAMMING_EXPERIENCE_SCORE_RANGE,
    SCORE_IMBALANCE_WEIGHT,
)

from .classes import LearningConditionState


def _compute_participant_n_imbalance(allocation_state: dict[str, LearningConditionState]) -> float:
    weighted_participant_n = [
        allocation_state[condition].participant_n / LEARNING_CONDITION_TARGET_WEIGHTS[condition]
        for condition in LEARNING_CONDITION_LABELS
    ]
    return max(weighted_participant_n) - min(weighted_participant_n)


def _compute_mean_experience_score_imbalance(
    allocation_state: dict[str, LearningConditionState],
) -> float:
    learning_condition_means = [
        allocation_state[condition].mean_experience_score for condition in LEARNING_CONDITION_LABELS
    ]
    if any(mean is None for mean in learning_condition_means):
        return 0.0
    return (
        max(learning_condition_means) - min(learning_condition_means)
    ) / PRIOR_PROGRAMMING_EXPERIENCE_SCORE_RANGE


def _compute_total_learning_condition_imbalance(
    allocation_state: dict[str, LearningConditionState],
) -> float:
    return _compute_participant_n_imbalance(
        allocation_state
    ) + SCORE_IMBALANCE_WEIGHT * _compute_mean_experience_score_imbalance(allocation_state)
