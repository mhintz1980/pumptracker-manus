// src/components/scheduling/SchedulingView.tsx
import { useEffect } from "react";
import { useApp } from "../../store";
import { SchedulingSidebar } from "./SchedulingSidebar";
import { DragAndDropContext } from "./DragAndDropContext";
import { CalendarHeader } from "./CalendarHeader";
import { MainCalendarGrid } from "./MainCalendarGrid";
import { EventDetailPanel } from "./EventDetailPanel";
import { AutoScheduleModal } from "./AutoScheduleModal";
import { useState } from "react";

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

export function SchedulingView() {
  const { pumps } = useApp();
  useEffect(() => {
    console.log('pumps in SchedulingView:', pumps);
  }, [pumps]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventData | null>(null);
  const [isAutoScheduleModalOpen, setIsAutoScheduleModalOpen] = useState(false);

  const handleEventClick = (event: CalendarEventData) => {
    setSelectedEvent(event);
  };

  const handleAutoScheduleClick = () => {
    setIsAutoScheduleModalOpen(true);
  };

  return (
    <DragAndDropContext>
      <div className="flex flex-col h-[calc(100vh-100px)]">
        <CalendarHeader onAutoScheduleClick={handleAutoScheduleClick} />
        <div className="flex flex-1 overflow-hidden">
          <SchedulingSidebar />
          <MainCalendarGrid onEventClick={handleEventClick} />
          {selectedEvent && (
            <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
          )}
        </div>
      </div>
      <AutoScheduleModal
        isOpen={isAutoScheduleModalOpen}
        onClose={() => setIsAutoScheduleModalOpen(false)}
      />
    </DragAndDropContext>
  );
}

