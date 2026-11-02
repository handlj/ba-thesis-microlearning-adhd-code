from pydantic import BaseModel


class DemographicsRequest(BaseModel):
    age: int
    gender: str
    gender_other: str
    highest_education: str
    currently_studying: str
    study_background: str
    device: str
    adhd_diagnosis: str
    adhd_official_diagnosis: str
    adhd_medication: str
    has_other_diagnoses: str
    other_diagnoses: str
    python_programming_experience: str
    python_programming_ability: str
    other_programming_experience: str
    other_programming_languages: str
    general_programming_ability: str


class DemographicsResponse(BaseModel):
    participant_id: str
