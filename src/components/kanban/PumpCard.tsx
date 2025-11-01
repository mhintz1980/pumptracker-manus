// src/components/kanban/PumpCard.tsx
import { Pump } from "../../types";
import { formatCurrency, formatDate, formatPriorityColor } from "../../lib/format";
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

  const priorityColor = formatPriorityColor(pump.priority, 'bg');

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-2xl border border-white/8 bg-[hsl(var(--surface-200)_/_0.98)] p-4 shadow-elevated transition-all duration-200 hover:-translate-y-[2px] hover:shadow-glow cursor-pointer ${priorityColor}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-white">{pump.model}</div>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/70">
              {pump.stage}
            </span>
          </div>
          <div className="text-xs text-foreground/65">Serial: {pump.serial}</div>
        </div>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-foreground/50 hover:text-white transition-colors"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3 space-y-2 text-xs text-foreground/70">
        <div className="flex items-center justify-between">
          <span>PO</span>
          <span className="font-medium text-white/90">{pump.po}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Customer</span>
          <span className="font-medium text-white/90">{pump.customer}</span>
        </div>
        {pump.powder_color && (
          <div className="flex items-center justify-between">
            <span>Color</span>
            <span className="font-medium text-white/80">{pump.powder_color}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>Value</span>
          <span className="font-semibold text-white">{formatCurrency(pump.value)}</span>
        </div>
        {pump.scheduledEnd && (
          <div className="flex items-center justify-between">
            <span>Due</span>
            <span
              className={`font-medium ${
                new Date(pump.scheduledEnd) < new Date() ? "text-rose-400" : "text-emerald-300"
              }`}
            >
              {formatDate(pump.scheduledEnd)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[11px]">
        <span className="text-foreground/60">Last update</span>
        <span className="text-foreground/80">
          {formatDate(pump.last_update)}
        </span>
      </div>

      <div className="mt-2 flex justify-end">
        <span className="rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80">
          {pump.priority}
        </span>
      </div>
    </div>
  );
}
