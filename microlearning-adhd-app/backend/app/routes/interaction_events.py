import json

from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.database import get_session
from app.models import InteractionEvent
from app.schemas import InteractionEventSchemas
from app.services import (
    current_utc_timestamp,
    ensure_participant_exists,
    validate_assignment,
    validate_subgroup,
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

    assignment = validate_assignment(event.assignment)
    subgroup = validate_subgroup(event.subgroup, assignment)

    interaction_event = InteractionEvent(
        participant_id=participant_id,
        assignment=assignment,
        subgroup=subgroup,
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
