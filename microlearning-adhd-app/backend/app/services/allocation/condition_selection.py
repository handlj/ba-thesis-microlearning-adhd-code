import math
import random

from app.config import (
    ALLOCATION_IMBALANCE_TOLERANCE,
    EFRON_BIASED_COIN_PROBABILITY,
    LEARNING_CONDITION_LABELS,
    LEARNING_CONDITION_TARGET_WEIGHTS,
)

from .classes import LearningConditionState
from .imbalance_scoring import _compute_total_learning_condition_imbalance

_rng = random.Random()


def _score_learning_condition_candidates(
    allocation_state: dict[str, LearningConditionState],
    prior_experience_score: int | None,
) -> dict[str, float]:
    candidate_learning_conditions: dict[str, float] = {}
    for condition_label in LEARNING_CONDITION_LABELS:
        updated_allocation_state = dict(allocation_state)
        updated_allocation_state[condition_label] = allocation_state[
            condition_label
        ].update_learning_condition_state(prior_experience_score)
        candidate_learning_conditions[condition_label] = (
            _compute_total_learning_condition_imbalance(updated_allocation_state)
        )
    return candidate_learning_conditions


def _draw_weighted_choice(condition_labels: list[str]) -> str:
    target_weights = [LEARNING_CONDITION_TARGET_WEIGHTS[label] for label in condition_labels]
    return _rng.choices(condition_labels, weights=target_weights, k=1)[0]


def _choose_learning_condition_to_allocate(
    candidate_learning_conditions: dict[str, float],
) -> tuple[str, list[str], bool]:
    best_learning_condition = min(candidate_learning_conditions.values())

    preferred_learning_condition_labels = [
        condition_label
        for condition_label in LEARNING_CONDITION_LABELS
        if math.isclose(
            candidate_learning_conditions[condition_label],
            best_learning_condition,
            abs_tol=ALLOCATION_IMBALANCE_TOLERANCE,
        )
    ]

    remaining_learning_condition_labels = [
        condition_label
        for condition_label in LEARNING_CONDITION_LABELS
        if condition_label not in preferred_learning_condition_labels
    ]

    selected_preferred_condition = (
        not remaining_learning_condition_labels or _rng.random() < EFRON_BIASED_COIN_PROBABILITY
    )

    learning_condition_pool = (
        preferred_learning_condition_labels
        if selected_preferred_condition
        else remaining_learning_condition_labels
    )

    return (
        _draw_weighted_choice(learning_condition_pool),
        preferred_learning_condition_labels,
        selected_preferred_condition,
    )
