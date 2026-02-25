from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_current_user
from app.schemas.projects import ProjectCreate, ProjectOut, ApiKeyCreated
from app.crud.projects import create_project, list_projects, create_api_key
from app.models import Project as ProjectModel

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("", response_model=ProjectOut)
def create(project_in: ProjectCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return create_project(db, owner_id=user.id, project_in=project_in)

@router.get("", response_model=list[ProjectOut])
def list_(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return list_projects(db, owner_id=user.id)

@router.post("/{project_id}/keys", response_model=ApiKeyCreated)
def new_key(project_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    project = db.get(ProjectModel, project_id)
    if not project or project.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    try:
        raw_key, _row = create_api_key(db, project_id=project_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    return {"api_key": raw_key, "project_id": project_id}
