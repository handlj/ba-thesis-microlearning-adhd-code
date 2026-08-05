from datetime import datetime

from pydantic import BaseModel


class ConsentRequest(BaseModel):
    consented: bool


class ConsentResponse(BaseModel):
    participant_id: str
    consented_at: datetime
