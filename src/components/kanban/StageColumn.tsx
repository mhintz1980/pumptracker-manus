// src/components/kanban/StageColumn.tsx
import { Pump, Stage } from "../../types";
import { PumpCard } from "./PumpCard";
import { useDroppable } from "@dnd-kit/core";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "../../store";
import { cn } from "../../lib/utils";

interface StageColumnProps {
  stage: Stage;
  pumps: Pump[];
  collapsed: boolean;
  onCardClick?: (pump: Pump) => void;
  activeId?: string | null;
}

export function StageColumn({ stage, pumps, collapsed, onCardClick, activeId }: StageColumnProps) {
  const { collapsedStages, toggleStageCollapse } = useApp();
  const isCollapsed = collapsedStages[stage];
  
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: { type: "column", stage },
  });

  const stageAccent: Record<Stage, string> = {
    "NOT STARTED": "bg-slate-400",
    "FABRICATION": "bg-blue-500",
    "POWDER COAT": "bg-purple-500",
    "ASSEMBLY": "bg-amber-500",
    "TESTING": "bg-orange-500",
    "SHIPPING": "bg-emerald-500",
    "CLOSED": "bg-cyan-500",
  };

  return (
    <div className="flex min-w-[260px] max-w-[300px] flex-col">
      <div
        className={cn(
          "layer-l2 overflow-hidden transition-shadow",
          isOver && "ring-2 ring-accent/40"
        )}
      >
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 border-b border-border/60 bg-card/60 px-3 py-2.5 text-left transition-colors hover:bg-card"
          onClick={() => toggleStageCollapse(stage)}
        >
          <div className="flex flex-1 items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${stageAccent[stage]}`}></span>
            <div className="flex flex-1 items-center justify-between text-sm font-semibold text-foreground">
              <span className="truncate" title={stage}>
                {stage}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {pumps.length}
              </span>
            </div>
          </div>
          <span className="text-muted-foreground hover:text-foreground">
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </span>
        </button>

        {!isCollapsed && (
          <div
            ref={setNodeRef}
            className="flex-1 space-y-3 overflow-y-auto overflow-x-hidden px-2.5 py-3 max-h-[calc(100vh-320px)] scrollbar-dark"
          >
            {pumps.map((pump) => (
              activeId === pump.id ? null : (
                <PumpCard
                  key={pump.id}
                  pump={pump}
                  collapsed={collapsed}
                  onClick={() => onCardClick?.(pump)}
                />
              )
            ))}
            {pumps.length === 0 && (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                Drop pumps here
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
