// src/components/scheduling/DragAndDropContext.tsx
import { DndContext, DragEndEvent, DragOverlay, UniqueIdentifier } from "@dnd-kit/core";
import { useState } from "react";
import { useApp } from "../../store";
import { UnscheduledJobCard } from "./UnscheduledJobCard";

interface DragAndDropContextProps {
  children: React.ReactNode;
}

export function DragAndDropContext({ children }: DragAndDropContextProps) {
  const pumps = useApp((state) => state.pumps);
  const updatePump = useApp((state) => state.updatePump);
  const collapsedCards = useApp((state) => state.collapsedCards);
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
        updatePump(pumpId, { stage: "FABRICATION", scheduledStart: targetDate });
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
          <UnscheduledJobCard pump={activePump} collapsed={collapsedCards} />
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
