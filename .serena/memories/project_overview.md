# PumpTracker Lite Overview
- Purpose: single-page manufacturing ops dashboard + kanban that tracks pump-production orders end-to-end with deterministic catalog data.
- Stack: React 18 + TypeScript (Vite), Tailwind-based styling w/ custom layer classes, Zustand store w/ localStorage persistence, Recharts for visualization, dnd-kit for drag/drop, Sonner toasts, PapaParse CSV import, optional Supabase adapter, Lucide icons.
- Data model: deterministic seed (`src/lib/seed.ts`) backed by JSON catalog (`src/data/pumptracker-data.json`); cache key `pumptracker-lite-v2-catalog` prevents stale data.
- Structure highlights: `src/pages` (Dashboard, Kanban), `src/components/dashboard|kanban|toolbar|ui`, `src/lib` (formatting, CSV, theme), `src/store.ts` for global state, `src/adapters` (local + supabase), `src/assets` for shared visuals.
- Key docs: README (feature overview + architecture), PROJECT_CONTEXT + CURRENT_STATUS (migration notes), VERIFICATION_CHECKLIST (manual QA steps).