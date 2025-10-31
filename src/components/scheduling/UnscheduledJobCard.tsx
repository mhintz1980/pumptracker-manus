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
  console.log('pump prop:', pump);
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
        "cursor-grab transition-all duration-150 active:scale-[1.02] active:shadow-lg",
        "border-l-4",
        formatPriorityColor(pump.priority, "border")
      )}
      data-pump-id={pump.id}
    >
      <CardHeader className="p-3 pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold truncate">
            {pump.model}
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium",
              formatPriorityColor(pump.priority, "text")
            )}
          >
            {pump.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-1 text-xs text-muted-foreground">
        <p className="truncate">
          PO: {pump.po} | S/N: {pump.serial}
        </p>
        <p className="truncate">Customer: {pump.customer}</p>
        <p className="text-primary font-medium mt-1">
          Build Time: {totalDays} days
        </p>
      </CardContent>
    </Card>
  );
}

