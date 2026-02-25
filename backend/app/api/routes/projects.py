from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_current_user
from app.schemas.projects import ProjectCreate, ProjectOut, ApiKeyCreated
from app.crud.projects import create_project, list_projects, create_api_key
from app.models import Project as ProjectModel

router = APIRouter(prefix="/projects", tags=["projects"])


@router.post(
    "",
    response_model=ProjectOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new project",
    description=(
        "Creates a new project under the authenticated user.\n\n"
        "Security:\n"
        "- Requires JWT (Authorization: Bearer <token>)\n"
        "- Project ownership is bound to the current user"
    ),
)
def create(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
) -> ProjectOut:
    """
    Create a new project owned by the authenticated user.

    Projects represent multi-tenant namespaces.
    Each project can have a stable API key for game clients.
    """
    return create_project(db, owner_id=user.id, project_in=project_in)


@router.get(
    "",
    response_model=list[ProjectOut],
    summary="List user projects",
    description=(
        "Lists projects belonging to the authenticated user.\n\n"
        "Security:\n"
        "- Requires JWT"
    ),
)
def list_(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
) -> list[ProjectOut]:
    """
    List all projects owned by the authenticated user.
    """
    return list_projects(db, owner_id=user.id)


@router.post(
    "/{project_id}/keys",
    response_model=ApiKeyCreated,
    status_code=status.HTTP_201_CREATED,
    summary="Create (or return) the project's API key",
    description=(
        "Creates an API key for a project owned by the authenticated user.\n\n"
        "Security model:\n"
        "- Requires JWT\n"
        "- API keys are stored hashed in DB and shown only once\n\n"
        "Notes:\n"
        "- If your product design is '1 stable key per project', the CRUD layer should enforce it.\n"
        "- If a key already exists, return 409 or return the existing one based on your policy."
    ),
)
def new_key(
    project_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
) -> ApiKeyCreated:
    """
    Issue an API key for a project (project owner only).

    - Validates project existence and ownership.
    - Delegates key generation and hashing/storage to the CRUD layer.
    - Returns the raw API key (displayed once).
    """
    project = db.get(ProjectModel, project_id)
    if not project or project.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        raw_key, _row = create_api_key(db, project_id=project_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

    return {"api_key": raw_key, "project_id": project_id}