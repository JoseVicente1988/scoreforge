from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app import models  # noqa: F401  (ensures model metadata is registered)
from app.api.routes.auth import router as auth_router
from app.api.routes.projects import router as projects_router
from app.api.routes.scores import router as scores_router


def create_app() -> FastAPI:
    """
    Application factory for Scoreforge.

    Why a factory:
    - Cleaner testability
    - Clear separation of app creation vs runtime side-effects
    - Avoids surprises when running under reload/multiprocess

    Notes:
    - DB schema creation is attached to the startup event for dev convenience.
      In production you should use Alembic migrations instead.
    """
    app = FastAPI(
        title="Scoreforge",
        version="0.1.0",
        description=(
            "Scoreforge is a multi-tenant leaderboard SaaS.\n\n"
            "Auth model:\n"
            "- JWT for dashboard users (register/login)\n"
            "- X-API-Key for game clients (submit scores)\n"
        ),
    )

    # CORS configuration:
    # - In local dev: frontend runs on http://localhost:3000
    # - For production: set CORS_ORIGINS to your deployed frontend domain(s)
    origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins if origins else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health", tags=["health"], summary="Health check")
    def health() -> dict:
        """Lightweight health endpoint used for uptime checks and deployments."""
        return {"status": "ok"}

    @app.on_event("startup")
    def _startup_create_tables() -> None:
        """
        DEV convenience: auto-create DB tables.

        Important:
        - This should be removed/disabled in production.
        - Use Alembic migrations for controlled schema evolution.
        """
        Base.metadata.create_all(bind=engine)

    # Routers
    app.include_router(auth_router)
    app.include_router(projects_router)
    app.include_router(scores_router)

    return app


app = create_app()