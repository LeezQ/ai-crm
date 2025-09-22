# AI CRM Enhancement Plan

## Current Gaps
- **Inconsistent data contracts**: frontend expects `expectedAmount`, `status` update endpoints, and analytics fields that are missing on the backend schema/routes.
- **Hard-coded AI credentials**: both web and server ship a leaked key and do not read from environment variables.
- **AI usage limited to free-form chat**: no domain knowledge of CRM data, no automation hooks, no structured AI workflows.
- **Missing voice features**: no API or storage model for audio uploads or AI generated summaries.
- **Team context leaks**: dashboard/query flows ignore the active team because middleware never surfaces `teamId`.

## Target Capabilities
1. **AI Data Insights (“AI 问数”)**
   - Natural language questions compiled into structured metrics (counts, sums, trend snapshots) scoped by user/team.
   - Hybrid pipeline: LLM plans → server executes Drizzle queries → LLM formats concise answer with cited numbers.
2. **AI Assisted Records (“自动化添加”)**
   - Free-form text or transcripts extracted into opportunity/follow-up payloads via schema-guided generation.
   - Optional auto-linking to existing opportunities based on similarity.
3. **Voice Notes with AI Summaries**
   - Upload `.mp3/.wav/.m4a` to per-team storage, transcribe via Whisper (or compatible) and summarize.
   - Persist transcript + summary, expose attachments on opportunity detail page, allow generate follow-up from summary.
4. **Operational Hardening**
   - Align DB schema + APIs with UI, add migrations, seed data, and validation.
   - Replace leaked secrets with env vars, centralise OpenAI client, add error monitoring & rate limiting stubs.

## Phased Execution
1. **Stabilisation**
   - Add missing columns (`expected_amount`, `next_follow_up_at`, etc.) and fix routes (`PUT /status`, pagination filters).
   - Refactor auth middleware to expose `teamId` and enforce team scoping throughout analytics/opportunity queries.
   - Introduce shared AI client module sourcing credentials from env and update `.env.example`.
2. **AI Foundations**
   - Implement `/api/ai/insights` pipeline: prompt guardrails, Zod schema for intents (`count`, `sum`, `trend`), query builders, response formatter.
   - Add caching for frequent metrics (day/hour buckets) to reduce LLM invocations.
3. **Automation Workflows**
   - Endpoint `/api/ai/opportunities/assist` that takes `input` text → `generateObject` to structured data → validate with Zod → create/update records.
   - Extend follow-up creation to accept AI drafted notes, enabling “generate follow-up from transcript” reuse.
4. **Voice Intelligence**
   - Storage: new `voice_notes` table + disk storage under `/var/data/voice-notes` (configurable).
   - API: multipart upload, background job runner (lightweight queue with status polling) to call transcription + summarisation.
   - Frontend: uploader on opportunity drawer/detail, transcript viewer, “create follow-up from summary” button.
5. **Polish & Release Readiness**
   - Automated tests (unit for insight parser, integration for AI assistants with mocked LLM).
   - UX refinements: loading states, error toasts, analytics dashboard cards for latest voice insights.
   - Documentation updates: setup guides, .env references, Docker Compose wiring with volume mounts.

## Tooling & Infra Considerations
- **Background Tasks**: start with in-request processing; later abstract to simple queue (BullMQ or custom worker) if needed.
- **Cost Controls**: central rate limit + token usage logging table for audit.
- **Model Flexibility**: allow `AI_MODEL` config for chat vs insight vs transcription; default to OpenAI `gpt-4o-mini` / `gpt-4o-mini-transcribe`.

## Immediate Next Actions
1. Create shared `aiClient` utility (server + web) and remove hard-coded keys.
2. Draft DB migration for opportunity monetary fields and voice notes table.
3. Implement `/api/ai/insights` MVP with two intents (count, sum) and front-end query UI (dashboard tile).
4. Build voice upload API skeleton with stubbed summariser to unblock frontend integration.
