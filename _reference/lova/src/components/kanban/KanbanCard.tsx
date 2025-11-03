import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Pump } from '@/store/useStore';
import { useState } from 'react';
import { EditPumpModal } from '@/components/modals/EditPumpModal';

const priorityColors = {
  LOW: 'bg-blue-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  URGENT: 'bg-red-500',
};

interface KanbanCardProps {
  pump: Pump;
  collapsed: boolean;
  isDragging?: boolean;
}

export const KanbanCard = ({ pump, collapsed, isDragging = false }: KanbanCardProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: pump.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <>
      <EditPumpModal
        pump={pump}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
      <motion.div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onDoubleClick={() => setEditModalOpen(true)}
        className={`layer-l1 p-4 rounded-lg cursor-grab active:cursor-grabbing ${
          isDragging ? 'opacity-50' : ''
        }`}
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-foreground">{pump.model}</h4>
          <p className="text-xs text-muted-foreground">{pump.customer}</p>
        </div>
        <div className={`h-3 w-3 rounded-full ${priorityColors[pump.priority]}`} />
      </div>

      <p className="text-xs text-muted-foreground mb-1">{pump.serialNumber}</p>

      {!collapsed && (
        <div className="mt-3 pt-3 border-t border-border space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">PO:</span>
            <span className="font-medium">{pump.poId}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Color:</span>
            <span className="font-medium">{pump.powderColor}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Value:</span>
            <span className="font-medium">${pump.value.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Due:</span>
            <span className="font-medium">
              {new Date(pump.promiseDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
      </motion.div>
    </>
  );
};
