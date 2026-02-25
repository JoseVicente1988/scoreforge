## Status
MVP functional (local) – Production-ready improvements in progress.

# Scoreforge

Scoreforge is a multi-tenant leaderboard SaaS for games.  
It provides a simple dashboard for developers to create projects and generate API keys, and a clean API that game clients (e.g., Godot) can use to submit scores and fetch leaderboards.

## Tech Stack
- Backend: FastAPI, SQLAlchemy, PostgreSQL (Neon), JWT
- Frontend: React / Next.js
- Client: Godot 4.x (HTTP-based)

## Core Concepts
- **JWT** is used for dashboard users (register/login, create projects, generate keys).
- **API keys** are used by game clients to submit scores.
- Each **project has a stable API key** (not regenerated unless explicitly requested).

## Quick Start (Local)

### Backend (Windows)
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -m uvicorn app.main:app --reload
