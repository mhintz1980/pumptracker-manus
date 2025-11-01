// src/components/kanban/StageColumn.tsx
import { Pump, Stage } from "../../types";
import { PumpCard } from "./PumpCard";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "../../store";

interface StageColumnProps {
  stage: Stage;
  pumps: Pump[];
  onCardClick?: (pump: Pump) => void;
}

export function StageColumn({ stage, pumps, onCardClick }: StageColumnProps) {
  const { collapsedStages, toggleStageCollapse } = useApp();
  const isCollapsed = collapsedStages[stage];
  
  const { setNodeRef } = useDroppable({
    id: stage,
  });

  const stageAccent: Record<Stage, string> = {
    "NOT STARTED": "bg-slate-400",
    "FABRICATION": "bg-blue-400",
    "POWDER COAT": "bg-purple-400",
    "ASSEMBLY": "bg-amber-400",
    "TESTING": "bg-orange-400",
    "SHIPPING": "bg-emerald-400",
    "CLOSED": "bg-cyan-400",
  };

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px]">
      <div className="surface-elevated border border-white/8 rounded-3xl shadow-frame overflow-hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 border-b border-white/8 bg-white/5 px-4 py-3 text-left transition-colors hover:bg-white/10"
          onClick={() => toggleStageCollapse(stage)}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${stageAccent[stage]}`}></span>
              <h3 className="text-sm font-semibold tracking-wide text-white">{stage}</h3>
            </div>
            <div className="text-xs text-foreground/70 mt-1">{pumps.length} items</div>
          </div>
          <span className="text-foreground/60 hover:text-white">
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </span>
        </button>

        {!isCollapsed && (
          <div
            ref={setNodeRef}
            className="surface-panel px-3 py-4 max-h-[calc(100vh-320px)] overflow-y-auto space-y-3"
          >
            <SortableContext items={pumps.map(p => p.id)} strategy={verticalListSortingStrategy}>
              {pumps.map((pump) => (
                <PumpCard key={pump.id} pump={pump} onClick={() => onCardClick?.(pump)} />
              ))}
            </SortableContext>
          </div>
        )}
      </div>
    </div>
  );
}
