// src/components/kanban/KanbanBoard.tsx
import { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Pump, Stage } from "../../types";
import { StageColumn } from "./StageColumn";
import { PumpCard } from "./PumpCard";
import { useApp, SortKey } from "../../store";
import { KANBAN_STAGES } from "./constants";
import { toast } from "sonner";

interface KanbanBoardProps {
  pumps: Pump[];
  collapsed: boolean;
  onCardClick?: (pump: Pump) => void;
  sortKey?: SortKey;
}

export function KanbanBoard({ pumps, collapsed, onCardClick, sortKey = "priority" }: KanbanBoardProps) {
  const moveStage = useApp((state) => state.moveStage);
  const [activePump, setActivePump] = useState<Pump | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const pumpsByStage = useMemo(() => {
    return KANBAN_STAGES.reduce((acc, stage) => {
      acc[stage] = pumps.filter((pump) => pump.stage === stage);
      return acc;
    }, {} as Record<Stage, Pump[]>);
  }, [pumps]);

  const handleDragStart = (event: DragStartEvent) => {
    const pump = pumps.find((p) => p.id === event.active.id);
    setActivePump(pump ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActivePump(null);

    const { active, over } = event;
    if (!over) return;

    const pumpId = active.id as string;
    const nextStage = (over.data?.current?.stage as Stage) ?? (over.id as Stage);
    const pump = pumps.find((p) => p.id === pumpId);

    if (pump && pump.stage !== nextStage) {
      moveStage(pumpId, nextStage);
      toast.success(`Moved ${pump.model} (Serial #${pump.serial}) to ${nextStage}`);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto pb-4 scrollbar-dark">
        {KANBAN_STAGES.map((stage) => (
          <StageColumn
            key={stage}
            stage={stage}
            pumps={sortStagePumps(pumpsByStage[stage], sortKey)}
            collapsed={collapsed}
            onCardClick={onCardClick}
            activeId={activePump?.id}
          />
        ))}
      </div>

      <DragOverlay>
        {activePump ? (
          <PumpCard pump={activePump} collapsed={collapsed} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

const PRIORITY_ORDER: Record<string, number> = {
  Urgent: 0,
  Rush: 1,
  High: 2,
  Normal: 3,
  Low: 4,
};

export function sortStagePumps(pumps: Pump[], sortKey: SortKey): Pump[] {
  const next = [...pumps];
  next.sort((a, b) => {
    switch (sortKey) {
      case "priority": {
        const aRank = PRIORITY_ORDER[a.priority] ?? 99;
        const bRank = PRIORITY_ORDER[b.priority] ?? 99;
        if (aRank !== bRank) return aRank - bRank;
        return compareByDate(a.last_update, b.last_update);
      }
      case "model":
        return compareString(a.model, b.model) || compareByDate(a.last_update, b.last_update);
      case "customer":
        return compareString(a.customer, b.customer) || compareByDate(a.last_update, b.last_update);
      case "po":
        return compareString(a.po, b.po) || compareByDate(a.last_update, b.last_update);
      case "last_update":
        return compareByDate(b.last_update, a.last_update);
      default:
        return 0;
    }
  });
  return next;
}

function compareString(a?: string, b?: string) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

function compareByDate(a?: string, b?: string) {
  const aTime = a ? new Date(a).getTime() : 0;
  const bTime = b ? new Date(b).getTime() : 0;
  return aTime - bTime;
}
