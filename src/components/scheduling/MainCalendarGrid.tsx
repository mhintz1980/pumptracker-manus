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
          "border-r border-white/10 transition-colors",
          isOver && "bg-emerald-400/15"
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
      
      // Calculate span based on fabrication lead time and non-working days (weekends)
      const leadTimes = useApp.getState().getModelLeadTimes(pump.model);
      const fabricationLeadTime = leadTimes?.fabrication || 1;
      let workDays = 0;
      let span = 0;
      let currentDate = new Date(startDate);
      
      while (workDays < fabricationLeadTime) {
        // 0 = Sunday, 6 = Saturday
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          workDays++;
        }
        span++;
        currentDate.setDate(currentDate.getDate() + 1);
      }
      // span is the total number of days from start to end, inclusive of weekends
      // The event component will need to handle the visual representation
      // For now, let's use the total days from start to end for the grid span
      // The actual span in the grid should be the number of days the event occupies.
      // Since the event is rendered in a single row, the span should be the number of days it takes.
      // Let's simplify: the span is the number of calendar days it takes to complete the work.
      // The span in the CalendarEvent component is the number of columns it occupies.
      // The span calculation above is correct for the number of calendar days.
      // We need to adjust the startDay to be the day of the week of the start date.
      // The span should be the number of days the event occupies in the current week.
      // This is getting complex for a simple grid. Let's assume the CalendarEvent component
      // will handle the wrapping/multi-week display.
      
      // For the initial implementation, let's use the total number of calendar days (span)
      // and let the CalendarEvent component handle the visual break.
      // The `span` variable calculated above is the total number of calendar days.
      
      // Re-calculating the span to be the number of days in the current week for the event
      // This is a common pattern for calendar grid events.
      
      // Let's stick to the original plan: the span is the total number of days, and the
      // CalendarEvent component will handle the visual break.
      
      // The span is the number of calendar days it takes to complete the work.
      // The logic above calculates the total number of days (including weekends) to meet the work days.
      
      // Let's use the total number of days for the span for now.
      const finalSpan = span;

      return {
        id: pump.id,
        title: `${pump.model} - ${pump.po}`,
        fullTitle: `${pump.model} - ${pump.po} for ${pump.customer}`,
        color: 'bg-gradient-to-r from-blue-500/60 to-sky-400/60 hover:from-blue-500 hover:to-sky-400',
        startDay: (startDayIndex % 7), // Day of the week (0-6)
        span: finalSpan,
        week: Math.floor(startDayIndex / 7),
        row: (index % 4) + 1, // Simple row assignment for now
        dateRange: `${startDate.toDateString()} - ${new Date(startDate.getTime() + (finalSpan - 1) * 24 * 60 * 60 * 1000).toDateString()}`,
        calendar: 'Production',
        calendarColor: 'bg-blue-500',
        type: 'Fabrication',
        typeIcon: '🛠️',
        description: `Fabrication for ${pump.model} for ${pump.customer}`,
      } as CalendarEventData;
    });

  // 3. Render the grid
  return (
    <div className="flex-1 overflow-auto bg-transparent">
      <div className="min-w-[1000px]">
        {Array.from({ length: weeks }).map((_, weekIndex) => {
          const weekStart = weekIndex * 7;
          const weekDates = viewDates.slice(weekStart, weekStart + 7);
          
          return (
            <div key={weekIndex} className="border-b border-white/10">
              {/* Week Header */}
              <div className="grid grid-cols-7 border-b border-white/10 bg-[hsl(var(--surface-200)_/_0.92)] sticky top-0 z-10 backdrop-blur">
                {weekDates.map((date, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={cn(
                      "border-r border-white/10 p-3 text-center",
                      date.toDateString() === today.toDateString() && 'bg-white/10 rounded-t-xl'
                    )}
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-foreground/60">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={cn("text-lg font-semibold text-white", date.toDateString() === today.toDateString() && 'text-primary')}>
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
                <div className="relative grid grid-cols-7 gap-y-1 p-2" style={{ gridAutoRows: '28px' }}>
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
