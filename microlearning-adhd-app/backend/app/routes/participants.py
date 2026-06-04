import json

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.config import VALID_ADHD_DIAGNOSES, VALID_STUDY_BACKGROUNDS
from app.database import get_session
from app.models import Demographics, InteractionEvent, ParticipantSession
from app.models import PostInterventionResponse as PostInterventionResponseModel
from app.schemas import ConsentRequest, ConsentResponse, DemographicsRequest
from app.schemas import DemographicsResponse, InteractionEventRequest
from app.schemas import InteractionEventResponse, PostInterventionRequest
from app.schemas import PostInterventionResponsePayload
from app.services import assign_deterministic_group, current_utc_timestamp
from app.services import ensure_participant_exists, require_non_empty_text


router = APIRouter(prefix="/api/participants")


@router.post("/consent", response_model=ConsentResponse)
def create_consent_session(
    consent: ConsentRequest,
    session: Session = Depends(get_session),
):
    if not consent.consented:
        raise HTTPException(
            status_code=400,
            detail="Consent must be provided before starting the study.",
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

    return ConsentResponse(
        participant_id=participant.id,
        consented_at=participant.consented_at,
    )


@router.post(
    "/{participant_id}/demographics",
    response_model=DemographicsResponse,
)
def submit_demographics(
    participant_id: str,
    demographics: DemographicsRequest,
    session: Session = Depends(get_session),
):
    participant = ensure_participant_exists(participant_id, session)

    if demographics.age < 13 or demographics.age > 120:
        raise HTTPException(
            status_code=400,
            detail="Age must be between 13 and 120.",
        )

    if demographics.study_background not in VALID_STUDY_BACKGROUNDS:
        raise HTTPException(status_code=400, detail="Invalid study background.")

    if demographics.adhd_diagnosis not in VALID_ADHD_DIAGNOSES:
        raise HTTPException(status_code=400, detail="Invalid ADHD diagnosis status.")

    assignment = assign_deterministic_group(demographics)
    participant.assignment = assignment

    demographics_row = Demographics(
        participant_id=participant.id,
        age=demographics.age,
        study_background=demographics.study_background,
        adhd_diagnosis=demographics.adhd_diagnosis,
        submitted_at=current_utc_timestamp(),
    )
    session.add(participant)
    session.add(demographics_row)
    session.commit()

    return DemographicsResponse(
        participant_id=participant.id,
        assignment=assignment,
    )


@router.post(
    "/{participant_id}/events",
    response_model=InteractionEventResponse,
)
def record_interaction_event(
    participant_id: str,
    event: InteractionEventRequest,
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

    return InteractionEventResponse(
        id=interaction_event.id,
        received_at=interaction_event.received_at,
    )


@router.post(
    "/{participant_id}/post-intervention",
    response_model=PostInterventionResponsePayload,
)
def submit_post_intervention(
    participant_id: str,
    questionnaire: PostInterventionRequest,
    session: Session = Depends(get_session),
):
    ensure_participant_exists(participant_id, session)

    assignment = require_non_empty_text(questionnaire.assignment, "Assignment")
    if assignment not in {"control", "experimental"}:
        raise HTTPException(status_code=400, detail="Invalid assignment.")

    submitted_at = current_utc_timestamp()
    post_intervention_response = PostInterventionResponseModel(
        participant_id=participant_id,
        assignment=assignment,
        attention_support=require_non_empty_text(
            questionnaire.attention_support,
            "Attention support",
        ),
        content_clarity=require_non_empty_text(
            questionnaire.content_clarity,
            "Content clarity",
        ),
        workload_fit=require_non_empty_text(
            questionnaire.workload_fit,
            "Workload fit",
        ),
        preferred_format=require_non_empty_text(
            questionnaire.preferred_format,
            "Preferred format",
        ),
        open_feedback=require_non_empty_text(
            questionnaire.open_feedback,
            "Open feedback",
        ),
        submitted_at=submitted_at,
    )
    session.add(post_intervention_response)
    session.commit()

    return PostInterventionResponsePayload(
        participant_id=participant_id,
        submitted_at=submitted_at,
    )
