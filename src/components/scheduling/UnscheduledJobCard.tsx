// src/components/scheduling/UnscheduledJobCard.tsx
import { useDraggable } from "@dnd-kit/core";
import { Pump } from "../../types";
import { formatCurrency, formatDate } from "../../lib/format";
import { useApp } from "../../store";
import { useMemo } from "react";
import { PRIORITY_DOT } from "../kanban/constants";

interface UnscheduledJobCardProps {
  pump: Pump;
  collapsed: boolean;
}

const stripColor = (pump: Pump) => pump.powder_color || "hsl(var(--border))";

export function UnscheduledJobCard({ pump, collapsed }: UnscheduledJobCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `unscheduled-${pump.id}`,
    data: { pump },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  const leadTimes = useMemo(
    () => useApp.getState().getModelLeadTimes(pump.model),
    [pump.model]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative overflow-hidden rounded-xl border border-border bg-card/90 px-4 py-4 shadow-layer-md transition-all duration-200 hover:-translate-y-[2px] hover:shadow-layer-lg cursor-grab active:cursor-grabbing"
    >
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: stripColor(pump) }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          <div className="text-sm font-semibold text-foreground truncate" title={pump.model}>
            {pump.model}
          </div>
          <div className="text-xs text-muted-foreground truncate" title={pump.customer}>
            {pump.customer}
          </div>
          <div className="text-xs text-muted-foreground truncate" title={`Serial #${pump.serial}`}>
            Serial #{pump.serial}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-muted-foreground">
            <span
              className={`h-2.5 w-2.5 rounded-full ${PRIORITY_DOT[pump.priority]}`}
              title={`Priority: ${pump.priority}`}
            />
          </div>
          <span
            className="h-2 w-6 rounded-full border border-border/60"
            style={{ backgroundColor: stripColor(pump) }}
            title={pump.powder_color ? `Powder Coat: ${pump.powder_color}` : "No powder coat"}
          />
        </div>
      </div>

      {!collapsed && (
        <div className="mt-3 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>PO</span>
            <span className="font-medium text-foreground">{pump.po}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Value</span>
            <span className="font-semibold text-foreground">{formatCurrency(pump.value)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Due</span>
            <span>
              {pump.scheduledEnd ? formatDate(pump.scheduledEnd) : "TBD"}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border/60 pt-2 text-[11px]">
            <span>Build Time</span>
            <span>{leadTimes?.total_days ?? 0} days</span>
          </div>
        </div>
      )}
    </div>
  );
}
