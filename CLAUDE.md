# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-augmented CRM system with natural language insights, automated opportunity drafting, and voice note transcription. Separate frontend (Next.js) and backend (Hono) services, containerized with Docker.

## Architecture

### Tech Stack
- **Frontend (`/web`)**: Next.js 15 with TypeScript, React 19, TanStack Query, Tailwind CSS, shadcn/ui components
- **Backend (`/server`)**: Hono framework with PostgreSQL, Drizzle ORM, JWT authentication, OpenAI integration
- **Infrastructure**: Docker Compose with Nginx reverse proxy

### Key Architectural Decisions
- **Client-only components**: All Next.js components must use `"use client"` directive - NO server components
- **API communication**: Frontend uses React Query for API requests via axios instance with interceptors
- **Authentication**: JWT-based with localStorage for token storage, automatic redirect on 401
- **Database**: PostgreSQL with Drizzle ORM, migrations managed via drizzle-kit
- **AI Integration**: OpenAI SDK for chat, insights, voice transcription, and opportunity automation

## Development Commands

### Frontend (`/web`)
```bash
pnpm dev        # Start dev server with Turbopack on port 3000
pnpm build      # Build production bundle
pnpm lint       # Run ESLint
```

### Backend (`/server`)
```bash
pnpm dev        # Start dev server with tsx watch on port 3001
pnpm build      # Compile TypeScript
pnpm lint       # Run ESLint
pnpm db:generate # Generate SQL migrations from schema changes
pnpm db:migrate # Run database migrations
pnpm db:studio  # Open Drizzle Studio for database management
pnpm db:seed    # Seed database with initial data
```

### Docker
```bash
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
```

## Project Structure

### API Routes Pattern
- Authentication: `/api/auth/*` (login, register, profile)
- Opportunities: `/api/opportunities/*` (CRUD, follow-ups, status updates)
- Voice Notes: `/api/opportunities/:id/voice-notes` (upload, transcribe, list)
- Teams: `/api/teams/*` (CRUD, members management)
- Analytics: `/api/dashboard`, `/api/analytics/*`
- User: `/api/user/*` (profile, settings, password)
- AI Features:
  - `/api/ai/chat` - Streaming chat responses
  - `/api/ai/insights` - Natural language CRM data queries ("AI 问数")
  - `/api/ai/opportunities/assist` - Auto-fill opportunity fields from text

### Frontend Routing
- Auth pages: `/(auth)/login`, `/(auth)/register`
- Main app: `/(common)/*` including dashboard, opportunities, teams, analytics, settings
- All pages use client-side rendering with React Query for data fetching

### Database Schema
Main entities in `server/src/db/schema.ts`:
- `users`: User accounts with authentication
- `opportunities`: Business opportunities with status tracking, expected amounts, follow-up scheduling
- `teams`: Team management with member relationships
- `team_members`: Junction table for team membership
- `follow_ups`: Opportunity follow-up tracking
- `voice_notes`: Audio recordings with transcriptions and AI-generated summaries

## Development Guidelines

### API Request Pattern
All API requests go through `web/src/lib/api.ts` which handles:
- Token attachment from localStorage
- Team ID header injection
- Automatic 401 handling with redirect to login
- Error transformation to custom error classes

### Component Development
- Always use `"use client"` directive in components
- Use React Query hooks for data fetching
- Follow existing shadcn/ui component patterns
- Maintain TypeScript strict mode compatibility

### Authentication Flow
1. Token stored in localStorage after login
2. Token automatically attached to requests via axios interceptor
3. Backend validates JWT on all protected routes except `/api/auth/login` and `/api/auth/register`
4. Team context passed via `teamId` header

## Environment Variables

Frontend (`.env.local`):
- `NEXT_PUBLIC_API_URL`: API base URL (defaults to proxy)
- `API_SERVER_ORIGIN`: Backend origin for Docker deployments

Backend (`.env`):
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing
- `CORS_ORIGIN`: Allowed origin for CORS
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `OPENAI_BASE_URL`: Optional custom OpenAI endpoint
- `OPENAI_CHAT_MODEL`: Model for chat (default: gpt-4o-mini)
- `OPENAI_INSIGHT_MODEL`: Model for insights (default: gpt-4o-mini)
- `OPENAI_TRANSCRIBE_MODEL`: Model for transcription
- `VOICE_NOTES_DIR`: Directory for voice note storage (default: ./storage/voice-notes)

## Port Configuration
- Frontend: 3000 (development), served via Nginx in production
- Backend: 3001
- Nginx: 80 (production)

## Database Workflow
1. Modify schema in `server/src/db/schema.ts`
2. Generate migration: `pnpm db:generate`
3. Apply migration: `pnpm db:migrate`
4. View database: `pnpm db:studio`

## AI Features

### Natural Language Insights ("AI 问数")
Query CRM data using natural language at `/api/ai/insights`. The system interprets questions, generates structured queries, and returns summarized results with actionable insights.

### Opportunity Auto-Fill
Convert unstructured text into structured opportunity data at `/api/ai/opportunities/assist`. Paste raw descriptions to automatically extract company info, contacts, and deal parameters.

### Voice Note Processing
Upload audio recordings to `/api/opportunities/:id/voice-notes` for:
- Automatic transcription using OpenAI Whisper
- AI-generated summaries with action items
- Extraction of follow-up tasks and sentiment analysis
- 以后服务什么的不需要你启动，我都是自己会启动的