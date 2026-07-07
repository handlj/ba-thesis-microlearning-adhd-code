import json

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.config import ADHD_SCREENING_QUESTION_IDS, FAM_QUESTION_IDS, MAX_AGE, MIN_AGE
from app.config import FAM_SCALE_MAX, LIKERT_MAX, LIKERT_MIN
from app.config import PANAS_QUESTION_IDS, UES_QUESTION_IDS
from app.config import VALID_ADHD_DIAGNOSES, VALID_ASSIGNMENTS
from app.config import VALID_STUDY_BACKGROUNDS
from app.database import get_session
from app.models import AdhdScreeningResponse, Demographics, FamResponse
from app.models import InteractionEvent, PanasPostResponse, PanasPreResponse
from app.models import ParticipantSession, QuizAnswer, UesResponse
from app.models import PostInterventionResponse as PostInterventionResponseModel
from app.schemas import consent as ConsentSchemas, demographics as DemographicsSchemas, interactionEvent as InteractionEventSchemas, postIntervention as PostInterventionSchemas, questionnaire as QuestionnaireSchemas, quiz as QuizSchemas, adhdScreening as ADHDScreeningSchemas
from app.services import assign_balanced_group, current_utc_timestamp
from app.services import ensure_participant_exists, require_non_empty_text
from app.services import score_adhd_screening, validate_likert_answers


router = APIRouter(prefix="/api/participants")


@router.post("/consent", response_model=ConsentSchemas.ConsentResponse)
def create_consent_session(
    consent: ConsentSchemas.ConsentRequest,
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

    return ConsentSchemas.ConsentResponse(
        participant_id=participant.id,
        consented_at=participant.consented_at,
    )


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

    if demographics.age < MIN_AGE or demographics.age > MAX_AGE:
        raise HTTPException(
            status_code=400,
            detail=f"Age must be between {MIN_AGE} and {MAX_AGE}.",
        )

    if demographics.study_background not in VALID_STUDY_BACKGROUNDS:
        raise HTTPException(status_code=400, detail="Invalid study background.")

    if demographics.adhd_diagnosis not in VALID_ADHD_DIAGNOSES:
        raise HTTPException(status_code=400, detail="Invalid ADHD diagnosis status.")

    # Group assignment is deferred to the ADHD screening step, where it is drawn
    # from the screening result rather than self-reported demographics.
    demographics_row = Demographics(
        participant_id=participant.id,
        age=demographics.age,
        study_background=demographics.study_background,
        adhd_diagnosis=demographics.adhd_diagnosis,
        submitted_at=current_utc_timestamp(),
    )
    session.add(demographics_row)
    session.commit()

    return DemographicsSchemas.DemographicsResponse(participant_id=participant.id)


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

    assignment = require_non_empty_text(questionnaire.assignment, "Assignment")
    if assignment not in {"control", "experimental"}:
        raise HTTPException(status_code=400, detail="Invalid assignment.")

    submitted_at = current_utc_timestamp()
    post_intervention_response = PostInterventionResponseModel(
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


def _validate_assignment(assignment: str) -> str:
    normalized = require_non_empty_text(assignment, "Assignment")
    if normalized not in VALID_ASSIGNMENTS:
        raise HTTPException(status_code=400, detail="Invalid assignment.")
    return normalized


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
    assignment = _validate_assignment(request.assignment)
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
    answers = validate_likert_answers(
        request.answers,
        ADHD_SCREENING_QUESTION_IDS,
        LIKERT_MIN,
        LIKERT_MAX,
    )

    screen_positive = score_adhd_screening(answers)

    # Assign once per participant. Reusing an existing assignment keeps the
    # endpoint idempotent (e.g. on resubmission) and avoids double-counting the
    # arm balance.
    if participant.assignment is None:
        participant.adhd_screen_positive = screen_positive
        participant.assignment = assign_balanced_group(session, screen_positive)
        session.add(participant)

    submitted_at = current_utc_timestamp()
    session.add(
        AdhdScreeningResponse(
            participant_id=participant_id,
            assignment=participant.assignment,
            submitted_at=submitted_at,
            **answers,
        )
    )
    session.commit()

    return ADHDScreeningSchemas.AdhdScreeningResponsePayload(
        participant_id=participant_id,
        assignment=participant.assignment,
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


@router.post(
    "/{participant_id}/quiz",
    response_model=QuizSchemas.QuizSubmissionResponse,
)
def submit_quiz(
    participant_id: str,
    submission: QuizSchemas.QuizSubmissionRequest,
    session: Session = Depends(get_session),
):
    ensure_participant_exists(participant_id, session)
    group = _validate_assignment(submission.group)

    if not submission.answers:
        raise HTTPException(status_code=400, detail="Quiz answers are required.")

    submitted_at = current_utc_timestamp()
    for question_id, selected_options in submission.answers.items():
        quiz_answer = QuizAnswer(
            participant_id=participant_id,
            group=group,
            video_id=submission.video_id,
            video_index=submission.video_index,
            topic_id=submission.topic_id,
            question_id=question_id,
            selected_options=json.dumps(selected_options),
            submitted_at=submitted_at,
        )
        session.add(quiz_answer)
    session.commit()

    return QuizSchemas.QuizSubmissionResponse(
        participant_id=participant_id,
        answer_count=len(submission.answers),
        submitted_at=submitted_at,
    )
