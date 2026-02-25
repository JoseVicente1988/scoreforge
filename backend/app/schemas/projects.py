from pydantic import BaseModel, Field


class ProjectCreate(BaseModel):
    """
    Payload used to create a new project.

    A project represents a leaderboard namespace (multi-tenant boundary).
    API keys are issued per project and used by game clients (e.g., Godot).
    """

    name: str = Field(
        min_length=2,
        max_length=80,
        description="Human-readable project name (2-80 characters).",
        examples=["MyGame - Production"],
    )


class ProjectOut(BaseModel):
    """
    Public representation of a project returned by the API.

    Used by: GET /projects, POST /projects
    """

    id: int = Field(description="Project unique identifier.")
    name: str = Field(description="Project name.")

    class Config:
        from_attributes = True


class ApiKeyCreated(BaseModel):
    """
    Response returned after creating an API key for a project.

    Security notes:
    - The API key is displayed only once.
    - The server stores only a hash of the key.
    - Game clients should send it via: X-API-Key.
    """

    api_key: str = Field(
        description="Plain API key (displayed once). Store it safely; it won't be shown again.",
        examples=["sf_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
    )
    project_id: int = Field(description="Project ID the key belongs to.")
