// src/components/scheduling/DragAndDropContext.tsx
import { DndContext, DragEndEvent, DragOverlay, useDraggable, UniqueIdentifier } from "@dnd-kit/core";
import { useState } from "react";
import { Pump } from "../../types";
import { useApp } from "../../store";
import { UnscheduledJobCard } from "./UnscheduledJobCard";
import { CalendarEvent } from "./CalendarEvent";

interface DragAndDropContextProps {
  children: React.ReactNode;
}

export function DragAndDropContext({ children }: DragAndDropContextProps) {
  const { pumps, updatePumpStageAndDate } = useApp();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const handleDragStart = (event: { active: { id: UniqueIdentifier } }) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const pumpId = active.id.toString();
      const targetDate = over.id.toString(); // The droppable ID will be the date string

      // Find the pump being dragged
      const pumpToMove = pumps.find((p) => p.id === pumpId);

      if (pumpToMove) {
        // Simulate scheduling by moving the pump to the 'FABRICATION' stage
        // and setting the scheduledStart date to the dropped date.
        updatePumpStageAndDate(pumpId, "FABRICATION", targetDate);
      }
    }
    setActiveId(null);
  };

  const activePump = pumps.find((p) => p.id === activeId);

  const renderDragOverlay = () => {
    if (!activePump) return null;

    // Render a simplified, transparent version of the job card for the drag overlay
    return (
      <DragOverlay>
        <div className="w-[268px] opacity-70">
          <UnscheduledJobCard pump={activePump} />
        </div>
      </DragOverlay>
    );
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {children}
      {renderDragOverlay()}
    </DndContext>
  );
}

