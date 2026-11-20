from threading import Lock

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.config.errors import ERROR_CONSENT_REQUIRED, ERROR_STUDY_CLOSED
from app.config.http_status_codes import HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN
from app.database import get_session
from app.models import ParticipantSession
from app.schemas import ConsentSchemas
from app.services import is_study_full
from app.timestamps import current_utc_timestamp

router = APIRouter(prefix="/api/participants")

_slot_lock = Lock()


# FIXME: Prevent duplicates for easier data analysis. Deferred.
@router.post("/consent", response_model=ConsentSchemas.ConsentResponse)
def create_consent_session(
    consent: ConsentSchemas.ConsentRequest,
    session: Session = Depends(get_session),
):
    if not consent.consented:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=ERROR_CONSENT_REQUIRED,
        )

    with _slot_lock:
        if is_study_full(session):
            raise HTTPException(
                status_code=HTTP_403_FORBIDDEN,
                detail=ERROR_STUDY_CLOSED,
            )

        timestamp = current_utc_timestamp()

        participant = ParticipantSession(
            consented=True,
            consented_at=timestamp,
            created_at=timestamp,
        )

        session.add(participant)
        session.commit()
        session.refresh(participant)

    return ConsentSchemas.ConsentResponse(
        participant_id=participant.id,
        consented_at=participant.consented_at,
    )
