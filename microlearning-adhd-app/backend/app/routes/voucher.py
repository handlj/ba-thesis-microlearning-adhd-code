from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import update
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from app.config.errors import (
    ERROR_VOUCHER_ALREADY_ISSUED,
    ERROR_VOUCHER_GENERATION_FAILED,
    ERROR_VOUCHER_NOT_ELIGIBLE,
)
from app.config.http_status_codes import (
    HTTP_403_FORBIDDEN,
    HTTP_409_CONFLICT,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from app.config.voucher import VOUCHER_CODE_MAX_ATTEMPTS
from app.database import get_session
from app.models import ParticipantSession, PostInterventionResponse, VoucherCode
from app.schemas import VoucherSchemas
from app.services import ensure_participant_exists, format_voucher_code, generate_voucher_code

router = APIRouter(prefix="/api/participants")


@router.post("/{participant_id}/voucher", response_model=VoucherSchemas.VoucherResponse)
def issue_voucher(
    participant_id: str,
    session: Session = Depends(get_session),
):
    ensure_participant_exists(participant_id, session)

    completed_study = session.exec(
        select(PostInterventionResponse.id).where(
            PostInterventionResponse.participant_id == participant_id
        )
    ).first()
    if completed_study is None:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail=ERROR_VOUCHER_NOT_ELIGIBLE)

    already_claimed = session.exec(
        update(ParticipantSession)
        .where(ParticipantSession.id == participant_id)
        .where(ParticipantSession.voucher_issued.is_(False))
        .values(voucher_issued=True)
    )
    if already_claimed.rowcount != 1:
        session.rollback()
        raise HTTPException(status_code=HTTP_409_CONFLICT, detail=ERROR_VOUCHER_ALREADY_ISSUED)

    for _ in range(VOUCHER_CODE_MAX_ATTEMPTS):
        code = generate_voucher_code()
        try:
            with session.begin_nested():
                session.add(VoucherCode(code=code))
        except IntegrityError:
            continue

        session.commit()
        return VoucherSchemas.VoucherResponse(code=format_voucher_code(code))

    session.rollback()
    raise HTTPException(
        status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail=ERROR_VOUCHER_GENERATION_FAILED
    )
