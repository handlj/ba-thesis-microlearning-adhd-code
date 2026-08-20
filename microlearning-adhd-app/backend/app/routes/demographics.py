from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.models import Demographics
from app.schemas import DemographicsSchemas
from app.services import (
    ensure_participant_exists,
    require_non_empty_text,
    score_prior_programming_experience,
    validate_adhd_diagnosis,
    validate_age,
)
from app.timestamps import current_utc_timestamp

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

    prior_programming_experience_score = score_prior_programming_experience(
        demographics.general_programming_ability, demographics.python_programming_ability
    )

    demographics_row = Demographics(
        participant_id=participant.id,
        age=demographics.age,
        gender=demographics.gender,
        highest_education=demographics.highest_education,
        currently_studying=demographics.currently_studying,
        study_background=require_non_empty_text(demographics.study_background, "Study background"),
        adhd_diagnosis=demographics.adhd_diagnosis,
        adhd_official_diagnosis=demographics.adhd_official_diagnosis,
        adhd_medication=demographics.adhd_medication,
        device=demographics.device,
        general_programming_experience=demographics.general_programming_experience,
        general_programming_languages=require_non_empty_text(
            demographics.general_programming_languages, "General programming languages"
        ),
        general_programming_ability=demographics.general_programming_ability,
        python_programming_experience=demographics.python_programming_experience,
        python_programming_ability=demographics.python_programming_ability,
        prior_programming_experience_score=prior_programming_experience_score,
        submitted_at=current_utc_timestamp(),
    )

    if (participant.prior_programming_experience_score is None) or (
        participant.prior_programming_experience_score != prior_programming_experience_score
    ):
        participant.prior_programming_experience_score = prior_programming_experience_score
        session.add(participant)

    session.add(demographics_row)
    session.commit()

    return DemographicsSchemas.DemographicsResponse(participant_id=participant.id)
