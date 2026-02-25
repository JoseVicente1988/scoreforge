from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Central configuration for Scoreforge.

    Loads environment variables from `.env` for local development.
    In production, environment variables should be provided by the hosting platform.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database connection string (e.g. Neon Postgres URL)
    DATABASE_URL: str

    # JWT signing secret (keep it private, never commit)
    JWT_SECRET: str

    # Access token expiration in minutes
    ACCESS_TOKEN_MINUTES: int = 60

    # Comma-separated allowed origins for CORS
    # Example: "http://localhost:3000,https://scoreforge.vercel.app"
    CORS_ORIGINS: str = "http://localhost:3000"


settings = Settings()