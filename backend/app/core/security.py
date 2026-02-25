import hashlib
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_ALG = "HS256"


def _normalize_password(password: str) -> str:
    """
    Normalize a password before hashing/verifying.

    Why:
    - bcrypt has a hard limit of 72 bytes. If you pass longer values, bcrypt truncates
      or raises errors depending on implementation. This can cause unexpected behavior.

    Policy:
    - If password <= 72 bytes (UTF-8), keep as-is.
    - If password > 72 bytes, pre-hash with SHA-256 and use the hex digest.
      This keeps verification consistent and avoids bcrypt truncation issues.
    """
    b = password.encode("utf-8")
    if len(b) <= 72:
        return password
    return hashlib.sha256(b).hexdigest()


def hash_password(password: str) -> str:
    """
    Hash a plain password using bcrypt.

    - Uses _normalize_password() to safely handle bcrypt's 72-byte limit.
    - Returns a bcrypt hash string suitable for storage.
    """
    return pwd_context.hash(_normalize_password(password))


def verify_password(password: str, hashed: str) -> bool:
    """
    Verify a plain password against a stored bcrypt hash.

    - Applies the same normalization rules as hashing.
    """
    return pwd_context.verify(_normalize_password(password), hashed)


def create_access_token(subject: str) -> str:
    """
    Create a signed JWT access token.

    Claims:
    - sub: subject identifier (username in this project)
    - iat: issued-at unix timestamp
    - exp: expiration unix timestamp

    Security:
    - Signed with settings.JWT_SECRET using HS256.
    - Expiration controlled by settings.ACCESS_TOKEN_MINUTES.
    """
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=settings.ACCESS_TOKEN_MINUTES)

    payload = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }

    return jwt.encode(payload, settings.JWT_SECRET, algorithm=JWT_ALG)


def decode_token(token: str) -> str:
    """
    Decode and validate a JWT token.

    Returns:
    - The `sub` claim as a string (subject identifier)

    Raises:
    - JWTError if the token is invalid/expired/missing required claims.
    """
    payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[JWT_ALG])
    sub = payload.get("sub")
    if not sub:
        raise JWTError("Missing subject")
    return str(sub)