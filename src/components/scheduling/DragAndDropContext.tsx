// src/components/scheduling/DragAndDropContext.tsx
import { DndContext, DragEndEvent, DragOverlay, UniqueIdentifier, Active, DragStartEvent } from "@dnd-kit/core";
import { useState } from "react";
import { useApp } from "../../store";
import { UnscheduledJobCard } from "./UnscheduledJobCard";
import { Pump } from "../../types";

interface DragAndDropContextProps {
  children: React.ReactNode;
}

export function DragAndDropContext({ children }: DragAndDropContextProps) {
  const pumps = useApp((state) => state.pumps);
  const updatePump = useApp((state) => state.updatePump);
  const collapsedCards = useApp((state) => state.collapsedCards);
  const [activeId, setActiveId] = useState<string | null>(null);

  const normalizePumpId = (id: UniqueIdentifier) => {
    const idString = id.toString();
    return idString.startsWith("unscheduled-") ? idString.replace("unscheduled-", "") : idString;
  };

  const getPumpFromActive = (active: Active) => {
    const dataPump = active.data?.current?.pump as Pump | undefined;
    if (dataPump) return dataPump;

    const normalizedId = normalizePumpId(active.id);
    return pumps.find((p) => p.id === normalizedId);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const pump = getPumpFromActive(event.active);
    const normalizedId = pump?.id ?? normalizePumpId(event.active.id);
    setActiveId(normalizedId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const pump = getPumpFromActive(active);
    const targetDate = over.id?.toString();

    if (pump && targetDate) {
      updatePump(pump.id, { stage: "FABRICATION", scheduledStart: targetDate });
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
