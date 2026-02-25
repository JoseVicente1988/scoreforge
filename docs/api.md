# Scoreforge API

## Base URL
Local:
- http://127.0.0.1:8000

## Auth types

### JWT (for dashboard users)
Used for:
- Create projects
- Generate API keys

Header:
Authorization: Bearer <JWT_TOKEN>

### API Key (for game clients)
Used for:
- Submit scores

Header:
X-API-Key: <PROJECT_API_KEY>

---

## Endpoints

### Register
POST /auth/register
Body (JSON):
{
  "email": "user@example.com",
  "password": "securepassword"
}

### Login
POST /auth/login
Body (form-data):
username=user@example.com
password=securepassword

Response:
{
  "access_token": "JWT_TOKEN",
  "token_type": "bearer"
}

### Create project (JWT)
POST /projects
Header:
Authorization: Bearer <JWT_TOKEN>

Body:
{
  "name": "My Game"
}

### Generate API key (JWT)
POST /projects/{project_id}/api-key
Header:
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "api_key": "KEY_SHOWN_ONCE"
}

### Submit score (API key)
POST /scores/submit
Headers:
X-API-Key: <PROJECT_API_KEY>
Content-Type: application/json

Body:
{
  "project_id": 1,
  "username": "Player1",
  "value": 120
}

### Get leaderboard
GET /scores/leaderboard/{project_id}?limit=10