# DevLog

A public dev journal and community hub for developers. Log your daily coding progress, share code snippets, track your streak, and follow other developers.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, CSS |
| Backend | Python, FastAPI |
| Database | SQLite (dev) → PostgreSQL (prod) |
| Auth | JWT + GitHub OAuth |
| Deploy | Vercel (frontend) + Render (backend) |

## Project Structure

```
devlog/
├── frontend/         # React app
│   └── src/
│       ├── components/
│       │   ├── auth/       # Login, Register forms
│       │   ├── layout/     # Navbar, Sidebar
│       │   ├── logs/       # Log editor, Log card
│       │   ├── feed/       # Community feed
│       │   └── profile/    # User profile, streak
│       ├── pages/          # Route-level pages
│       ├── hooks/          # Custom React hooks
│       ├── api/            # API call functions
│       ├── utils/          # Helper functions
│       └── styles/         # Global CSS
└── backend/          # FastAPI app
    └── app/
        ├── routers/        # API route handlers
        ├── models/         # Database models
        ├── schemas/        # Pydantic schemas
        └── utils/          # Auth helpers, etc.
```

## Getting Started

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Roadmap

- [x] Step 1 — Project structure & GitHub setup
- [ ] Step 2 — Auth (register, login, JWT)
- [ ] Step 3 — Log entries (CRUD + code snippets)
- [ ] Step 4 — Streak tracker
- [ ] Step 5 — Social layer (follow, feed, tags)
- [ ] Step 6 — Polish & deploy
