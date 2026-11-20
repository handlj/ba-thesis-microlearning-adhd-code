from sqlmodel import Session, col, func, or_, select

from app.config.recruitment import PARTICIPANT_CAP, SLOT_RESERVATION_WINDOW
from app.models.post_intervention import PostInterventionResponse
from app.models.session import ParticipantSession
from app.timestamps import current_utc_timestamp


def is_study_full(session: Session) -> bool:
    reservation_cutoff = current_utc_timestamp() - SLOT_RESERVATION_WINDOW

    occupied_slots = session.exec(
        select(func.count())
        .select_from(ParticipantSession)
        .where(
            or_(
                col(ParticipantSession.id).in_(select(PostInterventionResponse.participant_id)),
                col(ParticipantSession.created_at) >= reservation_cutoff,
            )
        )
    ).one()

    return occupied_slots >= PARTICIPANT_CAP
