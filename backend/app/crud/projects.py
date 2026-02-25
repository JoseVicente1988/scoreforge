import hashlib
import secrets

from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.models import ApiKey, Project, Score
from app.schemas.projects import ProjectCreate
from app.schemas.scores import ScoreSubmit


def create_project(db: Session, owner_id: int, project_in: ProjectCreate) -> Project:
    """
    Create a new project owned by a specific user.

    A project is the multi-tenant boundary for leaderboard data:
    - Each project can have one stable API key (by current product policy)
    - Scores are always stored under a project_id

    Args:
        db: SQLAlchemy session.
        owner_id: User ID of the project owner.
        project_in: Validated input payload (name constraints enforced by Pydantic).

    Returns:
        The persisted Project row.
    """
    project = Project(name=project_in.name, owner_id=owner_id)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def list_projects(db: Session, owner_id: int) -> list[Project]:
    """
    List all projects owned by the given user.

    Args:
        db: SQLAlchemy session.
        owner_id: User ID of the owner.

    Returns:
        List of Project rows.
    """
    return db.execute(select(Project).where(Project.owner_id == owner_id)).scalars().all()


def _hash_api_key(raw: str) -> str:
    """
    Hash an API key for storage/lookup.

    Current implementation:
    - SHA-256 of the raw key

    Security note:
    - For stronger protection against DB leaks, you can introduce a server-side "pepper"
      (secret string) concatenated to the raw key before hashing.
      Example:
          sha256((raw + settings.API_KEY_PEPPER).encode()).hexdigest()

    Keep in mind:
    - If you introduce a pepper later, existing keys must be migrated or re-issued.
    """
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def get_api_key_row(db: Session, project_id: int) -> ApiKey | None:
    """
    Return the API key row for a project (if it exists).

    Args:
        db: SQLAlchemy session.
        project_id: Project ID.

    Returns:
        ApiKey row or None.
    """
    return db.execute(select(ApiKey).where(ApiKey.project_id == project_id)).scalar_one_or_none()


def create_api_key(db: Session, project_id: int) -> tuple[str, ApiKey]:
    """
    Create a stable API key for a project (one key per project policy).

    Product policy (current):
    - Each project has exactly one API key.
    - Keys do NOT rotate automatically.
    - If you need rotation, implement:
        - create a new key (keep old for grace period)
        - revoke old key
        - log key creation and revocation

    Security model:
    - The raw key is returned only once (to be shown in dashboard).
    - Only the hash is stored in the database.

    Args:
        db: SQLAlchemy session.
        project_id: Project ID.

    Returns:
        (raw_key, ApiKey_row)

    Raises:
        ValueError: if a key already exists for the project.
    """
    existing = get_api_key_row(db, project_id)
    if existing:
        raise ValueError("API key already exists for this project")

    # token_urlsafe(32) produces a URL-safe string with high entropy.
    raw_key = secrets.token_urlsafe(32)

    row = ApiKey(project_id=project_id, key_hash=_hash_api_key(raw_key))
    db.add(row)
    db.commit()
    db.refresh(row)
    return raw_key, row


def get_project_by_api_key(db: Session, raw_key: str) -> Project | None:
    """
    Resolve a Project given a raw API key (X-API-Key header).

    Flow:
    - Hash the provided raw key
    - Look up ApiKey row by key_hash
    - Load the associated Project

    Args:
        db: SQLAlchemy session.
        raw_key: Raw API key provided by the client.

    Returns:
        Project row if found, else None.
    """
    key_hash = _hash_api_key(raw_key)
    api_key = db.execute(select(ApiKey).where(ApiKey.key_hash == key_hash)).scalar_one_or_none()
    if not api_key:
        return None
    return db.get(Project, api_key.project_id)


def submit_score(db: Session, project_id: int, score_in: ScoreSubmit) -> Score:
    """
    Persist a submitted score under a project.

    Security:
    - project_id must come from a trusted source (API key dependency).
      Do NOT accept project_id from the game client body for writes.

    Args:
        db: SQLAlchemy session.
        project_id: Project ID (resolved from API key).
        score_in: Payload with username and score value.

    Returns:
        The persisted Score row.
    """
    row = Score(project_id=project_id, username=score_in.username, value=score_in.value)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def leaderboard(db: Session, project_id: int, limit: int = 20) -> list[Score]:
    """
    Fetch the top scores for a project.

    Ordering:
    - Higher score first
    - If tied, newer scores first (created_at desc)

    Args:
        db: SQLAlchemy session.
        project_id: Project ID.
        limit: Max number of results.

    Returns:
        List of Score rows.
    """
    stmt = (
        select(Score)
        .where(Score.project_id == project_id)
        .order_by(desc(Score.value), desc(Score.created_at))
        .limit(limit)
    )
    return db.execute(stmt).scalars().all()