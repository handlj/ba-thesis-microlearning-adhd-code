from pydantic import BaseModel


class Config(BaseModel):
    min_age: int
    max_age: int
    quiz_pass_threshold: int
    quiz_max_attempts: int