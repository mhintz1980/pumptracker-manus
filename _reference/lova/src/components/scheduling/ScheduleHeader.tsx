import { ChevronLeft, ChevronRight, RefreshCw, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
interface ScheduleHeaderProps {
  viewMode: '4weeks' | '6weeks';
  onViewModeChange: (mode: '4weeks' | '6weeks') => void;
}
export function ScheduleHeader({
  viewMode,
  onViewModeChange
}: ScheduleHeaderProps) {
  return <div className="flex items-center justify-between border-b bg-card px-6 py-3">
      

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="min-w-[200px] justify-between">
          <Calendar className="h-4 w-4 mr-2" />
          Jan 1 - Jan 28, 2025
          <ChevronRight className="h-4 w-4 ml-2 rotate-90" />
        </Button>
        <Select value={viewMode} onValueChange={value => onViewModeChange(value as '4weeks' | '6weeks')}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4weeks">4 Weeks</SelectItem>
            <SelectItem value="6weeks">6 Weeks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Schedule
        </Button>
      </div>
    </div>;
}