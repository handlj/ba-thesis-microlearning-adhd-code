from pydantic import BaseModel

class DemographicsRequest(BaseModel):
    age: int
    study_background: str
    adhd_diagnosis: str


class DemographicsResponse(BaseModel):
    participant_id: str
