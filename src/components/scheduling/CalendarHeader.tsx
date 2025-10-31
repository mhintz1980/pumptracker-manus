// src/components/scheduling/CalendarHeader.tsx
import { ChevronLeft, ChevronRight, RefreshCw, Plus, Search, HelpCircle } from 'lucide-react';
import { Button } from '../ui/Button';


export function CalendarHeader() {
  return (
    <div className="flex items-center justify-between border-b bg-card px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm">
          Today
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="min-w-[200px] justify-between">
          Aug 15 - Sep 11, 2021
          <ChevronRight className="h-4 w-4 ml-2 rotate-90" />
        </Button>
        <Button variant="outline" size="sm" className="min-w-[100px] justify-between">
          4 Weeks
          <ChevronRight className="h-4 w-4 ml-2 rotate-90" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Button size="icon" className="h-8 w-8 rounded-full bg-green-500 hover:bg-green-600">
          <Plus className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">Administrator</span>

        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-400 text-white font-bold text-sm">A</div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

