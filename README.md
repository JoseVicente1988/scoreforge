# Scoreforge

## Status
MVP functional (local). Docker and deployment hardening in progress.

Scoreforge is a multi-tenant leaderboard SaaS for games.
It provides a dashboard to create projects and generate API keys, and an API that game clients can use to submit scores and retrieve leaderboards.

---

## Features
- JWT authentication for dashboard users
- Stable per-project API keys (stored hashed; shown once)
- Score submission via `X-API-Key`
- Leaderboard retrieval endpoint
- Swagger docs (`/docs`)

---

## Tech Stack
**Backend:** FastAPI, SQLAlchemy, PostgreSQL (Neon), JWT  
**Frontend:** React / Next.js

---


## 🖥 Screenshots

<img width="1920" height="1080" alt="Screenshoot3" src="https://github.com/user-attachments/assets/62d7a6b5-4e32-4411-bc98-0c3f2879cafe" />
<img width="1920" height="1080" alt="Screenshoot2" src="https://github.com/user-attachments/assets/d6724f48-e0cb-4162-94cf-a6f6511048e1" />
<img width="1920" height="1080" alt="Screenshoot1" src="https://github.com/user-attachments/assets/723b8c7c-299f-4ce1-8fc3-5dbb8e2eb613" />

---

## Quick Start (Local)

### Backend (Windows)
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -m uvicorn app.main:app --reload
