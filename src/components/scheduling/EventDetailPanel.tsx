// src/components/scheduling/EventDetailPanel.tsx
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

// Placeholder for event data structure based on MainCalendarGrid.tsx
interface Event {
  id: string;
  title: string;
  dateRange: string;
  calendar: string;
  calendarColor: string;
  type: string;
  typeIcon: string;
  description: string;
}

interface EventDetailPanelProps {
  event: Event | null;
  onClose: () => void;
}

export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  if (!event) return null;

  return (
    <div className="w-[300px] border-l bg-card p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <div className="text-muted-foreground mb-1">Date</div>
            <div className="font-medium">{event.dateRange}</div>
          </div>

          <div>
            <div className="text-muted-foreground mb-1">Calendar:</div>
            <Badge className={cn(event.calendarColor, "text-white")}>
              {event.calendar}
            </Badge>
          </div>

          <div>
            <div className="text-muted-foreground mb-1">Type:</div>
            <Badge variant="outline" className="gap-1">
              <span>{event.typeIcon}</span>
              {event.type}
            </Badge>
          </div>

          <div>
            <div className="text-muted-foreground mb-1">Description:</div>
            <div className="text-foreground">{event.description}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline">Edit</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    </div>
  );
}

