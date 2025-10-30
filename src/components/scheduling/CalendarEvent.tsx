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
        "h-full rounded-md shadow-md text-xs font-medium p-1 overflow-hidden cursor-pointer transition-all duration-100 ease-in-out",
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
      <span className="truncate block text-white">{title}</span>
    </div>
  );
}

