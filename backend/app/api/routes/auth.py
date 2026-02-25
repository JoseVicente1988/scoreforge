from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import UserCreate, UserOut, TokenOut
from app.crud.users import (
    get_user_by_username,
    get_user_by_email,
    create_user,
    authenticate_user,
)
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new dashboard user",
    description=(
        "Creates a new user for the Scoreforge dashboard.\n\n"
        "Validations:\n"
        "- Username must be unique\n"
        "- Email must be unique\n\n"
        "Security:\n"
        "- Password is hashed server-side (bcrypt)\n"
        "- Plain passwords are never stored"
    ),
)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> UserOut:
    """
    Register a new dashboard user account.

    - Checks that username/email are unique.
    - Delegates password hashing + persistence to the CRUD layer.
    - Returns a public user representation (no password fields).
    """
    if get_user_by_username(db, user_in.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    if get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="Email already exists")
    return create_user(db, user_in)


@router.post(
    "/login",
    response_model=TokenOut,
    summary="Login and obtain a JWT",
    description=(
        "Authenticates a dashboard user using OAuth2 form-data.\n\n"
        "Request format:\n"
        "- username=<username>\n"
        "- password=<password>\n\n"
        "Response:\n"
        "- access_token (JWT)\n"
        "- token_type=bearer\n\n"
        "Use the token in subsequent requests:\n"
        "Authorization: Bearer <token>"
    ),
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> TokenOut:
    """
    Authenticate a user and return a JWT access token.

    Notes:
    - Uses OAuth2PasswordRequestForm (form-data) to match FastAPI's OAuth2 tooling.
    - The JWT `sub` claim uses the username for stable identity lookup.
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(subject=user.username)
    return {"access_token": token, "token_type": "bearer"}