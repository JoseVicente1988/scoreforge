# Scoreforge Architecture

Scoreforge is a multi-tenant leaderboard SaaS.

---

## Components

- **Frontend (Next.js)**: dashboard UI for developers (register/login, projects, keys)
- **Backend (FastAPI)**: REST API + authentication + score logic
- **Database (PostgreSQL / Neon)**: persistent storage

---

## Tenant model

A **Project** is the tenant boundary:
- each project owns its leaderboard data
- game clients authenticate using an **API key per project**

---

## Auth model

### A) Dashboard users (JWT)
Flow:
1. Register/login
2. Receive a JWT
3. Use JWT to manage projects and keys

### B) Game clients (API key)
Flow:
1. Developer creates a project and receives an API key (shown once)
2. Game sends `X-API-Key` to submit scores
3. Game fetches leaderboard (no JWT required)

---

## Security decisions

- Passwords are stored **hashed** (bcrypt via passlib)
- JWT is signed with `JWT_SECRET`
- API keys are stored **hashed** (only the hash is stored)
- CORS is restricted to the configured frontend origins (local: `http://localhost:3000`)

---

## Where to look in code

Backend:
- `app/api/routes/auth.py` – register/login
- `app/api/routes/projects.py` – projects and keys
- `app/api/routes/scores.py` – submit/leaderboard
- `app/core/security.py` – hashing + JWT helpers
- `app/db/` – SQLAlchemy session and models
