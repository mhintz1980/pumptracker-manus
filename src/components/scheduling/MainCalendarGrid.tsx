// src/components/scheduling/MainCalendarGrid.tsx
import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { addDays, format, startOfDay, startOfWeek } from "date-fns";
import { cn } from "../../lib/utils";
import { useApp } from "../../store";
import { CalendarEvent } from "./CalendarEvent";
import {
  buildCalendarEvents,
  type CalendarStageEvent,
} from "../../lib/schedule";
import type { Stage } from "../../types";

interface MainCalendarGridProps {
  onEventClick: (event: CalendarStageEvent) => void;
}

const STAGE_LABELS: Record<Stage, string> = {
  "UNSCHEDULED": "Unscheduled",
  "NOT STARTED": "Not Started",
  FABRICATION: "Fabrication",
  "POWDER COAT": "Powder Coat",
  ASSEMBLY: "Assembly",
  TESTING: "Testing",
  SHIPPING: "Shipping",
  CLOSED: "Closed",
};

const STAGE_COLORS: Record<Stage, string> = {
  "UNSCHEDULED": "bg-gradient-to-r from-gray-500/40 to-gray-400/30",
  "NOT STARTED": "bg-gradient-to-r from-slate-500/40 to-slate-400/30",
  FABRICATION: "bg-gradient-to-r from-blue-500/70 to-sky-400/70",
  "POWDER COAT": "bg-gradient-to-r from-purple-500/70 to-fuchsia-400/70",
  ASSEMBLY: "bg-gradient-to-r from-amber-500/70 to-orange-400/70",
  TESTING: "bg-gradient-to-r from-rose-500/70 to-orange-400/70",
  SHIPPING: "bg-gradient-to-r from-emerald-500/70 to-lime-400/70",
  CLOSED: "bg-gradient-to-r from-cyan-500/70 to-blue-400/70",
};

const weeks = 4;
const daysInView = weeks * 7;

export function MainCalendarGrid({ onEventClick }: MainCalendarGridProps) {
  const pumps = useApp((state) => state.pumps);
  const { getModelLeadTimes } = useApp.getState();

  const today = useMemo(() => startOfDay(new Date()), []);
  const viewStart = useMemo(
    () => startOfDay(startOfWeek(today, { weekStartsOn: 1 })),
    [today]
  );

  const viewDates = useMemo(
    () => Array.from({ length: daysInView }, (_, index) => addDays(viewStart, index)),
    [viewStart]
  );

  const events = useMemo(
    () =>
      buildCalendarEvents({
        pumps,
        viewStart,
        days: daysInView,
        leadTimeLookup: getModelLeadTimes,
      }),
    [pumps, viewStart, getModelLeadTimes]
  );

  const DroppableCell = ({ date }: { date: Date }) => {
    const dateId = format(date, "yyyy-MM-dd");
    const { isOver, setNodeRef } = useDroppable({
      id: dateId,
      data: { date: dateId },
    });

    return (
      <div
        ref={setNodeRef}
        className={cn(
          "calendar-cell border-r border-white/10 transition-colors",
          isOver && "bg-emerald-400/15"
        )}
        style={{ minHeight: 28 }}
        data-testid={`calendar-cell-${dateId}`}
      />
    );
  };

  return (
    <div className="flex-1 overflow-auto bg-transparent" data-testid="calendar-grid">
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

              <div className="relative min-h-[150px]">
                <div className="grid grid-cols-7 absolute inset-0">
                  {weekDates.map((date, i) => (
                    <DroppableCell key={i} date={date} />
                  ))}
                </div>

                <div className="relative grid grid-cols-7 gap-y-1 p-2" style={{ gridAutoRows: '32px' }}>
                  {events
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
                          subtitle={event.subtitle}
                          stageLabel={STAGE_LABELS[event.stage]}
                          colorClass={
                            STAGE_COLORS[event.stage] ?? "bg-gradient-to-r from-slate-500/40 to-slate-400/30"
                          }
                          startCol={event.startDay}
                          span={event.span}
                          pumpId={event.pumpId}
                          stage={event.stage}
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
