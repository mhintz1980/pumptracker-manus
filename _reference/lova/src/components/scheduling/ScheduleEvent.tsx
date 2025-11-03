import { ScheduleEvent as ScheduleEventType } from '@/pages/Scheduling';
import { cn } from '@/lib/utils';

interface ScheduleEventProps {
  event: ScheduleEventType;
  onClick: () => void;
}

export function ScheduleEvent({ event, onClick }: ScheduleEventProps) {
  const priorityStyles = {
    high: 'ring-2 ring-destructive/50',
    medium: 'ring-1 ring-primary/30',
    low: 'opacity-90',
  };

  return (
    <div
      className={cn(
        'absolute rounded-md px-2 py-1.5 text-white text-sm cursor-pointer z-30',
        'hover:opacity-90 transition-all hover:shadow-md',
        event.color,
        priorityStyles[event.priority]
      )}
      style={{
        left: `${(event.startDay / 7) * 100}%`,
        width: `${(event.span / 7) * 100}%`,
        top: `${event.row * 40}px`,
        minHeight: '32px',
      }}
      onClick={onClick}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="text-xs opacity-90 truncate">{event.customer}</div>
    </div>
  );
}
