// src/components/scheduling/UnscheduledJobCard.tsx
import { useMemo } from "react";
import { useApp } from "../../store";
import { Pump } from "../../types";
import { cn } from "../../lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { useDraggable } from "@dnd-kit/core";
import { Badge } from "../ui/Badge";
import { formatPriorityColor } from "../../lib/format";

interface UnscheduledJobCardProps {
  pump: Pump;
}

export function UnscheduledJobCard({ pump }: UnscheduledJobCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: pump.id,
    data: { pump },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  const getModelLeadTimes = useApp.getState().getModelLeadTimes;

  const leadTimes = useMemo(() => {
    return getModelLeadTimes(pump.model);
  }, [pump.model, getModelLeadTimes]);

  const totalDays = leadTimes?.total_days || 0;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab transition-all duration-150 active:scale-[1.02] active:shadow-glow",
        formatPriorityColor(pump.priority, "border")
      )}
      data-pump-id={pump.id}
    >
      <CardHeader className="p-3 pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-white truncate">
            {pump.model}
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium border-white/15",
              formatPriorityColor(pump.priority, "text")
            )}
          >
            {pump.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-1 text-xs text-foreground/65">
        <p className="truncate text-foreground/80">
          PO: {pump.po} | S/N: {pump.serial}
        </p>
        <p className="truncate">Customer: {pump.customer}</p>
        <p className="mt-1 font-medium text-white">
          Build Time: {totalDays} days
        </p>
      </CardContent>
    </Card>
  );
}
