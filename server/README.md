# AI CRM Server

Node.js backend for the AI CRM project. It exposes a Hono-based HTTP API, persists data through Drizzle ORM, and integrates with the OpenAI SDK for assistant features such as automated follow-ups and opportunity scoring.

## Prerequisites
- Node.js 18 or newer
- pnpm (recommended) or npm/yarn for installing dependencies
- PostgreSQL instance reachable via `DATABASE_URL`
- OpenAI-compatible API key for AI chat, insights, and transcription features

## Getting Started
1. Copy the environment template and adjust values:
   ```bash
   cp .env.example .env
   ```
   Set `DATABASE_URL`, `JWT_SECRET`, and `CORS_ORIGIN` as needed.
   Configure AI credentials via `OPENAI_API_KEY` (and optional `OPENAI_BASE_URL`, `OPENAI_*_MODEL`).
   Define `VOICE_NOTES_DIR` to persist uploaded audio files (defaults to `./storage/voice-notes`).
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Apply database migrations:
   ```bash
   pnpm db:migrate
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```
   The API will be available on `http://localhost:3001` (configurable in `src/index.ts`).

## Database Workflow
- Update Drizzle schema files under `src/db/schema/` as needed.
- Generate SQL migrations:
  ```bash
  pnpm db:generate
  ```
- Apply migrations:
  ```bash
  pnpm db:migrate
  ```
- Seed reference data:
  ```bash
  pnpm db:seed
  ```

## Available Scripts
- `pnpm dev` – run the server with live reload via `tsx`
- `pnpm build` – compile TypeScript and rewrite path aliases before deployment
- `pnpm start` – run the compiled build from `dist/`
- `pnpm lint` – lint the project with ESLint
- `pnpm db:studio` – open Drizzle Studio for inspecting the database

## AI & Voice Features
- `/api/ai/insights` answers natural-language questions about CRM data (“AI 问数”) by compiling structured queries and summarising results.
- `/api/ai/opportunities/assist` converts自由描述 into structured fields for fast record creation or follow-up drafting.
- `/api/opportunities/:id/voice-notes` accepts audio uploads, transcribes with OpenAI Whisper-compatible models, and stores AI summaries with action items.

## Docker
This service is also defined in the repository root `docker-compose.yml`. Start the full stack (Nginx + web + server) with:
```bash
docker compose up --build
```
The server container uses the same scripts and expects environment variables to be provided via Docker compose or `.env` files.
