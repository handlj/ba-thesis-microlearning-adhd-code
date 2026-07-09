from pydantic import BaseModel


class Config(BaseModel):
    min_age: int
    max_age: int