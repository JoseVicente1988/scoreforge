from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models import User
from app.schemas.auth import UserCreate


def get_user_by_username(db: Session, username: str) -> User | None:
    """
    Fetch a user by username.

    Args:
        db: SQLAlchemy session.
        username: Username to look up.

    Returns:
        User row if found, otherwise None.
    """
    return db.execute(select(User).where(User.username == username)).scalar_one_or_none()


def get_user_by_email(db: Session, email: str) -> User | None:
    """
    Fetch a user by email.

    Args:
        db: SQLAlchemy session.
        email: Email to look up.

    Returns:
        User row if found, otherwise None.
    """
    return db.execute(select(User).where(User.email == email)).scalar_one_or_none()


def create_user(db: Session, user_in: UserCreate) -> User:
    """
    Create and persist a new user.

    Security:
    - The password is hashed server-side using bcrypt (via hash_password()).
    - Plain passwords are never stored.

    Args:
        db: SQLAlchemy session.
        user_in: Validated input payload (username/email/password).

    Returns:
        Persisted User row.
    """
    user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, username: str, password: str) -> User | None:
    """
    Authenticate a user by username and password.

    Behavior:
    - Looks up the user by username.
    - Verifies the submitted password against the stored hash.
    - Returns the user on success, otherwise None.

    Security note (user enumeration):
    - This returns None both when the user does not exist and when the password is wrong.
      That keeps the calling layer free to respond with a single "Invalid credentials" message.
    """
    user = get_user_by_username(db, username)
    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user