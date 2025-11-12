// src/components/scheduling/SchedulingView.tsx
import { useState } from "react";
import { SchedulingSidebar } from "./SchedulingSidebar";
import { DragAndDropContext } from "./DragAndDropContext";
import { CalendarHeader } from "./CalendarHeader";
import { MainCalendarGrid } from "./MainCalendarGrid";
import { EventDetailPanel } from "./EventDetailPanel";
import type { CalendarStageEvent } from "../../lib/schedule";
import type { Pump } from "../../types";

interface SchedulingViewProps {
  pumps: Pump[];
}

export function SchedulingView({ pumps }: SchedulingViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarStageEvent | null>(null);

  const handleEventClick = (event: CalendarStageEvent) => {
    setSelectedEvent(event);
  };

  return (
    <DragAndDropContext>
      <div className="flex flex-col h-[calc(100vh-100px)]" data-testid="scheduling-view">
        <CalendarHeader />
        <div className="flex flex-1 overflow-hidden">
          <SchedulingSidebar />
          <MainCalendarGrid pumps={pumps} onEventClick={handleEventClick} />
          {selectedEvent && (
            <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
          )}
        </div>
      </div>
    </DragAndDropContext>
  );
}
