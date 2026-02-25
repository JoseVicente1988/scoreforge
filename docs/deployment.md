# Deployment (High-Level)

## Backend
- Host: Render (or similar)
- Start: uvicorn app.main:app --host 0.0.0.0 --port 10000
- Env:
  - DATABASE_URL
  - JWT_SECRET
  - CORS_ORIGINS

## Database
- Host: Neon (PostgreSQL)
- Use the Neon connection string as DATABASE_URL

## Frontend
- Host: Vercel
- Env:
  - NEXT_PUBLIC_API_BASE = backend URL