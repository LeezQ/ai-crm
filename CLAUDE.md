# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI CRM system with separate frontend (Next.js) and backend (Hono) services, containerized with Docker.

## Architecture

### Tech Stack
- **Frontend (`/web`)**: Next.js 15 with TypeScript, React 19, TanStack Query, Tailwind CSS, shadcn/ui components
- **Backend (`/server`)**: Hono framework with PostgreSQL, Drizzle ORM, JWT authentication
- **Infrastructure**: Docker Compose with Nginx reverse proxy

### Key Architectural Decisions
- **Client-only components**: All Next.js components must use `"use client"` directive - NO server components
- **API communication**: Frontend uses React Query for API requests via axios instance with interceptors
- **Authentication**: JWT-based with localStorage for token storage, automatic redirect on 401
- **Database**: PostgreSQL with Drizzle ORM, migrations managed via drizzle-kit

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
- Teams: `/api/teams/*` (CRUD, members management)
- Analytics: `/api/dashboard`, `/api/analytics/*`
- User: `/api/user/*` (profile, settings, password)
- AI Chat: `/api/ai/chat` (streaming responses)

### Frontend Routing
- Auth pages: `/(auth)/login`, `/(auth)/register`
- Main app: `/(common)/*` including dashboard, opportunities, teams, analytics, settings
- All pages use client-side rendering with React Query for data fetching

### Database Schema
Main entities in `server/src/db/schema.ts`:
- `users`: User accounts with authentication
- `opportunities`: Business opportunities with status tracking
- `teams`: Team management with member relationships
- `team_members`: Junction table for team membership
- `follow_ups`: Opportunity follow-up tracking

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

Backend (`.env`):
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing
- `CORS_ORIGIN`: Allowed origin for CORS
- `OPENAI_API_KEY`: OpenAI API key for AI features

## Port Configuration
- Frontend: 3000 (development), served via Nginx in production
- Backend: 3001
- Nginx: 80 (production)

## Database Workflow
1. Modify schema in `server/src/db/schema.ts`
2. Generate migration: `pnpm db:generate`
3. Apply migration: `pnpm db:migrate`
4. View database: `pnpm db:studio`