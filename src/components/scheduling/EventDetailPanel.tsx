// src/components/scheduling/EventDetailPanel.tsx
import { format } from "date-fns";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";
import type { CalendarStageEvent } from "../../lib/schedule";
import { STAGE_LABELS, STAGE_COLORS } from "../../lib/stage-constants";

interface EventDetailPanelProps {
  event: CalendarStageEvent | null;
  onClose: () => void;
}

export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  if (!event) return null;

  const stageLabel = STAGE_LABELS[event.stage] ?? event.stage;
  const dateRange = `${format(event.startDate, "MMM d")} → ${format(event.endDate, "MMM d")}`;

  return (
    <div
      className="w-[320px] border-l border-white/10 bg-[hsl(var(--surface-200)_/_0.85)] backdrop-blur px-5 py-6 flex flex-col justify-between event-detail-panel"
      data-testid="event-detail-panel"
    >
      <div>
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">
            {event.title}
            <span className="block text-sm font-normal text-white/70">{event.subtitle}</span>
          </h3>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-white/10" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-5 text-sm">
          <div>
            <div className="text-foreground/60 mb-1 uppercase tracking-[0.2em] text-[11px]">Stage</div>
            <Badge variant="outline" className="gap-2 border-white/10 text-white/80">
              {stageLabel}
            </Badge>
          </div>

          <div>
            <div className="text-foreground/60 mb-1 uppercase tracking-[0.2em] text-[11px]">Window</div>
            <div className="font-medium text-white">{dateRange}</div>
          </div>

          <div>
            <div className="text-foreground/60 mb-1 uppercase tracking-[0.2em] text-[11px]">Calendar</div>
            <Badge
              className={cn(STAGE_COLORS[event.stage] ?? "bg-slate-500/40", "border-none shadow-soft text-white")}
              variant="outline"
            >
              Production Schedule
            </Badge>
          </div>

          <div>
            <div className="text-foreground/60 mb-1 uppercase tracking-[0.2em] text-[11px]">Notes</div>
            <div className="text-foreground/80 leading-relaxed">
              {`Planned duration: ${event.span} day(s). Drag pumps to adjust this stage on the schedule.`}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
        <Button variant="outline" className="rounded-full">Adjust</Button>
        <Button variant="destructive" className="rounded-full">Clear</Button>
      </div>
    </div>
  );
}
