from fastapi import HTTPException

from app.config.demographics_validation import (
    MAX_AGE,
    MIN_AGE,
    VALID_ADHD_DIAGNOSES,
    VALID_ADHD_MEDICATION,
    VALID_ADHD_OFFICIAL_DIAGNOSES,
    VALID_CURRENTLY_STUDYING,
    VALID_DEVICES,
    VALID_GENDERS,
    VALID_GENERAL_PROGRAMMING_ABILITY,
    VALID_GENERAL_PROGRAMMING_EXPERIENCE,
    VALID_HAS_OTHER_DIAGNOSES,
    VALID_HIGHEST_EDUCATION,
    VALID_PYTHON_PROGRAMMING_ABILITY,
    VALID_PYTHON_PROGRAMMING_EXPERIENCE,
)
from app.config.errors import (
    ERROR_INVALID_ADHD_DIAGNOSIS,
    ERROR_INVALID_AGE,
)
from app.config.http_status_codes import (
    HTTP_400_BAD_REQUEST,
)
from app.schemas import DemographicsSchemas
from app.services.validation.validation import (
    require_non_empty_text,
)


def _validate_age(age: int) -> int:
    if age < MIN_AGE or age > MAX_AGE:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=ERROR_INVALID_AGE.format(MIN_AGE=MIN_AGE, MAX_AGE=MAX_AGE),
        )
    return age


def _validate_gender(gender: str) -> str:
    if gender not in VALID_GENDERS:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=f"Invalid gender: {gender}")
    return gender


def _validate_highest_education(highest_education: str) -> str:
    if highest_education not in VALID_HIGHEST_EDUCATION:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid highest education: {highest_education}",
        )
    return highest_education


def _validate_currently_studying(currently_studying: str) -> str:
    if currently_studying not in VALID_CURRENTLY_STUDYING:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid currently studying: {currently_studying}",
        )
    return currently_studying


def _validate_device(device: str) -> str:
    if device not in VALID_DEVICES:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=f"Invalid device: {device}")
    return device


def _validate_adhd_diagnosis(diagnosis: str) -> str:
    if diagnosis not in VALID_ADHD_DIAGNOSES:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=ERROR_INVALID_ADHD_DIAGNOSIS)
    return diagnosis


def _validate_adhd_official_diagnosis(official_diagnosis: str) -> str:
    if official_diagnosis not in VALID_ADHD_OFFICIAL_DIAGNOSES:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid ADHD official diagnosis: {official_diagnosis}",
        )
    return official_diagnosis


def _validate_adhd_medication(medication: str) -> str:
    if medication not in VALID_ADHD_MEDICATION:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid ADHD medication: {medication}",
        )
    return medication


def _validate_has_other_diagnoses(has_other: str) -> str:
    if has_other not in VALID_HAS_OTHER_DIAGNOSES:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid has other diagnoses: {has_other}",
        )
    return has_other


def _validate_general_programming_experience(experience: str) -> str:
    if experience not in VALID_GENERAL_PROGRAMMING_EXPERIENCE:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid general programming experience: {experience}",
        )
    return experience


def _validate_general_programming_ability(ability: str) -> str:
    if ability not in VALID_GENERAL_PROGRAMMING_ABILITY:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid general programming ability: {ability}",
        )
    return ability


def _validate_python_programming_experience(experience: str) -> str:
    if experience not in VALID_PYTHON_PROGRAMMING_EXPERIENCE:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid Python programming experience: {experience}",
        )
    return experience


def _validate_python_programming_ability(ability: str) -> str:
    if ability not in VALID_PYTHON_PROGRAMMING_ABILITY:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid Python programming ability: {ability}",
        )
    return ability


def validate_demographics(
    demographics: DemographicsSchemas.DemographicsRequest,
) -> DemographicsSchemas.DemographicsRequest:
    _validate_age(demographics.age)
    _validate_gender(demographics.gender)
    _validate_highest_education(demographics.highest_education)
    _validate_currently_studying(demographics.currently_studying)
    _validate_device(demographics.device)
    _validate_adhd_diagnosis(demographics.adhd_diagnosis)
    _validate_adhd_official_diagnosis(demographics.adhd_official_diagnosis)
    _validate_adhd_medication(demographics.adhd_medication)
    _validate_has_other_diagnoses(demographics.has_other_diagnoses)
    _validate_general_programming_experience(demographics.general_programming_experience)
    _validate_general_programming_ability(demographics.general_programming_ability)
    _validate_python_programming_experience(demographics.python_programming_experience)
    _validate_python_programming_ability(demographics.python_programming_ability)

    require_non_empty_text(demographics.study_background, "Study background")
    require_non_empty_text(demographics.other_diagnoses, "Other diagnoses")
    require_non_empty_text(
        demographics.general_programming_languages, "General programming languages"
    )

    return demographics
