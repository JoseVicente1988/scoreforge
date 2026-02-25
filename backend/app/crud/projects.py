import hashlib
import secrets
from sqlalchemy import select, desc
from sqlalchemy.orm import Session
from app.models import Project, ApiKey, Score
from app.schemas.projects import ProjectCreate
from app.schemas.scores import ScoreSubmit

def create_project(db: Session, owner_id: int, project_in: ProjectCreate) -> Project:
    project = Project(name=project_in.name, owner_id=owner_id)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

def list_projects(db: Session, owner_id: int) -> list[Project]:
    return db.execute(select(Project).where(Project.owner_id == owner_id)).scalars().all()

def _hash_api_key(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()

def create_api_key(db: Session, project_id: int) -> tuple[str, ApiKey]:
    # One key per project (stable). If you need a new one, implement rotation.
    existing = get_api_key_row(db, project_id)
    if existing:
        raise ValueError("API key already exists for this project")
    raw_key = secrets.token_urlsafe(32)
    row = ApiKey(project_id=project_id, key_hash=_hash_api_key(raw_key))
    db.add(row)
    db.commit()
    db.refresh(row)
    return raw_key, row



def get_api_key_row(db: Session, project_id: int) -> ApiKey | None:
    return db.execute(select(ApiKey).where(ApiKey.project_id == project_id)).scalar_one_or_none()


def get_project_by_api_key(db: Session, raw_key: str) -> Project | None:
    key_hash = _hash_api_key(raw_key)
    api_key = db.execute(select(ApiKey).where(ApiKey.key_hash == key_hash)).scalar_one_or_none()
    if not api_key:
        return None
    return db.get(Project, api_key.project_id)

def submit_score(db: Session, project_id: int, score_in: ScoreSubmit) -> Score:
    row = Score(project_id=project_id, username=score_in.username, value=score_in.value)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row

def leaderboard(db: Session, project_id: int, limit: int = 20) -> list[Score]:
    stmt = (
        select(Score)
        .where(Score.project_id == project_id)
        .order_by(desc(Score.value), desc(Score.created_at))
        .limit(limit)
    )
    return db.execute(stmt).scalars().all()
