// src/components/scheduling/CalendarHeader.tsx
import { Button } from "../ui/Button";
import { STAGE_COLORS, STAGE_LABELS, PRODUCTION_STAGES } from "../../lib/stage-constants";
import { cn } from "../../lib/utils";
import { useApp } from "../../store";

export function CalendarHeader() {
  const clearNotStartedSchedules = useApp((state) => state.clearNotStartedSchedules);
  const levelNotStartedSchedules = useApp((state) => state.levelNotStartedSchedules);

  return (
    <div className="border-b border-border bg-card" data-testid="calendar-header">
      <div className="flex items-center justify-end gap-3 px-6 py-4">
        <Button variant="outline" size="sm" className="rounded-full px-5" onClick={levelNotStartedSchedules}>
          Level
        </Button>
        <Button variant="outline" size="sm" className="rounded-full px-5">
          Auto-Schedule
        </Button>
        <Button variant="outline" size="sm" className="rounded-full px-5" onClick={clearNotStartedSchedules}>
          Clear
        </Button>
      </div>

      <div className="px-6 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/60 mb-2">
          Stage Legend
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {PRODUCTION_STAGES.map((stage) => (
            <div key={stage} className="flex items-center gap-2 text-sm text-foreground/70">
              <span
                className={cn(
                  "h-3 w-3 rounded-sm border border-white/20",
                  STAGE_COLORS[stage]
                )}
                aria-hidden="true"
              />
              <span>{STAGE_LABELS[stage]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
