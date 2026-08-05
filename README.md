# caddie [in progress...]

An AI golf assistant. Users ask questions about their game and get coaching advice back.

## Architecture

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

The client talks to the FastAPI backend over HTTP. The backend calls an LLM through OpenRouter to generate responses, using PostgreSQL to store conversations and Redis to cache the active conversation context. pgvector handles embedding storage and similarity search for retrieval.

## Planned stages

1. **Chat** — conversational interface over an LLM
2. **Retrieval** — RAG over a coaching corpus, so answers use curated material instead of the model's own training data
3. **Vision** — swing analysis from uploaded video, using pose estimation in the browser

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
├── server/   # FastAPI backend
└── client/   # React frontend
```

## Setup

```bash
# server
cd server
uv sync
uv run fastapi dev main.py

# client
cd client
npm install
npm run dev
```

## License

MIT
