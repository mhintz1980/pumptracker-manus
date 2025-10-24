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

  const stageColors = {
    "NOT STARTED": "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700",
    "FABRICATION": "bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700",
    "POWDER COAT": "bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700",
    "ASSEMBLY": "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700",
    "TESTING": "bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700",
    "SHIPPING": "bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700",
    "CLOSED": "bg-emerald-100 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700",
  };

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px]">
      <div
        className={`${stageColors[stage]} border-2 rounded-t-lg p-3 flex justify-between items-center cursor-pointer`}
        onClick={() => toggleStageCollapse(stage)}
      >
        <div>
          <h3 className="font-semibold text-sm">{stage}</h3>
          <div className="text-xs text-muted-foreground">{pumps.length} items</div>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div
          ref={setNodeRef}
          className="bg-muted/30 border-2 border-t-0 border-border rounded-b-lg p-2 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto"
        >
          <SortableContext items={pumps.map(p => p.id)} strategy={verticalListSortingStrategy}>
            {pumps.map((pump) => (
              <PumpCard key={pump.id} pump={pump} onClick={() => onCardClick?.(pump)} />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}

