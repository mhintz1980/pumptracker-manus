// src/components/scheduling/CalendarHeader.tsx
import { ChevronLeft, ChevronRight, RefreshCw, Plus, Search, HelpCircle } from 'lucide-react';
import { useApp } from '../../store';
import { Button } from '../ui/Button';


interface CalendarHeaderProps {
  onAutoScheduleClick: () => void;
}

export function CalendarHeader({ onAutoScheduleClick }: CalendarHeaderProps) {
  const { clearSchedule, levelSchedule } = useApp();
  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-[hsl(var(--surface-200)_/_0.92)] px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-white/10">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-white/10">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-white/10">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="default" className="rounded-full px-5">
          Today
        </Button>
        <Button variant="outline" size="default" className="rounded-full px-5" onClick={levelSchedule}>
          Level
        </Button>
        <Button variant="outline" size="default" className="rounded-full px-5" onClick={onAutoScheduleClick}>
          Auto-schedule
        </Button>
        <Button variant="outline" size="default" className="rounded-full px-5" onClick={clearSchedule}>
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="default" className="min-w-[200px] justify-between rounded-full">
          Aug 15 - Sep 11, 2021
          <ChevronRight className="h-4 w-4 ml-2 rotate-90" />
        </Button>
        <Button variant="outline" size="default" className="min-w-[130px] justify-between rounded-full">
          4 Weeks
          <ChevronRight className="h-4 w-4 ml-2 rotate-90" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button size="icon" className="h-9 w-9 rounded-full bg-emerald-500 hover:brightness-110">
          <Plus className="h-4 w-4" />
        </Button>
        <span className="text-sm text-foreground/70">Administrator</span>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-sm shadow-glow">A</div>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-white/10">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-white/10">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
