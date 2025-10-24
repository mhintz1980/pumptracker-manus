// src/components/kanban/PumpCard.tsx
import { Pump } from "../../types";
import { formatCurrency, formatDate } from "../../lib/format";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface PumpCardProps {
  pump: Pump;
  onClick?: () => void;
}

export function PumpCard({ pump, onClick }: PumpCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: pump.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColor = {
    Urgent: "border-red-500 bg-red-50 dark:bg-red-950/20",
    Rush: "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
    High: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
    Normal: "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
    Low: "border-gray-500 bg-gray-50 dark:bg-gray-950/20",
  }[pump.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-l-4 ${priorityColor} bg-card rounded-lg p-3 mb-2 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="font-semibold text-sm">{pump.model}</div>
          <div className="text-xs text-muted-foreground">Serial: {pump.serial}</div>
        </div>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">PO:</span>
          <span className="font-medium">{pump.po}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Customer:</span>
          <span className="font-medium">{pump.customer}</span>
        </div>
        {pump.powder_color && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Color:</span>
            <span className="font-medium">{pump.powder_color}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Value:</span>
          <span className="font-medium">{formatCurrency(pump.value)}</span>
        </div>
        {pump.scheduledEnd && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Due:</span>
            <span className={`font-medium ${
              new Date(pump.scheduledEnd) < new Date() ? "text-red-600" : ""
            }`}>
              {formatDate(pump.scheduledEnd)}
            </span>
          </div>
        )}
      </div>

      {(pump.priority === "Urgent" || pump.priority === "Rush") && (
        <div className="mt-2 pt-2 border-t border-border">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {pump.priority}
          </span>
        </div>
      )}
    </div>
  );
}

