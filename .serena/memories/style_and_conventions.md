# Code Style & Conventions
- TypeScript is strict (`strict`, `noUnused*`, `noUncheckedSideEffectImports`); components are typed `React.FC` or typed props objects.
- UI uses Tailwind utility classes w/ custom tokens (`layer-l1`, `text-muted-foreground`, chart accent vars). Prefer composing w/ shared UI primitives (`Card`, `Button`, `Input`, `Badge`, `Table`).
- Zustand store (`useApp`) supplies filters, adapters, collapse state; components consume selectors vs prop drilling.
- Charts lean on Recharts with memoized data builders, custom tooltips; keep chart components pure + responsive via `ResponsiveContainer`.
- Kanban uses dnd-kit; `PumpCard` collapsible details; respect stage accent palette defined in `StageColumn`.
- Filtering handled through `FilterBar` with rounded selects + `clear` badge; keep new filters consistent (rounded pill selects, text-xs labels).
- Data formatting centralized in `src/lib/format` (use helpers like `formatDate`, `round`).
- Toast notifications via Sonner (`toast.success/error`).
- Keep deterministic data/business logic in `lib/seed.ts` & store actions; UI components should stay presentational.