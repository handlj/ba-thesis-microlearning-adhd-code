from pydantic import BaseModel


class DemographicsRequest(BaseModel):
    age: int
    gender: str
    highest_education: str
    currently_studying: str
    study_background: str
    adhd_diagnosis: str
    adhd_official_diagnosis: str
    adhd_medication: str
    general_programming_experience: str
    general_programming_languages: str
    general_programming_ability: str
    python_programming_experience: str
    python_programming_ability: str
    device: str


class DemographicsResponse(BaseModel):
    participant_id: str
