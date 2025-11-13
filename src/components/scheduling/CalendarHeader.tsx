import { Button } from "../ui/Button";
import {
  STAGE_COLORS,
  STAGE_LABELS,
  PRODUCTION_STAGES,
} from "../../lib/stage-constants";
import { cn } from "../../lib/utils";
import { useApp } from "../../store";
import { Wand2, RefreshCw, Trash2 } from "lucide-react";

export function CalendarHeader() {
  const clearNotStartedSchedules = useApp(
    (state) => state.clearNotStartedSchedules
  );
  const levelNotStartedSchedules = useApp(
    (state) => state.levelNotStartedSchedules
  );

  return (
    <div
      className="border-b border-white/10 bg-black/25 px-4 py-4 backdrop-blur-xl"
      data-testid="calendar-header"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-2 overflow-x-auto pr-4">
          {PRODUCTION_STAGES.map((stage) => (
            <div
              key={stage}
              className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/70"
            >
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full border border-white/30",
                  STAGE_COLORS[stage]
                )}
                aria-hidden="true"
              />
              {STAGE_LABELS[stage]}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
            onClick={levelNotStartedSchedules}
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Level
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <Wand2 className="mr-2 h-3.5 w-3.5" />
            Auto
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
            onClick={clearNotStartedSchedules}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
