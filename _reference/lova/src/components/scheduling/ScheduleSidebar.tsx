import { Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { UnscheduledPumpCard } from './UnscheduledPumpCard';
import { useStore } from '@/store/useStore';

// Mock unscheduled pumps - in real app would come from store
const unscheduledPumps = [
  {
    id: 'unsch-1',
    model: 'DD-4S',
    customer: 'ABC Equipment',
    poId: 'PO-2025-011',
    powderColor: 'Safety Yellow',
    value: 15000,
    promiseDate: '2025-01-25',
    priority: 'HIGH' as const,
  },
  {
    id: 'unsch-2',
    model: 'RL300',
    customer: 'XYZ Rentals',
    poId: 'PO-2025-012',
    powderColor: 'CAT Yellow',
    value: 28000,
    promiseDate: '2025-01-28',
    priority: 'URGENT' as const,
  },
  {
    id: 'unsch-3',
    model: 'HP-150',
    customer: 'Delta Services',
    poId: 'PO-2025-013',
    powderColor: 'John Deere Green',
    value: 22000,
    promiseDate: '2025-02-02',
    priority: 'MEDIUM' as const,
  },
  {
    id: 'unsch-4',
    model: 'SIP-150',
    customer: 'Prime Pump Co',
    poId: 'PO-2025-014',
    powderColor: 'Black',
    value: 19000,
    promiseDate: '2025-02-05',
    priority: 'LOW' as const,
  },
];

export function ScheduleSidebar() {
  const collapsedCards = useStore((state) => state.collapsedCards);
  const toggleCollapsedCards = useStore((state) => state.toggleCollapsedCards);

  return (
    <div className="w-[280px] border-r bg-card p-4 flex flex-col gap-4 overflow-y-auto">
      {/* Header with collapse toggle */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-base">Unscheduled Jobs</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleCollapsedCards}
        >
          {collapsedCards ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Unscheduled pump cards */}
      <div className="flex flex-col gap-2">
        {unscheduledPumps.map((pump) => (
          <UnscheduledPumpCard key={pump.id} pump={pump} collapsed={collapsedCards} />
        ))}
      </div>
    </div>
  );
}
