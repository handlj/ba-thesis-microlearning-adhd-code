import json
from dataclasses import asdict

from sqlmodel import Session, func, select

from app.config import CONTROL_SUBGROUP, LEARNING_CONDITION_LABELS
from app.models.allocation_log import AllocationLog
from app.models.session import ParticipantSession
from app.timestamps import current_utc_timestamp

from .classes import LearningConditionState
from .condition_selection import (
    _choose_learning_condition_to_allocate,
    _score_learning_condition_candidates,
)


def assign_balanced_group(
    session: Session, screen_positive: bool, prior_experience_score: int | None = None
) -> tuple[str, str]:

    current_allocation_state = _get_participants_within_stratum(session, screen_positive)
    learning_condition_candidates = _score_learning_condition_candidates(
        current_allocation_state, prior_experience_score
    )
    chosen_learning_condition, _, _ = _choose_learning_condition_to_allocate(
        learning_condition_candidates
    )

    group_assignment = (
        "control" if chosen_learning_condition == CONTROL_SUBGROUP else "experimental"
    )

    return group_assignment, chosen_learning_condition


def assign_balanced_group_with_log(
    session: Session,
    participant_id: str,
    screen_positive: bool,
    prior_experience_score: int | None = None,
) -> tuple[str, str, AllocationLog]:

    current_allocation_state = _get_participants_within_stratum(session, screen_positive)
    learning_condition_candidates = _score_learning_condition_candidates(
        current_allocation_state, prior_experience_score
    )
    chosen_learning_condition, preferred_learning_condition_labels, selected_preferred_condition = (
        _choose_learning_condition_to_allocate(learning_condition_candidates)
    )

    group_assignment = (
        "control" if chosen_learning_condition == CONTROL_SUBGROUP else "experimental"
    )

    allocation_log = AllocationLog(
        participant_id=participant_id,
        adhd_screen_positive=screen_positive,
        prior_programming_experience_score=prior_experience_score,
        score_missing=prior_experience_score is None,
        state_before_json=json.dumps(
            {label: asdict(state) for label, state in current_allocation_state.items()}
        ),
        imbalance_json=json.dumps(learning_condition_candidates),
        preferred_conditions=",".join(preferred_learning_condition_labels),
        took_preferred=selected_preferred_condition,
        assignment=group_assignment,
        subgroup=chosen_learning_condition,
        allocated_at=current_utc_timestamp(),
    )

    return group_assignment, chosen_learning_condition, allocation_log


def _get_participants_within_stratum(
    session: Session,
    screen_positive: bool,
) -> dict[str, LearningConditionState]:
    participants_within_stratum = session.exec(
        select(
            ParticipantSession.subgroup,
            func.count(),
            func.coalesce(func.sum(ParticipantSession.prior_programming_experience_score), 0),
            func.count(ParticipantSession.prior_programming_experience_score),
        )
        .where(ParticipantSession.adhd_screen_positive == screen_positive)
        .where(ParticipantSession.subgroup.is_not(None))
        .group_by(ParticipantSession.subgroup)
    ).all()

    allocation_state = {label: LearningConditionState() for label in LEARNING_CONDITION_LABELS}

    for subgroup, count, score_sum, score_n in participants_within_stratum:
        if subgroup in allocation_state:
            allocation_state[subgroup] = LearningConditionState(
                participant_n=count,
                experience_score_sum=int(score_sum),
                experience_score_n=score_n,
            )

    return allocation_state
