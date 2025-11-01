// src/components/scheduling/CalendarEvent.tsx
import { cn } from "../../lib/utils";

interface CalendarEventProps {
  title: string;
  color: string;
  startCol: number;
  span: number;
  onClick: () => void;
  isDragging?: boolean;
}

export function CalendarEvent({
  title,
  color,
  startCol,
  span,
  onClick,
  isDragging = false,
}: CalendarEventProps) {
  return (
    <div
      className={cn(
        "flex h-full items-center rounded-xl border border-white/10 px-3 text-[11px] font-semibold tracking-wide text-white shadow-soft backdrop-blur cursor-pointer transition-all duration-150",
        color,
        isDragging && "opacity-50 border-2 border-dashed border-gray-600"
      )}
      style={{
        gridColumn: `${startCol + 1} / span ${span}`,
        minWidth: "100%",
        zIndex: isDragging ? 10 : 1,
      }}
      onClick={onClick}
    >
      <span className="truncate">{title}</span>
    </div>
  );
}
