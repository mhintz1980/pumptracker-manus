# Playwright Follow-Ups (2025-01-13)
- `tests/e2e/scheduling.spec.ts`: target sidebar cards explicitly instead of generic `[data-pump-id]` so assertions grab the right element (calendar events share that attribute but lack `data-scheduled-state`).
- `tests/e2e/helpers/test-utils.ts`: stop anchoring locators on `w-[300px]`; use `[data-testid]` hooks for the scheduling sidebar, cards, and calendar.
- `Assertions.expectJobToBeMoved`: current assumption that jobs disappear from the sidebar is wrong—needs to verify scheduled state flag/badge instead.
- After fixes, rerun `pnpm test:e2e --project=chromium --grep Scheduling` with existing server instead of spawning a new `webServer`.