# Paste-Life

## Overview

Paste-Life is a minimal Pastebin-style code sharing application with a static React frontend and Supabase backend. Users can create, view, and share code snippets with syntax highlighting, privacy controls, and expiration options. The application requires no login system - paste management is handled via secret tokens.

**Implementation Status: ✅ COMPLETE**

All core features are implemented and ready for deployment. The application requires Supabase database setup (see DATABASE_SETUP.md) before use.

**Core Features:**
- ✅ Create pastes with optional titles, language selection, and expiration times
- ✅ Three privacy levels: public, unlisted, and private
- ✅ Syntax highlighting for 17+ programming languages
- ✅ Secret token-based authentication for edit/delete operations
- ✅ View counters, raw text endpoints, and embeddable views
- ✅ Rate limiting (5 pastes per minute per IP)
- ✅ Dark mode support
- ✅ GitHub Actions deployment workflow

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as build tool and dev server
- Wouter for client-side routing
- TanStack Query for data fetching and caching
- Tailwind CSS for styling
- shadcn/ui component library (Radix UI primitives)
- Prism.js for syntax highlighting

**Design Philosophy:**
The frontend is designed as a static SPA suitable for GitHub Pages deployment. It follows a developer-focused minimal design system inspired by GitHub Gist, Linear, and VS Code. The UI uses JetBrains Mono for code display and Inter/System UI for interface elements.

**Key Architectural Decisions:**
- **Static Deployment:** The entire frontend can be deployed to GitHub Pages with no server-side rendering required
- **Client-Side Routing:** Wouter provides lightweight routing without the overhead of React Router
- **Component Library:** shadcn/ui provides accessible, customizable components without runtime dependencies
- **State Management:** TanStack Query handles server state, eliminating need for Redux/Zustand
- **Styling Approach:** Tailwind with custom CSS variables for theming, supporting light/dark modes

### Backend Architecture

**Dual Backend Strategy:**
The application supports two backend configurations:

1. **Development:** Express.js server with Vite middleware for hot module replacement
2. **Production:** Supabase Edge Functions for serverless deployment

**Express Server (Development):**
- Serves API endpoints at `/api/*`
- Handles paste CRUD operations
- Implements in-memory rate limiting (5 requests per minute per IP)
- Uses Supabase Admin SDK with service role key for privileged operations
- Vite dev server integration for seamless HMR during development

**Key Backend Responsibilities:**
- **Create Paste:** Generate unique slugs and secret tokens, validate input, enforce rate limits
- **View Paste:** Serve pastes based on privacy level, increment view counter, check expiration
- **Edit/Delete Paste:** Verify secret tokens server-side before allowing mutations
- **Raw & Embed:** Provide plain text and embeddable HTML endpoints

**Security Model:**
- Frontend uses Supabase anon key (limited to public/unlisted reads and paste creation)
- Backend uses service role key for private paste access, edits, deletes, and view increments
- Secret tokens are never exposed in frontend code - always verified server-side
- Row Level Security (RLS) policies prevent unauthorized direct database access

### Database Architecture

**Platform:** Supabase (PostgreSQL with Row Level Security)

**Schema:**
```sql
pastes (
  id: uuid (primary key),
  slug: text (unique, indexed),
  title: text (nullable),
  content: text (required),
  language: text (nullable),
  privacy: text (public/unlisted/private),
  secret_token: text (required for mutations),
  created_at: timestamptz,
  expires_at: timestamptz (nullable),
  views: int (default 0)
)
```

**Indexes:**
- Primary index on `id`
- Unique index on `slug` for fast lookups
- Index on `created_at` for sorting
- Full-text search index (GIN) on title + content

**Row Level Security Policies:**
- SELECT: Allow public and unlisted pastes to anyone
- INSERT: Allow anyone to create pastes
- UPDATE/DELETE: Must go through backend API with token verification

**Design Rationale:**
- Simple single-table schema reduces complexity
- Slug-based URLs are human-readable and shareable
- Expiration handled at query time (not background jobs)
- Full-text search enables future search feature
- RLS provides defense-in-depth security layer

### Rate Limiting & Abuse Prevention

**Current Implementation:**
- In-memory rate limiting (5 pastes per minute per IP)
- Rate limit map stored in Express server memory
- Sliding window algorithm with automatic cleanup

**Future Extensibility:**
The codebase includes comments about CAPTCHA integration points for enhanced abuse prevention.

## External Dependencies

### Third-Party Services

**Supabase:**
- Managed PostgreSQL database with Row Level Security
- Authentication SDK (though auth features are not currently used)
- Service role and anon API keys for different privilege levels
- Real-time subscriptions (available but not currently used)

**Required Environment Variables:**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Public anon key for frontend (limited RLS permissions)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for backend (bypasses RLS)

### NPM Dependencies

**Core Framework:**
- `react` & `react-dom` - UI framework
- `vite` - Build tool and dev server
- `typescript` - Type safety
- `express` - Backend server framework

**Database & API:**
- `@supabase/supabase-js` - Supabase client SDK
- `drizzle-orm` - Type-safe ORM (configured but schema uses Supabase directly)
- `@neondatabase/serverless` - Postgres driver for Drizzle

**UI Components:**
- `@radix-ui/*` - Unstyled accessible component primitives (18+ packages)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` & `clsx` - Conditional className utilities
- `lucide-react` - Icon library

**Data Fetching & Forms:**
- `@tanstack/react-query` - Server state management
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Form validation
- `zod` - Schema validation

**Code Display:**
- `prismjs` - Syntax highlighting with 17+ language grammars

**Utilities:**
- `nanoid` - Unique ID generation for slugs and tokens
- `date-fns` - Date manipulation
- `wouter` - Lightweight routing

**Development:**
- `tsx` - TypeScript execution for dev server
- `esbuild` - Production bundling
- `@replit/*` plugins - Replit-specific dev tools

### Deployment Targets

**Frontend:**
- GitHub Pages (static files)
- Any static hosting service (Netlify, Vercel, Cloudflare Pages)

**Backend:**
- Supabase Edge Functions (production)
- Express server on any Node.js host (alternative)
- Replit (current development environment)