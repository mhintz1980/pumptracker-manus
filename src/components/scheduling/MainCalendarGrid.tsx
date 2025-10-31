// src/components/scheduling/MainCalendarGrid.tsx
import { CalendarEvent } from './CalendarEvent';
import { useDroppable } from '@dnd-kit/core';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { useApp } from '../../store';


// Placeholder for event data structure based on MainCalendarGrid.tsx
interface CalendarEventData {
  id: string;
  title: string;
  color: string;
  startDay: number;
  span: number;
  week: number;
  row: number;
  icon?: string;
  fullTitle: string;
  dateRange: string;
  calendar: string;
  calendarColor: string;
  type: string;
  typeIcon: string;
  description: string;
}

interface MainCalendarGridProps {
  onEventClick: (event: CalendarEventData) => void;
}

export function MainCalendarGrid({ onEventClick }: MainCalendarGridProps) {
  const { pumps } = useApp();

  // The provided MainCalendarGrid.tsx is a static mock.
  // We will use a simplified, dynamic version for the initial implementation.

  // 1. Define the current view (e.g., 4 weeks starting today)
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
  const weeks = 4;
  const daysInView = weeks * 7;
  const viewDates = Array.from({ length: daysInView }).map((_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  // Helper component for a droppable calendar cell
  const DroppableCell = ({ date }: { date: Date }) => {
    const dateId = format(date, 'yyyy-MM-dd');
    const { isOver, setNodeRef } = useDroppable({
      id: dateId,
      data: { date: dateId },
    });

    return (
      <div
        ref={setNodeRef}
        className={cn(
          "border-r border-dashed border-border/50",
          isOver && "bg-green-100/50 dark:bg-green-900/50 transition-colors"
        )}
      ></div>
    );
  };

  // 2. Mock event data based on scheduled pumps
  // For the initial implementation, we will only show "FABRICATION" as a scheduled event
  // since the other stages are part of the Kanban flow.
  const scheduledEvents: CalendarEventData[] = pumps
    .filter(p => p.stage === "FABRICATION" && p.scheduledStart)
    .map((pump, index) => {
      // Logic to convert pump data to CalendarEventData
      const startDate = new Date(pump.scheduledStart!);
      const startDayIndex = viewDates.findIndex(d => d.toDateString() === startDate.toDateString());
      
      // Mock span for now, based on the lead time for fabrication (1.5 days)
      const leadTimes = useApp.getState().getModelLeadTimes(pump.model);
      const span = Math.ceil(leadTimes?.fabrication || 1); // Use fabrication lead time

      return {
        id: pump.id,
        title: `${pump.model} - ${pump.po}`,
        fullTitle: `${pump.model} - ${pump.po} for ${pump.customer}`,
        color: 'bg-blue-500 hover:bg-blue-600', // Scheduled color
        startDay: (startDayIndex % 7), // Day of the week (0-6)
        span: span,
        week: Math.floor(startDayIndex / 7),
        row: (index % 4) + 1, // Simple row assignment for now
        dateRange: `${startDate.toDateString()} - ${new Date(startDate.getTime() + span * 24 * 60 * 60 * 1000).toDateString()}`,
        calendar: 'Production',
        calendarColor: 'bg-blue-500',
        type: 'Fabrication',
        typeIcon: '🛠️',
        description: `Fabrication for ${pump.model} for ${pump.customer}`,
      } as CalendarEventData;
    });

  // 3. Render the grid
  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="min-w-[1000px]">
        {Array.from({ length: weeks }).map((_, weekIndex) => {
          const weekStart = weekIndex * 7;
          const weekDates = viewDates.slice(weekStart, weekStart + 7);
          
          return (
            <div key={weekIndex} className="border-b">
              {/* Week Header */}
              <div className="grid grid-cols-7 bg-card border-b sticky top-0 z-10">
                {weekDates.map((date, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={cn(
                      "border-r p-2 text-center",
                      date.toDateString() === today.toDateString() && 'bg-primary/10' // Highlight today
                    )}
                  >
                    <div className="text-xs text-muted-foreground">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className={cn("text-lg", date.toDateString() === today.toDateString() && 'text-primary font-bold')}>
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Week Events Grid */}
              <div className="relative min-h-[150px]">
                {/* Background grid lines (Droppable Cells) */}
                <div className="grid grid-cols-7 absolute inset-0">
                  {weekDates.map((date, i) => (
                    <DroppableCell key={i} date={date} />
                  ))}
                </div>

                {/* Events for this week */}
                <div className="relative p-2 grid grid-cols-7 gap-y-1" style={{ gridAutoRows: '28px' }}>
                  {scheduledEvents
                    .filter((event) => event.week === weekIndex)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="col-start-1 col-span-7"
                        style={{
                          gridRow: event.row,
                          display: 'grid',
                          gridTemplateColumns: 'repeat(7, 1fr)',
                        }}
                      >
                        <CalendarEvent
                          title={event.title}
                          color={event.color}
                          startCol={event.startDay}
                          span={event.span}
                          onClick={() => onEventClick(event)}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

