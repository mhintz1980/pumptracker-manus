# Task Completion Checklist
1. Reinstall deps if package files changed (`pnpm install`).
2. Run static + unit checks: `pnpm lint`, `pnpm test`, `pnpm build` (ensures tsconfig + Vite build stay clean).
3. If UI flows shift, exercise Playwright (`pnpm test:e2e` or headed/ui variants) and review reports.
4. Manual QA: `pnpm dev`, open http://localhost:5173, verify deterministic catalog data (real models/customers) and, if needed, run `window.debugSeed()` in the browser console plus drag/drop pumps through stages.
5. Update docs/status notes when behavior, data sources, or verification steps change.