import random

from sqlmodel import Session, func, select

from app.config import BIASED_COIN_PROBABILITY
from app.models.session import ParticipantSession


# Module-level RNG for group allocation. Intentionally unseeded so each run of
# the study produces a genuinely random allocation sequence.
_rng = random.Random()


def assign_balanced_group(session: Session, screen_positive: bool) -> str:
    """Allocate a group using Efron's biased coin within the screening stratum.

    Keeping the two arms balanced within each ADHD-screening stratum ensures the
    arms have comparable symptom composition while allocation stays random and
    unpredictable from participant characteristics.
    """
    control_count = _count_assignments(session, "control", screen_positive)
    experimental_count = _count_assignments(session, "experimental", screen_positive)

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
