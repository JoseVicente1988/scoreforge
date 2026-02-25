# Scoreforge API

Base URL (local):
- `http://127.0.0.1:8000`

> Tip: You can also use the interactive Swagger UI at `/docs`.

---

## Authentication

Scoreforge uses **two** auth mechanisms:

### 1) JWT (Dashboard users)
Used for:
- Create projects
- Generate API keys
- List your projects

Header:
```
Authorization: Bearer <JWT>
```

### 2) API Key (Game clients)
Used for:
- Submit scores
- Read leaderboards (public)

Header:
```
X-API-Key: <PROJECT_API_KEY>
```

API keys are returned **once** at creation time. The server stores only a **hash**.

---

## Endpoints (MVP)

### Health
`GET /health`

Response:
```json
{ "status": "ok" }
```

---

## Auth

### Register
`POST /auth/register`

Body:
```json
{
  "username": "test",
  "email": "test@example.com",
  "password": "MyStrongPassword123!"
}
```

### Login
`POST /auth/login`

Body:
```json
{
  "username": "test",
  "password": "MyStrongPassword123!"
}
```

Response:
```json
{
  "access_token": "<JWT>",
  "token_type": "bearer"
}
```

---

## Projects (JWT required)

### List projects
`GET /projects`

### Create project
`POST /projects`

Header:
```
Authorization: Bearer <JWT>
```

Body:
```json
{ "name": "MyGame - Production" }
```

---

## API keys (JWT required)

### Create API key for a project (shown once)
`POST /projects/{project_id}/keys`

Header:
```
Authorization: Bearer <JWT>
```

Response:
```json
{
  "api_key": "sf_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "project_id": 1
}
```

---

## Scores

### Submit score (API key required)
`POST /scores/submit`

Header:
```
X-API-Key: <PROJECT_API_KEY>
```

Body:
```json
{
  "project_id": 1,
  "player_name": "Jefe",
  "score": 12345
}
```

### Get leaderboard (public)
`GET /scores/leaderboard/{project_id}?limit=10`

Response:
```json
[
  { "player_name": "Jefe", "score": 12345, "created_at": "2026-02-25T10:10:10Z" }
]
```
