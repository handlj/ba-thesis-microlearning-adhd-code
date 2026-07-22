from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session

from app.schemas import ConsentSchemas
from app.models import ParticipantSession

from app.services import current_utc_timestamp

from app.database import get_session

from app.config import (HTTP_400_BAD_REQUEST, ERROR_CONSENT_REQUIRED)


router = APIRouter(prefix="/api/participants")


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
