import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState } from 'react';
import { useStore, Stage } from '@/store/useStore';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import type { Pump } from '@/store/useStore';

const stages: { id: Stage; label: string }[] = [
  { id: 'NOT_STARTED', label: 'Not Started' },
  { id: 'FABRICATION', label: 'Fabrication' },
  { id: 'POWDER_COAT', label: 'Powder Coat' },
  { id: 'ASSEMBLY', label: 'Assembly' },
  { id: 'TESTING', label: 'Testing' },
  { id: 'SHIPPING', label: 'Shipping' },
];

export const KanbanBoard = () => {
  const getFilteredPumps = useStore((state) => state.getFilteredPumps);
  const updatePump = useStore((state) => state.updatePump);
  const collapsedCards = useStore((state) => state.collapsedCards);
  
  const [activePump, setActivePump] = useState<Pump | null>(null);

  const pumps = getFilteredPumps();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const pump = pumps.find((p) => p.id === event.active.id);
    if (pump) {
      setActivePump(pump);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActivePump(null);

    if (!over) return;

    const pumpId = active.id as string;
    const newStage = over.id as Stage;

    const pump = pumps.find((p) => p.id === pumpId);
    if (pump && pump.stage !== newStage) {
      updatePump(pumpId, { stage: newStage });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {stages.map((stage) => {
          const stagePumps = pumps.filter((p) => p.stage === stage.id);
          return (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              pumps={stagePumps}
              collapsed={collapsedCards}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activePump ? (
          <KanbanCard pump={activePump} collapsed={collapsedCards} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
