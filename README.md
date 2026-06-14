# Life OS

A private, single-user personal operating system for capturing thoughts, ideas, projects, goals, and life events — and understanding the patterns behind them.

## Stack

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite`)
- [Zustand](https://github.com/pmndrs/zustand) for state, persisted to `localStorage` — no backend, no database, no AI
- [React Router](https://reactrouter.com/) for navigation
- [Poppins](https://fontsource.org/fonts/poppins) (self-hosted via `@fontsource/poppins`)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for offline support and installability

## Data model

Everything you capture is a **Life Object** — an idea, project, goal, learning, decision, reflection, achievement, event, habit, or note. Objects move through a simple lifecycle (`new` → `active`/`paused` → `completed`/`cancelled`/`archived`), can be linked to one another with typed relationships, and every change is recorded in an activity history.

## Insights

A local analytics engine (`src/lib/analytics.ts`) computes completion rates, open loops, idea-to-project conversion, project success rate, most active topics, most productive days, and a "life momentum" score — all from pure functions over your local data. No external calls.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run lint     # lint the project
npm run preview  # preview the production build
```

## Data storage

All data lives in the browser's `localStorage` under the `life-os-storage` key. There is no server and no account — clearing your browser storage clears your data.
