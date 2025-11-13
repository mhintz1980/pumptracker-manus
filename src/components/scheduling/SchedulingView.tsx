import { useState } from "react";
import { BacklogDock } from "./BacklogDock";
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
  const [selectedEvent, setSelectedEvent] = useState<CalendarStageEvent | null>(
    null
  );

  const handleEventClick = (event: CalendarStageEvent) => {
    setSelectedEvent(event);
  };

  return (
    <DragAndDropContext>
      <div
        className="flex h-[calc(100vh-160px)] flex-col"
        data-testid="scheduling-view"
      >
        <CalendarHeader />
        <div className="flex flex-1 gap-4 overflow-hidden">
          <BacklogDock />
          <div className="flex flex-1 overflow-hidden">
            <MainCalendarGrid pumps={pumps} onEventClick={handleEventClick} />
            {selectedEvent && (
              <EventDetailPanel
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
              />
            )}
          </div>
        </div>
      </div>
    </DragAndDropContext>
  );
}
