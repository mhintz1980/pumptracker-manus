// src/components/scheduling/AutoScheduleModal.tsx
import React, { useState } from 'react';
import { useApp } from '../../store';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface AutoScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const priorityOptions = [
  'Model',
  'Customer',
  'Purchase Order',
  'Priority',
  'Promise Date',
  'Best Fit',
] as const;

type PriorityOption = typeof priorityOptions[number];

export function AutoScheduleModal({ isOpen, onClose }: AutoScheduleModalProps) {
  const { autoSchedule } = useApp();
  const [selectedPriority, setSelectedPriority] = useState<PriorityOption>('Priority');

  if (!isOpen) return null;

  const handleSchedule = () => {
    autoSchedule(selectedPriority);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[hsl(var(--surface-100))] p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-white">Auto-Schedule Unscheduled Pumps</h3>
        <p className="mt-2 text-sm text-foreground/70">
          Select the prioritization method for scheduling all unscheduled pumps.
        </p>

        <div className="mt-6 space-y-3">
          {priorityOptions.map((option) => (
            <div
              key={option}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all",
                selectedPriority === option
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-white/10 hover:border-white/20"
              )}
              onClick={() => setSelectedPriority(option)}
            >
              <span className="font-medium text-white">{option}</span>
              {selectedPriority === option && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 13.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSchedule}>
            Schedule & Level
          </Button>
        </div>
      </div>
    </div>
  );
}
