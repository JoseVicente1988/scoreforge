from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app import models  # noqa: F401
from app.api.routes.auth import router as auth_router
from app.api.routes.projects import router as projects_router
from app.api.routes.scores import router as scores_router

app = FastAPI(title="Scoreforge")

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}

# DEV convenience. For production: use Alembic migrations.
Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(scores_router)
