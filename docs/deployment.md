# Deployment

This is a practical, minimal guide to deploy Scoreforge.

---

## 1) Database (Neon)

1. Create a Neon project (PostgreSQL)
2. Copy the connection string
3. Set it as `DATABASE_URL` in your backend host

> Important: production should use migrations (Alembic), not `create_all`.

---

## 2) Backend (Render / Fly.io / Railway)

### Required env vars
- `DATABASE_URL` (Neon)
- `JWT_SECRET` (long random)
- `JWT_EXPIRES_MINUTES` (e.g. 60)
- `CORS_ORIGINS` (comma-separated list, e.g. your Vercel domain)

### Start command (typical)
```
uvicorn app.main:app --host 0.0.0.0 --port 10000
```

---

## 3) Frontend (Vercel)

### Required env vars
- `NEXT_PUBLIC_API_BASE` = your backend URL

Vercel will build and serve the Next.js app automatically.

---

## 4) Docker (local)

For local development, you can run everything with:
```
docker compose up --build
```

This will start:
- Postgres
- FastAPI backend
- Next.js frontend
