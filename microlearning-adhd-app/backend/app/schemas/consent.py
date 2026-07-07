from pydantic import BaseModel
from datetime import datetime

class ConsentRequest(BaseModel):
    consented: bool


class ConsentResponse(BaseModel):
    participant_id: str
    consented_at: datetime
