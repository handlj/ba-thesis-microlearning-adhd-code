from fastapi import APIRouter, Depends

from sqlmodel import Session, select

from app.schemas import PostInterventionSchemas

from app.models import PostInterventionResponse

from app.database import get_session

from app.services import (
    ensure_participant_exists,
    current_utc_timestamp,
    validate_assignment,
)


router = APIRouter(prefix="/api/participants")


@router.post(
    "/{participant_id}/post-intervention",
    response_model=PostInterventionSchemas.PostInterventionResponsePayload,
)
def submit_post_intervention(
    participant_id: str,
    questionnaire: PostInterventionSchemas.PostInterventionRequest,
    session: Session = Depends(get_session),
):
    ensure_participant_exists(participant_id, session)

    existing = session.exec(
        select(PostInterventionResponse).where(PostInterventionResponse.participant_id == participant_id)
    ).first()
    if existing is not None:
        return PostInterventionSchemas.PostInterventionResponsePayload(
            participant_id=participant_id,
            submitted_at=existing.submitted_at,
        )

    assignment = validate_assignment(questionnaire.assignment)

    submitted_at = current_utc_timestamp()

    post_intervention_response = PostInterventionResponse(
        participant_id=participant_id,
        assignment=assignment,
        open_feedback=questionnaire.open_feedback,
        submitted_at=submitted_at,
    )

    session.add(post_intervention_response)
    session.commit()

    return PostInterventionSchemas.PostInterventionResponsePayload(
        participant_id=participant_id,
        submitted_at=submitted_at,
    )
