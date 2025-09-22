# Repository Guidelines

## Project Structure & Module Organization
`server` contains the Hono-based API with business logic under `src/controllers`, route definitions in `src/routes`, and Drizzle schema/migrations in `src/db` and `drizzle/`. `web` is a Next.js 15 app; feature routes live inside `src/app/(auth|common)`, shared UI in `src/components`, utilities in `src/lib`, and providers in `src/providers`. Top-level `docker-compose.yml` wires the API, web app, and an Nginx proxy so the stack is reachable at http://localhost/.

## Build, Test, and Development Commands
Install dependencies per package with `pnpm install`. Useful scripts: `cd server && pnpm dev` (watch Hono server on 3001), `pnpm build && pnpm start` (compile to `dist` then run), `pnpm lint` (ESLint). Database helpers live under the same namespace: `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:seed`, and `pnpm db:studio`. For the UI run `cd web && pnpm dev` (Turbopack on 3000), `pnpm build && pnpm start`, and `pnpm lint`. Spin everything up together with `docker-compose up --build`.

## Coding Style & Naming Conventions
Write TypeScript with ES module imports and two-space indentation. Use `camelCase` for variables and functions, `PascalCase` for components and types, and colocate route-specific logic with its directory. Keep API handlers thin; delegate validation to Zod schemas under `server/src/utils` and share hooks/components from `web/src/lib` or `web/src/components`. Run linting before committing and extend rules in `web/eslint.config.mjs` or the server lint script when you introduce new patterns.

## Testing Guidelines
The repo lacks a formal test suite; add coverage with each feature. Favour request-level tests against Hono handlers (supertest or fetch) and React component tests with React Testing Library to lock down rendering and client hooks. If you add a test command, expose it in `package.json`, include it in CI scripts, and document manual QA steps in the PR when automated checks are absent.

## Commit & Pull Request Guidelines
Recent commits use narrative, sentence-style messages—often in Chinese—that enumerate the major changes across layers. Follow that model: keep each commit scoped, state the user-facing impact, and mention modified areas. Pull requests should include a summary, linked issue or task reference, verification notes (`pnpm lint`, `docker-compose up`), and screenshots or API samples whenever behaviour changes.

## Environment & Configuration Tips
Create `.env` files per package. The server expects `DATABASE_URL`, `JWT_SECRET`, optional `CORS_ORIGIN`, and OpenAI credentials for chat features. The web app reads `NEXT_PUBLIC_API_URL` plus the same OpenAI values; when using Docker, surface these variables via the compose file so Nginx can relay requests correctly.
