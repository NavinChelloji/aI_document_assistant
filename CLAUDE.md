# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a monorepo with two git submodules:

- `ai_document_assistant_client/` — React + TypeScript frontend (submodule, own git repo)
- `ai_document_assistant_server/` — FastAPI backend (submodule, own git repo)

Since each is an independent git repository, commit and push changes from *inside* the submodule directory, then update the parent repo's submodule pointer if needed. `git status` at the root only shows submodules as dirty/clean, not their internal diffs — `cd` into the submodule to see actual file changes.

The root also contains numbered design docs (`01_Project_Overview.md` … `18_Monitoring_Logging.md`) written during planning. Treat them as historical design intent, not a guaranteed description of current code — several modules described there (e.g. a unified `ai/rag/pipeline.py`, `ai/vector_db/vector_store.py`) exist only as empty placeholder files; the real implementation lives elsewhere (see Architecture below).

## Commands

### Frontend (`ai_document_assistant_client/`)

```bash
npm install
npm run dev        # Vite dev server (default port 5173)
npm run build       # tsc -b && vite build
npm run lint         # oxlint
npm run preview
```

There is no test runner configured in `package.json` and no test files in the client.

### Backend (`ai_document_assistant_server/`)

Use Python 3.10 specifically (newer versions may lack pre-built wheels for some deps — Render deploys pin this via `.python-version`).

```powershell
py -3.10 -m venv venv_310
.\venv_310\Scripts\activate
pip install -r requirements-prod.txt

python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 9000
```

API docs available at `http://127.0.0.1:9000/docs` once running.

Database migrations (Alembic, script location `app/database/migrations`):

```bash
alembic revision --autogenerate -m "message"
alembic upgrade head
```

There is no test suite in the backend (no `pytest`/`test_*` files exist).

### Environment variables

Backend reads from `ai_document_assistant_server/.env` (see `app/config/settings.py` for the full list). Key ones:

- `DATABASE_URL` — `postgresql+asyncpg://...`
- `JWT_SECRET`, `JWT_EXPIRE_MINUTES`, `REFRESH_TOKEN_EXPIRE_DAYS`
- `GROQ_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, `QDRANT_COLLECTION`, `B2_BUCKET_NAME`
- `FRONTEND_URL` — added to CORS allow-list in addition to the hardcoded `localhost:5173`

Frontend reads `VITE_API_URL` (defaults to `http://localhost:9000`), see `src/services/apiClient.ts`.

## Architecture

### Single-provider backend

The backend previously branched on a `settings.APP_ENV` flag to switch between local-only infrastructure (ChromaDB, Ollama, local disk) and hosted infrastructure (Qdrant, Groq, Backblaze B2). That local-only path has been removed — the backend now always runs against the hosted providers, in both local dev and prod:

| Concern | Provider |
|---|---|
| Vector DB | Qdrant (`app/ai/vector_db/qdrant.py`, `QDRANT_URL`) |
| LLM | Groq (`app/ai/llm/groq.py`, model `groq/llama-3.1-8b-instant`) |
| File storage | Backblaze B2 (`app/storage/b2_storage.py`, `B2_BUCKET_NAME`), fronted by the thin `app/storage/storage_service.py` wrapper |

Local development therefore requires real Groq/Qdrant/B2 credentials in `.env` — there's no fully-offline mode anymore.

Several files under `app/ai/` (`rag/pipeline.py`, `rag/retriever.py`, `vector_db/vector_store.py`, `models/llm_factory.py`, `background_jobs/embedding_generation.py`, `api/search/service.py`) are currently empty placeholders from the original scaffold — don't assume logic lives there without checking; grep for the actual call sites first.

### Document indexing flow (`app/background_jobs/document_indexing.py`)

1. Fetch the file (downloaded from B2 to a temp path).
2. Extract text (`document_processing/parser/pdf_parser.py` for PDFs; plain read for text files) and chunk it (`app/ai/rag/chunker.py`, page-aware via `chunk_pages`).
3. Embed chunks (`app/ai/embeddings/embedding_service.py`) in batches of `EMBED_BATCH_SIZE` (20) with exponential-backoff retry on transient errors (504/503/429) — this batching exists specifically to avoid Google's embedding API 60s deadline.
4. Store embeddings + metadata (`workspace_id`, `document_id`, `file_name`, `page_number`) in Qdrant, keyed by workspace so retrieval can filter per-workspace.
5. Update the `Document.upload_status` field (`processed`/`failed`) via a fresh DB session.

### Chat / RAG flow (`app/api/chat/service.py::append_message_to_session`)

1. Embed the user's question.
2. Similarity-search the workspace's vector store (Qdrant, filtered by `workspace_id`) for top-3 chunks.
3. Build an augmented prompt with retrieved context, call the LLM (Groq).
4. Persist the turn as a `ChatMessage` with `question`, `answer`, `citations` (JSON), `model`, `response_time_ms`.

### Backend request layout

Each domain under `app/api/<domain>/` follows the same file split: `routes.py` (FastAPI router) → `controller.py`/`service.py` (business logic) → `repository.py` (DB queries) → `model.py` (SQLAlchemy ORM, where domain-specific) → `schema.py` (Pydantic I/O). Shared DB models actually live in `app/database/models/`; per-domain `model.py` files are mostly thin re-exports or not used consistently — check `app/database/models/` first when looking for a table definition.

All responses use the `StandardResponse` envelope (`app/utils/response.py`): `{"success": bool, "message": str, "data": ...}`. Exceptions are normalized to this shape by handlers registered in `app/main.py` (`HTTPException`, `RequestValidationError`, and a catch-all).

Auth is cookie-based JWT: `POST /api/auth/login` sets `access_token`/`refresh_token` as `HttpOnly` cookies (see `app/api/auth/routes.py`), not a bearer token returned in the response body. The frontend's `apiClient` relies on `withCredentials: true` rather than attaching an `Authorization` header.

### Frontend structure

Feature-first under `src/features/<feature>/{pages,components,services}`, with cross-cutting concerns in `src/store/` (Zustand, one store per domain — `auth.store.ts`, `chat.store.ts`, `document.store.ts`, `workspace.store.ts`), `src/ui/` (generic design-system components, unrelated to any one feature), and `src/routes/AppRoutes.tsx` (all route definitions, gated by `PrivateRoute`).

`src/services/apiClient.ts` is the real Axios instance (`src/services/axios.ts` is an empty leftover file — don't add logic there). The response interceptor unwraps the backend's `StandardResponse` envelope, so feature service functions should treat responses as already being just the `data` payload, not the full envelope.

Path alias `@` → `/src` is configured in `vite.config.ts`.
