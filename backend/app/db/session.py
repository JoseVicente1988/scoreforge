from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Engine:
# - pool_pre_ping=True helps detect stale connections (useful with cloud DBs)
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Session factory:
# - autocommit=False and autoflush=False are standard defaults for explicit transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    FastAPI dependency that provides a SQLAlchemy Session.

    Usage:
        def endpoint(..., db: Session = Depends(get_db)):
            ...

    Ensures the session is always closed after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()