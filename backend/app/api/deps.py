from fastapi import Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader, OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.crud.projects import get_project_by_api_key
from app.crud.users import get_user_by_username
from app.db.session import get_db
from app.models import Project, User

# OAuth2 bearer token extractor.
# FastAPI uses this to read: Authorization: Bearer <token>
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# API key extractor for game clients (Godot, etc.).
# We set auto_error=False so we can raise our own precise errors.
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    """
    Resolve the currently authenticated dashboard user (JWT-based).

    Auth mechanism:
    - Reads Authorization: Bearer <JWT>
    - Decodes/validates token signature and expiration
    - Extracts the `sub` claim (username)
    - Loads the user from database

    Raises:
    - 401 Invalid token: token is missing/invalid/expired
    - 401 User not found: token is valid but the user no longer exists
    """
    try:
        username = decode_token(token)
    except Exception:
        # Deliberately not leaking decoding details to the client
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


def require_project_from_api_key(
    db: Session = Depends(get_db),
    api_key: str | None = Security(api_key_header),
) -> Project:
    """
    Resolve the project associated with a game client's API key (API-key based).

    Auth mechanism:
    - Reads X-API-Key: <api_key>
    - Looks up the project via a hashed key comparison in the database
    - Returns the Project as the multi-tenant boundary

    Raises:
    - 401 Missing API key: header not provided
    - 403 Invalid API key: key provided but not found/invalid
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API key",
        )

    project = get_project_by_api_key(db, api_key)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API key",
        )

    return project