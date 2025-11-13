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
  const dateRange = `${format(event.startDate, "MMM d")} → ${format(
    event.endDate,
    "MMM d"
  )}`;

  return (
    <div
      className="flex w-[320px] flex-col justify-between border-l border-white/10 bg-black/40 px-5 py-6 backdrop-blur-xl"
      data-testid="event-detail-panel"
    >
      <div>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{event.title}</h3>
            <p className="text-sm text-white/70">PO {event.subtitle}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full border border-white/10"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-5 text-sm text-white/80">
          {event.customer && (
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/50">
                Customer
              </div>
              <p className="text-base text-white">{event.customer}</p>
            </div>
          )}

          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-white/50">
              Stage
            </div>
            <Badge
              variant="outline"
              className={cn(
                STAGE_COLORS[event.stage] ?? "bg-slate-500/40",
                "border-none text-white"
              )}
            >
              {stageLabel}
            </Badge>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-white/50">
              Window
            </div>
            <p className="font-medium text-white">{dateRange}</p>
          </div>

          {event.priority && (
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/50">
                Priority
              </div>
              <Badge className="border-none bg-white/10 text-white">
                {event.priority}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2 border-t border-white/10 pt-4">
        <Button variant="outline" className="rounded-full">
          Adjust
        </Button>
        <Button variant="destructive" className="rounded-full">
          Clear
        </Button>
      </div>
    </div>
  );
}
