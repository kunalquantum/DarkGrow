# Life OS

A private personal operating system for capturing thoughts, ideas, projects,
goals, learnings, decisions, and life events - all as **Life Objects**.

Built for a single user with Next.js, TypeScript, Tailwind CSS, shadcn/ui,
Framer Motion and Supabase. Installable as a PWA.

## Getting Started

### 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the migration in `supabase/migrations/0001_init.sql`.
   This creates the `life_objects`, `life_object_relationships`,
   `activity_history` and `daily_reflections` tables with row-level security
   scoped to the authenticated user.
3. Copy `.env.example` to `.env.local` and fill in your project URL and anon key:

   ```bash
   cp .env.example .env.local
   ```

### 2. Install dependencies & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first time you visit,
create your account from the login screen (sign up once - this app is designed
for a single user).

## App structure

- **Home** - Quick Capture, Open Loops, Recent Activity, Daily Reflection.
- **Timeline** - infinite-scrolling life history grouped by month.
- **Insights** - analytics computed locally (completion rate, idea conversion,
  project success rate, most active topics, life momentum, etc.) - no AI/LLM calls.
- **Search** - fast search across titles, descriptions, notes, tags, types and statuses.
- **Object detail** (`/object/[id]`) - edit any Life Object, manage connections
  to other Life Objects, and view its full activity history.

## Core data model

Everything is a **Life Object**: idea, project, goal, learning, decision,
reflection, achievement, event, habit, or note. Life Objects can be linked
together via relationships (`related_to`, `created_from`, `supports`,
`depends_on`, `inspired_by`, `resulted_in`), and every change is recorded in
an activity history so nothing is lost.

## PWA

The app ships with a manifest, app icons, and a service worker
(`public/sw.js`) for offline caching - install it to your home screen for a
native-app feel.

## Deploy

Deploy on [Vercel](https://vercel.com/new) and set the same environment
variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the
project settings.
