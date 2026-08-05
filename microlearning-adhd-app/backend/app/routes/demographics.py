from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.models import Demographics
from app.schemas import DemographicsSchemas
from app.services import (
    current_utc_timestamp,
    ensure_participant_exists,
    require_non_empty_text,
    validate_adhd_diagnosis,
    validate_age,
)

router = APIRouter(prefix="/api/participants")


@router.post(
    "/{participant_id}/demographics",
    response_model=DemographicsSchemas.DemographicsResponse,
)
def submit_demographics(
    participant_id: str,
    demographics: DemographicsSchemas.DemographicsRequest,
    session: Session = Depends(get_session),
):
    participant = ensure_participant_exists(participant_id, session)

    existing = session.exec(
        select(Demographics).where(Demographics.participant_id == participant_id)
    ).first()
    if existing is not None:
        return DemographicsSchemas.DemographicsResponse(participant_id=participant_id)

    validate_age(demographics.age)
    validate_adhd_diagnosis(demographics.adhd_diagnosis)

    demographics_row = Demographics(
        participant_id=participant.id,
        age=demographics.age,
        gender=demographics.gender,
        highest_education=demographics.highest_education,
        currently_studying=demographics.currently_studying,
        # TODO: Investigate if study_background can be empty or null
        study_background=require_non_empty_text(demographics.study_background, "Study background"),
        adhd_diagnosis=demographics.adhd_diagnosis,
        adhd_official_diagnosis=demographics.adhd_official_diagnosis,
        adhd_medication=demographics.adhd_medication,
        submitted_at=current_utc_timestamp(),
    )

    session.add(demographics_row)
    session.commit()

    return DemographicsSchemas.DemographicsResponse(participant_id=participant.id)
