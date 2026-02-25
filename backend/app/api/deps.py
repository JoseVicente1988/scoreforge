from fastapi import Depends, HTTPException, status, Security
from fastapi.security import OAuth2PasswordBearer
from fastapi.security.api_key import APIKeyHeader
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import decode_token
from app.crud.users import get_user_by_username
from app.crud.projects import get_project_by_api_key
from app.models import User, Project

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    try:
        username = decode_token(token)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

def require_project_from_api_key(
    db: Session = Depends(get_db),
    api_key: str | None = Security(api_key_header),
) -> Project:
    if not api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing API key")
    project = get_project_by_api_key(db, api_key)
    if not project:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid API key")
    return project
