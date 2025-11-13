import { cn } from "../../lib/utils";
import type { CalendarStageEvent } from "../../lib/schedule";
import { STAGE_LABELS } from "../../lib/stage-constants";

interface CalendarEventProps {
  event: CalendarStageEvent;
  onClick: (event: CalendarStageEvent) => void;
  isDragging?: boolean;
}

const STATUS_COLORS = {
  ok: "bg-cyan-500/15 text-cyan-100 border-cyan-400/50",
  warning: "bg-amber-500/15 text-amber-100 border-amber-400/50",
  danger: "bg-pink-500/20 text-pink-100 border-pink-400/50",
};

export function CalendarEvent({ event, onClick, isDragging = false }: CalendarEventProps) {
  const stageLabel = STAGE_LABELS[event.stage] ?? event.stage;
  const idleDays = event.idleDays ?? 0;
  const status = idleDays > 6 ? "danger" : idleDays > 3 ? "warning" : "ok";
  const handleClick = () => onClick(event);

  return (
    <div
      className={cn(
        "group flex h-full cursor-pointer flex-col justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white shadow-layer-sm transition-all duration-150",
        STATUS_COLORS[status],
        isDragging && "opacity-50 border-dashed border-white/50"
      )}
      style={{
        gridColumn: `${event.startDay + 1} / span ${event.span}`,
        minWidth: "100%",
        zIndex: isDragging ? 10 : 1,
      }}
      data-testid="calendar-event"
      data-pump-id={event.pumpId}
      data-stage={event.stage}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`${event.title} - ${stageLabel} - PO ${event.subtitle}`}
    >
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <span className="truncate">{event.title}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">
          {stageLabel}
        </span>
      </div>

      <div className="mt-1 flex items-center justify-between text-[10px] text-white/80">
        <span className="truncate">PO {event.subtitle}</span>
        {event.customer && <span className="truncate">{event.customer}</span>}
      </div>

      <div className="mt-2 flex items-center gap-2 text-[10px]">
        {event.priority && (
          <span className="rounded-full border border-white/20 px-2 py-0.5 text-[9px] uppercase tracking-widest">
            {event.priority}
          </span>
        )}
        <span className="rounded-full border border-white/20 px-2 py-0.5 text-[9px] uppercase tracking-widest">
          {status === "danger"
            ? "Stalled"
            : status === "warning"
            ? "At Risk"
            : "On Track"}
        </span>
      </div>
    </div>
  );
}
