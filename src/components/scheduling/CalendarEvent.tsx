// src/components/scheduling/CalendarEvent.tsx
import { cn } from "../../lib/utils";

interface CalendarEventProps {
  title: string;
  subtitle?: string;
  stageLabel?: string;
  colorClass: string;
  startCol: number;
  span: number;
  onClick: () => void;
  isDragging?: boolean;
  pumpId?: string;
  stage?: string;
}

export function CalendarEvent({
  title,
  subtitle,
  stageLabel,
  colorClass,
  startCol,
  span,
  onClick,
  isDragging = false,
  pumpId,
  stage,
}: CalendarEventProps) {
  return (
    <div
      className={cn(
        "flex h-full items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-white shadow-soft backdrop-blur cursor-pointer transition-all duration-150",
        colorClass,
        isDragging && "opacity-50 border-2 border-dashed border-gray-600"
      )}
      style={{
        gridColumn: `${startCol + 1} / span ${span}`,
        minWidth: "100%",
        zIndex: isDragging ? 10 : 1,
      }}
      data-testid="calendar-event"
      data-pump-id={pumpId}
      data-stage={stage}
      onClick={onClick}
    >
      <div className="flex flex-col truncate text-left">
        <span className="truncate text-xs font-semibold text-white">{title}</span>
        {subtitle && (
          <span className="truncate text-[10px] font-normal text-white/80">
            {subtitle}
          </span>
        )}
      </div>
      {stageLabel && (
        <span className="text-[10px] uppercase tracking-[0.18em] text-white/80">
          {stageLabel}
        </span>
      )}
    </div>
  );
}
