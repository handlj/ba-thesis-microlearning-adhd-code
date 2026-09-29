from pydantic import BaseModel


class VoucherResponse(BaseModel):
    code: str
