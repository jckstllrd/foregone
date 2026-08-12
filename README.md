# caddie [in progress...]

An AI golf assistant. Users ask questions about their game and get coaching advice back.

## Planned Architecture

```
React / TypeScript client
          │
          ▼
     FastAPI backend
          │
    ┌─────┴─────┐
    ▼           ▼
PostgreSQL    Redis
 + pgvector  (conversation cache)
```

The frontend talks to the FastAPI backend over HTTP. The backend calls an LLM through OpenRouter to generate responses, using PostgreSQL to store conversations and Redis to cache the active conversation context. pgvector handles embedding storage and similarity search for retrieval.

## Planned stages

1. **Chat** — conversational interface over an LLM
2. **Retrieval** — RAG over golf coaching resources, so answers use curated material instead of solely the model's own training data
3. **Vision** — swing analysis from live video, using pose estimation in the browser

## Stack

| Layer    | Technology              |
| -------- | ----------------------- |
| Frontend | React, TypeScript, Vite |
| Backend  | Python, FastAPI         |
| Database | PostgreSQL, pgvector    |
| Cache    | Redis                   |
| Models   | OpenRouter              |

## Structure

```
caddie/
├── backend/   # FastAPI backend
└── frontend/   # React frontend
```

## Setup

```bash
# backend
cd backend
uv sync
uv run fastapi dev

# frontend
cd frontend
npm install
npm run dev
```
