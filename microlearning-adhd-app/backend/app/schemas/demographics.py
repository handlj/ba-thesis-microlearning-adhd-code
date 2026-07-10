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


class DemographicsResponse(BaseModel):
    participant_id: str
