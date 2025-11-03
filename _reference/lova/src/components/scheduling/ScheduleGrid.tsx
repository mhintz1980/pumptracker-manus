import { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { ScheduleEvent as ScheduleEventComponent } from './ScheduleEvent';
import { ScheduleEvent } from '@/pages/Scheduling';

interface ScheduleGridProps {
  viewMode: '4weeks' | '6weeks';
  onEventClick: (event: ScheduleEvent) => void;
}

export function ScheduleGrid({ viewMode, onEventClick }: ScheduleGridProps) {
  const weeks = viewMode === '4weeks' ? 4 : 6;
  const [activeEvent, setActiveEvent] = useState<ScheduleEvent | null>(null);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  
  // Federal holidays for 2025 (simplified list)
  const holidays = new Set([
    '2025-01-01', // New Year's Day
    '2025-01-20', // MLK Day
    '2025-02-17', // Presidents' Day
  ]);
  
  const isWeekend = (dayIndex: number) => dayIndex === 0 || dayIndex === 6; // Sunday or Saturday
  const isHoliday = (month: string, date: number) => {
    const year = month?.includes('Feb') ? '2025-02' : '2025-01';
    const dateStr = `${year}-${String(date).padStart(2, '0')}`;
    return holidays.has(dateStr);
  };
  
  const weekHeaders = [
    { week: 1, days: [
      { day: 'Sun', date: 1, month: 'Jan 1, 2025' },
      { day: 'Mon', date: 2 },
      { day: 'Tue', date: 3 },
      { day: 'Wed', date: 4 },
      { day: 'Thu', date: 5 },
      { day: 'Fri', date: 6 },
      { day: 'Sat', date: 7 },
    ]},
    { week: 2, days: [
      { day: 'Sun', date: 8 },
      { day: 'Mon', date: 9 },
      { day: 'Tue', date: 10 },
      { day: 'Wed', date: 11 },
      { day: 'Thu', date: 12 },
      { day: 'Fri', date: 13 },
      { day: 'Sat', date: 14 },
    ]},
    { week: 3, days: [
      { day: 'Sun', date: 15 },
      { day: 'Mon', date: 16 },
      { day: 'Tue', date: 17 },
      { day: 'Wed', date: 18 },
      { day: 'Thu', date: 19 },
      { day: 'Fri', date: 20 },
      { day: 'Sat', date: 21 },
    ]},
    { week: 4, days: [
      { day: 'Sun', date: 22 },
      { day: 'Mon', date: 23 },
      { day: 'Tue', date: 24 },
      { day: 'Wed', date: 25 },
      { day: 'Thu', date: 26 },
      { day: 'Fri', date: 27 },
      { day: 'Sat', date: 28 },
    ]},
    { week: 5, days: [
      { day: 'Sun', date: 29 },
      { day: 'Mon', date: 30 },
      { day: 'Tue', date: 31 },
      { day: 'Wed', date: 1, month: 'Feb' },
      { day: 'Thu', date: 2 },
      { day: 'Fri', date: 3 },
      { day: 'Sat', date: 4 },
    ]},
    { week: 6, days: [
      { day: 'Sun', date: 5 },
      { day: 'Mon', date: 6 },
      { day: 'Tue', date: 7 },
      { day: 'Wed', date: 8 },
      { day: 'Thu', date: 9 },
      { day: 'Fri', date: 10 },
      { day: 'Sat', date: 11 },
    ]},
  ].slice(0, weeks);

  // Sample events based on pump production schedules
  const events: ScheduleEvent[] = [
    {
      id: '1',
      title: 'DD-4S Fabrication',
      model: 'DD-4S',
      customer: 'United Rentals',
      stage: 'Fabrication',
      color: 'bg-blue-500',
      startDay: 1,
      span: 2,
      week: 0,
      row: 1,
      dateRange: 'Mon Jan 2 - Tue Jan 3, 2025',
      description: 'Fabrication stage for 4" Double Diaphragm pump',
      orderNumber: 'PO-2025-001',
      priority: 'high',
    },
    {
      id: '2',
      title: 'RL200 Powder Coat',
      model: 'RL200',
      customer: 'Sunbelt Rentals',
      stage: 'Powder Coat',
      color: 'bg-purple-500',
      startDay: 2,
      span: 7,
      week: 0,
      row: 2,
      dateRange: 'Tue Jan 3 - Mon Jan 9, 2025',
      description: '8" Rotary Lobe in powder coating process',
      orderNumber: 'PO-2025-002',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'DD-6 SAFE Assembly',
      model: 'DD-6 SAFE',
      customer: 'Herc Rentals',
      stage: 'Assembly',
      color: 'bg-orange-500',
      startDay: 3,
      span: 2,
      week: 0,
      row: 3,
      dateRange: 'Wed Jan 4 - Thu Jan 5, 2025',
      description: '6" Enclosed pump assembly in progress',
      orderNumber: 'PO-2025-003',
      priority: 'high',
    },
    {
      id: '4',
      title: 'HC-150 Testing',
      model: 'HC-150',
      customer: 'Rain For Rent',
      stage: 'Testing',
      color: 'bg-yellow-500',
      startDay: 5,
      span: 1,
      week: 0,
      row: 4,
      dateRange: 'Fri Jan 6, 2025',
      description: '6" High CFM pump final testing',
      orderNumber: 'PO-2025-004',
      priority: 'medium',
    },
    {
      id: '5',
      title: 'DD-8 Shipping',
      model: 'DD-8',
      customer: 'Equipment Share',
      stage: 'Shipping',
      color: 'bg-green-500',
      startDay: 1,
      span: 2,
      week: 1,
      row: 1,
      dateRange: 'Sun Jan 8 - Mon Jan 9, 2025',
      description: '8" Double Diaphragm ready for shipment',
      orderNumber: 'PO-2025-005',
      priority: 'high',
    },
    {
      id: '6',
      title: 'RL300 Fabrication',
      model: 'RL300',
      customer: 'Carter CAT',
      stage: 'Fabrication',
      color: 'bg-blue-500',
      startDay: 2,
      span: 2,
      week: 1,
      row: 2,
      dateRange: 'Mon Jan 9 - Tue Jan 10, 2025',
      description: '12" Rotary Lobe fabrication',
      orderNumber: 'PO-2025-006',
      priority: 'medium',
    },
    {
      id: '7',
      title: 'PP-150 Assembly',
      model: 'PP-150',
      customer: 'Ring Power CAT',
      stage: 'Assembly',
      color: 'bg-orange-500',
      startDay: 4,
      span: 3,
      week: 1,
      row: 3,
      dateRange: 'Wed Jan 11 - Fri Jan 13, 2025',
      description: '6" Piston Pump assembly',
      orderNumber: 'PO-2025-007',
      priority: 'low',
    },
    {
      id: '8',
      title: 'SIP-150 Powder Coat',
      model: 'SIP-150',
      customer: 'Thompson CAT',
      stage: 'Powder Coat',
      color: 'bg-purple-500',
      startDay: 0,
      span: 7,
      week: 2,
      row: 1,
      dateRange: 'Sun Jan 15 - Sat Jan 21, 2025',
      description: '6" Screw Impeller pump coating',
      orderNumber: 'PO-2025-008',
      priority: 'medium',
    },
    {
      id: '9',
      title: 'DP-150 Testing',
      model: 'DP-150',
      customer: 'Pioneer Pump',
      stage: 'Testing',
      color: 'bg-yellow-500',
      startDay: 3,
      span: 1,
      week: 2,
      row: 2,
      dateRange: 'Wed Jan 18, 2025',
      description: '6" Vacuum Assisted pump testing',
      orderNumber: 'PO-2025-009',
      priority: 'high',
    },
    {
      id: '10',
      title: 'HP-150 Not Started',
      model: 'HP-150',
      customer: 'SunState',
      stage: 'Not Started',
      color: 'bg-gray-400',
      startDay: 5,
      span: 2,
      week: 2,
      row: 3,
      dateRange: 'Fri Jan 20 - Sat Jan 21, 2025',
      description: '6" x 3" High Pressure pump scheduled',
      orderNumber: 'PO-2025-010',
      priority: 'low',
    },
  ];

  // Initialize events once
  if (scheduleEvents.length === 0) {
    setScheduleEvents(events);
  }

  const handleDragStart = (event: DragStartEvent) => {
    const draggedEvent = scheduleEvents.find(e => e.id === event.active.id);
    setActiveEvent(draggedEvent || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over) {
      const [weekIndex, dayIndex] = (over.id as string).split('-').map(Number);
      const draggedEvent = scheduleEvents.find(e => e.id === active.id);
      
      if (draggedEvent) {
        const newStartDay = dayIndex;
        const updatedEvents = scheduleEvents.map(e => 
          e.id === active.id 
            ? { ...e, startDay: newStartDay, week: weekIndex }
            : e
        );
        setScheduleEvents(updatedEvents);
      }
    }
    
    setActiveEvent(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex-1 overflow-auto bg-background">
        <div className="min-w-[1200px]">
          {/* Each week is a complete unit with headers and grid */}
          {weekHeaders.map((weekData, weekIndex) => (
            <div key={weekData.week} className="border-b last:border-b-0">
              {/* Week day headers - always visible with their grid */}
              <div className="sticky top-0 z-20 bg-card border-b">
                <div className="grid grid-cols-7 bg-muted/50">
                  {weekData.days.map((dayData, dayIndex) => {
                    const isNonWorking = isWeekend(dayIndex) || isHoliday(dayData.month || '', dayData.date);
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`p-2 text-center border-r last:border-r-0 ${
                          isNonWorking ? 'bg-muted/30' : ''
                        }`}
                      >
                        <div className={`text-xs ${isNonWorking ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
                          {dayData.day}
                        </div>
                        <div className={`text-sm font-medium ${
                          dayData.month ? 'text-primary' : ''
                        } ${isNonWorking ? 'opacity-60' : ''}`}>
                          {dayData.date}
                        </div>
                        {dayData.month && (
                          <div className={`text-xs ${isNonWorking ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
                            {dayData.month}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Week grid with events */}
              <div className="relative h-[200px]">
                {/* Grid cells - the day columns */}
                <div className="absolute inset-0 grid grid-cols-7">
                  {weekData.days.map((dayData, dayIndex) => {
                    const isNonWorking = isWeekend(dayIndex) || isHoliday(dayData.month || '', dayData.date);
                    return (
                      <DroppableCell 
                        key={`${weekIndex}-${dayIndex}`} 
                        weekIndex={weekIndex} 
                        dayIndex={dayIndex}
                        isNonWorking={isNonWorking}
                      />
                    );
                  })}
                </div>
                
                {/* Events positioned within this week */}
                {scheduleEvents
                  .filter((event) => event.week === weekIndex)
                  .map((event) => (
                    <DraggableEvent
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick(event)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <DragOverlay>
        {activeEvent ? (
          <div className="opacity-90">
            <ScheduleEventComponent event={activeEvent} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// Droppable cell component
function DroppableCell({ weekIndex, dayIndex, isNonWorking }: { weekIndex: number; dayIndex: number; isNonWorking: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${weekIndex}-${dayIndex}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`border-r last:border-r-0 transition-colors ${
        isNonWorking 
          ? 'bg-muted/20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,hsl(var(--muted)/0.1)_10px,hsl(var(--muted)/0.1)_20px)]'
          : isOver 
          ? 'bg-primary/10 ring-2 ring-primary/30' 
          : 'hover:bg-accent/50'
      }`}
    />
  );
}

// Draggable event wrapper
function DraggableEvent({ event, onClick }: { event: ScheduleEvent; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ScheduleEventComponent event={event} onClick={onClick} />
    </div>
  );
}
