from pydantic import BaseModel, Field

class ScoreSubmit(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    value: int = Field(ge=0)

class ScoreOut(BaseModel):
    username: str
    value: int
