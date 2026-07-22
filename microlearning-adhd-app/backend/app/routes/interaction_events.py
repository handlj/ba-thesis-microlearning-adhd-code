from fastapi import APIRouter, Depends

import json

from app.schemas import InteractionEventSchemas

from app.models import InteractionEvent

from app.database import get_session
from sqlmodel import Session

from app.services import (
    ensure_participant_exists,
    current_utc_timestamp,
)


router = APIRouter(prefix="/api/participants")


@router.post(
    "/{participant_id}/events",
    response_model=InteractionEventSchemas.InteractionEventResponse,
)
def record_interaction_event(
    participant_id: str,
    event: InteractionEventSchemas.InteractionEventRequest,
    session: Session = Depends(get_session),
):
    ensure_participant_exists(participant_id, session)

    interaction_event = InteractionEvent(
        participant_id=participant_id,
        group=event.group,
        page=event.page,
        event_type=event.event_type,
        occurred_at=event.occurred_at,
        received_at=current_utc_timestamp(),
        payload_json=json.dumps(event.payload) if event.payload else None,
    )
    
    session.add(interaction_event)
    session.commit()
    session.refresh(interaction_event)

    return InteractionEventSchemas.InteractionEventResponse(
        id=interaction_event.id,
        received_at=interaction_event.received_at,
    )
