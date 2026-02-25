from pydantic import BaseModel, Field

class ProjectCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)

class ProjectOut(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

class ApiKeyCreated(BaseModel):
    api_key: str
    project_id: int
