import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScheduleHeader } from '@/components/scheduling/ScheduleHeader';
import { ScheduleSidebar } from '@/components/scheduling/ScheduleSidebar';
import { ScheduleGrid } from '@/components/scheduling/ScheduleGrid';
import { ScheduleDetailPanel } from '@/components/scheduling/ScheduleDetailPanel';

export interface ScheduleEvent {
  id: string;
  title: string;
  model: string;
  customer: string;
  stage: string;
  color: string;
  startDay: number;
  span: number;
  week: number;
  row: number;
  dateRange: string;
  description: string;
  orderNumber: string;
  priority: 'low' | 'medium' | 'high';
}

const Scheduling = () => {
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [viewMode, setViewMode] = useState<'4weeks' | '6weeks'>('4weeks');

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
  };

  const handleClosePanel = () => {
    setSelectedEvent(null);
  };

  return (
    <motion.div
      className="h-[calc(100vh-80px)] flex flex-col bg-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ScheduleHeader viewMode={viewMode} onViewModeChange={setViewMode} />

      <div className="flex-1 flex overflow-hidden">
        <ScheduleSidebar />
        <ScheduleGrid 
          viewMode={viewMode} 
          onEventClick={handleEventClick} 
        />
        {selectedEvent && (
          <ScheduleDetailPanel event={selectedEvent} onClose={handleClosePanel} />
        )}
      </div>
    </motion.div>
  );
};

export default Scheduling;
