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
    <div className="w-[320px] border-l border-white/10 bg-[hsl(var(--surface-200)_/_0.85)] backdrop-blur px-5 py-6 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">{event.title}</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-white/10" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-5 text-sm">
          <div>
            <div className="text-foreground/60 mb-1 uppercase tracking-[0.2em] text-[11px]">Date</div>
            <div className="font-medium text-white">{event.dateRange}</div>
          </div>

          <div>
            <div className="text-foreground/60 mb-1 uppercase tracking-[0.2em] text-[11px]">Calendar</div>
            <Badge className={cn(event.calendarColor, "border-none shadow-soft text-white")}
              variant="outline"
            >
              {event.calendar}
            </Badge>
          </div>

          <div>
            <div className="text-foreground/60 mb-1 uppercase tracking-[0.2em] text-[11px]">Type</div>
            <Badge variant="outline" className="gap-2 border-white/10 text-white/80">
              <span>{event.typeIcon}</span>
              {event.type}
            </Badge>
          </div>

          <div>
            <div className="text-foreground/60 mb-1 uppercase tracking-[0.2em] text-[11px]">Description</div>
            <div className="text-foreground/80 leading-relaxed">{event.description}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
        <Button variant="outline" className="rounded-full">Edit</Button>
        <Button variant="destructive" className="rounded-full">Delete</Button>
      </div>
    </div>
  );
}
