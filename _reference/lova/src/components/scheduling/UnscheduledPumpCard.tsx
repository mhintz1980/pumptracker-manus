import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

interface UnscheduledPump {
  id: string;
  model: string;
  customer: string;
  poId: string;
  powderColor: string;
  value: number;
  promiseDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

const priorityColors = {
  LOW: 'bg-blue-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  URGENT: 'bg-red-500',
};

interface UnscheduledPumpCardProps {
  pump: UnscheduledPump;
  collapsed: boolean;
}

export const UnscheduledPumpCard = ({ pump, collapsed }: UnscheduledPumpCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `unscheduled-${pump.id}`,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="layer-l1 p-3 rounded-lg cursor-grab active:cursor-grabbing"
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
  );
};
