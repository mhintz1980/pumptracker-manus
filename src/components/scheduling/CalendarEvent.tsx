// src/components/scheduling/CalendarEvent.tsx
import { cn } from "../../lib/utils";
import type { CalendarStageEvent } from "../../lib/schedule";
import { STAGE_COLORS, STAGE_LABELS } from "../../lib/stage-constants";

interface CalendarEventProps {
  event: CalendarStageEvent;
  onClick: (event: CalendarStageEvent) => void;
  isDragging?: boolean;
}

export function CalendarEvent({ event, onClick, isDragging = false }: CalendarEventProps) {
  const stageLabel = STAGE_LABELS[event.stage] ?? event.stage;
  const colorClass = STAGE_COLORS[event.stage] ?? "bg-slate-500/40";
  const handleClick = () => onClick(event);

  return (
    <div
      className={cn(
        "flex h-full items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-white shadow-soft backdrop-blur cursor-pointer transition-all duration-150",
        colorClass,
        isDragging && "opacity-50 border-2 border-dashed border-gray-600"
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
      aria-label={`${event.title} - ${stageLabel} - ${event.subtitle ? `PO: ${event.subtitle}` : ""}`}
    >
      <div className="flex flex-col truncate text-left">
        <span className="truncate text-xs font-semibold text-white">{event.title}</span>
        {event.subtitle && (
          <span className="truncate text-[10px] font-normal text-white/80">{event.subtitle}</span>
        )}
      </div>
      <span className="text-[10px] uppercase tracking-[0.18em] text-white/80">{stageLabel}</span>
    </div>
  );
}
