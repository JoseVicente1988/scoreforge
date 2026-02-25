# Scoreforge Architecture

Scoreforge is a multi-tenant leaderboard SaaS.

## Flow

1) User registers and logs in -> receives JWT
2) User creates a Project
3) User generates an API key for that project (shown once)
4) Game client uses X-API-Key to submit scores and fetch leaderboard

## Security

- Passwords are hashed (bcrypt)
- JWT is signed with a server secret
- API keys are stored hashed and never stored in plaintext

## Data Model

- User
- Project (belongs to User)
- ApiKey (one per Project)
- Score (belongs to Project)