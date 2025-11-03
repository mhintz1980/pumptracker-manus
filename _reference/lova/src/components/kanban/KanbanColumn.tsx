import { useDroppable } from '@dnd-kit/core';
import { Stage, Pump } from '@/store/useStore';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  stage: { id: Stage; label: string };
  pumps: Pump[];
  collapsed: boolean;
}

export const KanbanColumn = ({ stage, pumps, collapsed }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[280px] flex-shrink-0 h-full ${
        isOver ? 'bg-accent/10' : ''
      }`}
    >
      <div className="layer-l2 p-3 mb-3 rounded-xl">
        <h3 className="text-sm font-semibold text-foreground mb-0.5">
          {stage.label}
        </h3>
        <p className="text-xs text-muted-foreground">
          {pumps.length} {pumps.length === 1 ? 'pump' : 'pumps'}
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {pumps.map((pump) => (
          <KanbanCard key={pump.id} pump={pump} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
};
