// src/components/kanban/KanbanBoard.tsx
import React from "react";
import { Pump, Stage } from "../../types";
import { StageColumn } from "./StageColumn";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useApp } from "../../store";
import { toast } from "sonner";
import { PumpCard } from "./PumpCard";

interface KanbanBoardProps {
  pumps: Pump[];
  onCardClick?: (pump: Pump) => void;
}

const STAGES: Stage[] = ["NOT STARTED", "FABRICATION", "POWDER COAT", "ASSEMBLY", "TESTING", "SHIPPING", "CLOSED"];

export function KanbanBoard({ pumps, onCardClick }: KanbanBoardProps) {
  const { moveStage } = useApp();
  const [activePump, setActivePump] = React.useState<Pump | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const pumpsByStage = React.useMemo(() => {
    return STAGES.reduce((acc, stage) => {
      acc[stage] = pumps.filter(p => p.stage === stage);
      return acc;
    }, {} as Record<Stage, Pump[]>);
  }, [pumps]);

  const handleDragStart = (event: DragStartEvent) => {
    const pump = pumps.find(p => p.id === event.active.id);
    setActivePump(pump || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActivePump(null);
    
    const { active, over } = event;
    if (!over) return;

    const pumpId = active.id as string;
    const newStage = over.id as Stage;

    const pump = pumps.find(p => p.id === pumpId);
    if (!pump) return;

    if (pump.stage !== newStage) {
      moveStage(pumpId, newStage);
      toast.success(`Moved ${pump.model} (${pump.serial}) to ${newStage}`);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">Kanban Board</h2>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => (
            <StageColumn
              key={stage}
              stage={stage}
              pumps={pumpsByStage[stage]}
              onCardClick={onCardClick}
            />
          ))}
        </div>
        <DragOverlay>
          {activePump ? (
            <div className="opacity-80">
              <PumpCard pump={activePump} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

