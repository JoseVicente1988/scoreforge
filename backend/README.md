# Scoreforge SaaS (Backend)

FastAPI + SQLAlchemy (PostgreSQL/Neon) backend for a multi-tenant scoreboard SaaS.

## Features (MVP)
- User register/login (JWT access token)
- Projects per user
- API Keys per project (shown ONCE on creation; stored hashed)
- Score submission with API Key (X-API-Key)
- Public leaderboard per project
- Swagger docs at `/docs` with:
  - Bearer auth (JWT) for owner endpoints
  - API Key auth for score submission

## Setup (Windows PowerShell)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env and set DATABASE_URL + JWT_SECRET
python -m uvicorn app.main:app --reload
```

Open:
- http://127.0.0.1:8000/docs


## Note (API Keys)
This MVP enforces **one API key per project**. If you previously generated multiple keys, you may need to drop and recreate the `api_keys` table during development:

```sql
DROP TABLE IF EXISTS api_keys CASCADE;
```
