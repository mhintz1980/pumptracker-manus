import { X, Package, User, Calendar, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScheduleEvent } from '@/pages/Scheduling';
import { Separator } from '@/components/ui/separator';

interface ScheduleDetailPanelProps {
  event: ScheduleEvent;
  onClose: () => void;
}

export function ScheduleDetailPanel({ event, onClose }: ScheduleDetailPanelProps) {
  const priorityColors = {
    high: 'destructive' as const,
    medium: 'default' as const,
    low: 'secondary' as const,
  };

  return (
    <div className="w-[320px] border-l bg-card p-4 overflow-y-auto">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
          <Badge variant={priorityColors[event.priority]} className="text-xs">
            {event.priority.toUpperCase()} Priority
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        {/* Order Number */}
        <div className="flex items-start gap-3">
          <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Order Number</div>
            <div className="font-medium">{event.orderNumber}</div>
          </div>
        </div>

        {/* Model */}
        <div className="flex items-start gap-3">
          <Package className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Pump Model</div>
            <div className="font-medium">{event.model}</div>
          </div>
        </div>

        {/* Customer */}
        <div className="flex items-start gap-3">
          <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Customer</div>
            <div className="font-medium">{event.customer}</div>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-start gap-3">
          <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Schedule</div>
            <div className="text-sm">{event.dateRange}</div>
          </div>
        </div>

        {/* Production Stage */}
        <div className="flex items-start gap-3">
          <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Production Stage</div>
            <Badge className={`${event.color} text-white`}>
              {event.stage}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="text-xs text-muted-foreground mb-2">Description</div>
          <div className="text-sm text-foreground/90 bg-muted/50 p-3 rounded-md">
            {event.description}
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Actions */}
      <div className="space-y-2">
        <Button variant="default" className="w-full">
          Edit Schedule
        </Button>
        <Button variant="outline" className="w-full">
          View Details
        </Button>
        <Button variant="ghost" className="w-full text-destructive hover:text-destructive">
          Remove from Schedule
        </Button>
      </div>
    </div>
  );
}
