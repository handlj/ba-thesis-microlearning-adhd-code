from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.config import (
    ADHD_SCREENING_QUESTION_IDS,
    FAM_QUESTION_IDS,
    FAM_SCALE_MAX,
    LIKERT_MAX,
    LIKERT_MIN,
    PANAS_QUESTION_IDS,
    UES_QUESTION_IDS,
)
from app.database import get_session
from app.models import (
    AdhdScreeningResponse,
    FamResponse,
    PanasPostResponse,
    PanasPreResponse,
    UesResponse,
)
from app.schemas import ADHDScreeningSchemas, QuestionnaireSchemas
from app.services import (
    assign_balanced_group,
    ensure_participant_exists,
    score_adhd_screening,
    validate_assignment,
    validate_likert_answers,
    validate_subgroup,
)
from app.timestamps import current_utc_timestamp

router = APIRouter(prefix="/api/participants")


def _persist_questionnaire(
    participant_id: str,
    request: QuestionnaireSchemas.LikertQuestionnaireRequest,
    session: Session,
    model: type,
    expected_ids: set[str],
    min_value: int,
    max_value: int,
) -> QuestionnaireSchemas.QuestionnaireResponsePayload:
    ensure_participant_exists(participant_id, session)

    existing = session.exec(select(model).where(model.participant_id == participant_id)).first()

    if existing is not None:
        return QuestionnaireSchemas.QuestionnaireResponsePayload(
            participant_id=participant_id,
            submitted_at=existing.submitted_at,
        )

    assignment = validate_assignment(request.assignment)
    subgroup = validate_subgroup(request.subgroup, assignment)

    answers = validate_likert_answers(
        request.answers,
        expected_ids,
        min_value,
        max_value,
    )

    submitted_at = current_utc_timestamp()

    row = model(
        participant_id=participant_id,
        assignment=assignment,
        subgroup=subgroup,
        submitted_at=submitted_at,
        **answers,
    )

    session.add(row)
    session.commit()

    return QuestionnaireSchemas.QuestionnaireResponsePayload(
        participant_id=participant_id,
        submitted_at=submitted_at,
    )


@router.post(
    "/{participant_id}/adhd-screening",
    response_model=ADHDScreeningSchemas.AdhdScreeningResponsePayload,
)
def submit_adhd_screening(
    participant_id: str,
    request: ADHDScreeningSchemas.AdhdScreeningRequest,
    session: Session = Depends(get_session),
):
    participant = ensure_participant_exists(participant_id, session)

    existing = session.exec(
        select(AdhdScreeningResponse).where(AdhdScreeningResponse.participant_id == participant_id)
    ).first()

    if existing is not None:
        return ADHDScreeningSchemas.AdhdScreeningResponsePayload(
            participant_id=participant_id,
            assignment=participant.assignment,
            subgroup=participant.subgroup,
            submitted_at=existing.submitted_at,
        )

    answers = validate_likert_answers(
        request.answers,
        ADHD_SCREENING_QUESTION_IDS,
        LIKERT_MIN,
        LIKERT_MAX,
    )

    screen_positive = score_adhd_screening(answers)

    if participant.assignment is None and participant.subgroup is None:
        participant.adhd_screen_positive = screen_positive
        participant.assignment, participant.subgroup = assign_balanced_group(
            session, screen_positive
        )
        session.add(participant)

    submitted_at = current_utc_timestamp()

    session.add(
        AdhdScreeningResponse(
            participant_id=participant_id,
            assignment=participant.assignment,
            subgroup=participant.subgroup,
            submitted_at=submitted_at,
            **answers,
        )
    )

    session.commit()

    return ADHDScreeningSchemas.AdhdScreeningResponsePayload(
        participant_id=participant_id,
        assignment=participant.assignment,
        subgroup=participant.subgroup,
        submitted_at=submitted_at,
    )


@router.post(
    "/{participant_id}/panas-pre",
    response_model=QuestionnaireSchemas.QuestionnaireResponsePayload,
)
def submit_panas_pre(
    participant_id: str,
    questionnaire: QuestionnaireSchemas.LikertQuestionnaireRequest,
    session: Session = Depends(get_session),
):
    return _persist_questionnaire(
        participant_id,
        questionnaire,
        session,
        PanasPreResponse,
        PANAS_QUESTION_IDS,
        LIKERT_MIN,
        LIKERT_MAX,
    )


@router.post(
    "/{participant_id}/panas-post",
    response_model=QuestionnaireSchemas.QuestionnaireResponsePayload,
)
def submit_panas_post(
    participant_id: str,
    questionnaire: QuestionnaireSchemas.LikertQuestionnaireRequest,
    session: Session = Depends(get_session),
):
    return _persist_questionnaire(
        participant_id,
        questionnaire,
        session,
        PanasPostResponse,
        PANAS_QUESTION_IDS,
        LIKERT_MIN,
        LIKERT_MAX,
    )


@router.post(
    "/{participant_id}/fam",
    response_model=QuestionnaireSchemas.QuestionnaireResponsePayload,
)
def submit_fam(
    participant_id: str,
    questionnaire: QuestionnaireSchemas.LikertQuestionnaireRequest,
    session: Session = Depends(get_session),
):
    return _persist_questionnaire(
        participant_id,
        questionnaire,
        session,
        FamResponse,
        FAM_QUESTION_IDS,
        LIKERT_MIN,
        FAM_SCALE_MAX,
    )


@router.post(
    "/{participant_id}/ues",
    response_model=QuestionnaireSchemas.QuestionnaireResponsePayload,
)
def submit_ues(
    participant_id: str,
    questionnaire: QuestionnaireSchemas.LikertQuestionnaireRequest,
    session: Session = Depends(get_session),
):
    return _persist_questionnaire(
        participant_id,
        questionnaire,
        session,
        UesResponse,
        UES_QUESTION_IDS,
        LIKERT_MIN,
        LIKERT_MAX,
    )
