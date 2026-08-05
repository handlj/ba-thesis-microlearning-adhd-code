import random
from sqlmodel import Session, func, select
from app.config import BIASED_COIN_PROBABILITY, CONTROL_SUBGROUP, EXPERIMENTAL_SUBGROUPS
from app.models.session import ParticipantSession


_rng = random.Random()


def assign_balanced_group(session: Session, screen_positive: bool) -> tuple[str, str]:
    """Allocate an arm and a video-player subgroup within the screening stratum.

    Both draws use Efron's biased coin, so the arms, and, inside the
    experimental arm, the standard and enhanced players, stay balanced within
    each ADHD-screening stratum while allocation stays random and unpredictable
    from participant characteristics.

    Returns (assignment, subgroup). The control arm has no player variant, so
    its subgroup mirrors its assignment.
    """

    assignment = _assign_arm(session, screen_positive)

    if assignment == "control":
        return assignment, CONTROL_SUBGROUP

    return assignment, _assign_experimental_subgroup(session, screen_positive)


def _assign_arm(session: Session, screen_positive: bool) -> str:
    control_count = _count_group_assignments(session, "control", screen_positive)
    experimental_count = _count_group_assignments(session, "experimental", screen_positive)

    return _biased_coin("control", control_count, "experimental", experimental_count)


def _assign_experimental_subgroup(session: Session, screen_positive: bool) -> str:
    standard, enhanced = EXPERIMENTAL_SUBGROUPS

    return _biased_coin(
        standard,
        _count_subgroup_assignments(session, screen_positive, standard),
        enhanced,
        _count_subgroup_assignments(session, screen_positive, enhanced),
    )


def _biased_coin(first: str, first_count: int, second: str, second_count: int) -> str:
    """Efron's biased coin: Favour the smaller stratum, tie-break fairly."""
    if first_count == second_count:
        return first if _rng.random() < 0.5 else second

    smaller, larger = (first, second) if first_count < second_count else (second, first)

    return smaller if _rng.random() < BIASED_COIN_PROBABILITY else larger


def _count_group_assignments(
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


def _count_subgroup_assignments(
    session: Session,
    screen_positive: bool,
    subgroup: str,
) -> int:
    return session.exec(
        select(func.count())
        .select_from(ParticipantSession)
        .where(ParticipantSession.subgroup == subgroup)
        .where(ParticipantSession.adhd_screen_positive == screen_positive)
    ).one()
