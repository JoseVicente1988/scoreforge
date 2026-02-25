from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import require_project_from_api_key
from app.schemas.scores import ScoreSubmit, ScoreOut
from app.crud.projects import submit_score, leaderboard

router = APIRouter(prefix="/scores", tags=["scores"])


@router.post(
    "/submit",
    summary="Submit a score (API key)",
    description=(
        "Submits a score to a project leaderboard.\n\n"
        "Security:\n"
        "- Requires X-API-Key header\n"
        "- The API key identifies the project (multi-tenant boundary)\n\n"
        "Headers:\n"
        "X-API-Key: <project_api_key>"
    ),
)
def submit(
    score_in: ScoreSubmit,
    db: Session = Depends(get_db),
    project=Depends(require_project_from_api_key),
) -> dict:
    """
    Submit a new score for the authenticated project (API key based).

    - `require_project_from_api_key` resolves the project by API key.
    - Scores are stored under the resolved project ID.
    """
    row = submit_score(db, project_id=project.id, score_in=score_in)
    return {"ok": True, "id": row.id}


@router.get(
    "/leaderboard/{project_id}",
    response_model=list[ScoreOut],
    summary="Get leaderboard (public read)",
    description=(
        "Returns the top scores for a given project.\n\n"
        "Notes:\n"
        "- This endpoint is currently public read (no auth)."
    ),
)
def get_leaderboard(
    project_id: int,
    limit: int = 20,
    db: Session = Depends(get_db),
) -> list[ScoreOut]:
    """
    Fetch the top scores for a project.

    - Ordered by score descending (implementation in CRUD layer).
    - Returns a list of username + value pairs.
    """
    rows = leaderboard(db, project_id=project_id, limit=limit)
    return [{"username": r.username, "value": r.value} for r in rows]