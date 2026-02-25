from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import require_project_from_api_key
from app.schemas.scores import ScoreSubmit, ScoreOut
from app.crud.projects import submit_score, leaderboard

router = APIRouter(prefix="/scores", tags=["scores"])

@router.post("/submit")
def submit(score_in: ScoreSubmit, db: Session = Depends(get_db), project=Depends(require_project_from_api_key)):
    row = submit_score(db, project_id=project.id, score_in=score_in)
    return {"ok": True, "id": row.id}

@router.get("/leaderboard/{project_id}", response_model=list[ScoreOut])
def get_leaderboard(project_id: int, limit: int = 20, db: Session = Depends(get_db)):
    rows = leaderboard(db, project_id=project_id, limit=limit)
    return [{"username": r.username, "value": r.value} for r in rows]
