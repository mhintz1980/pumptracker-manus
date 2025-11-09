// src/components/scheduling/CalendarHeader.tsx
import { Button } from "../ui/Button";

export function CalendarHeader() {
  return (
    <div
      className="flex items-center justify-end gap-3 border-b border-border bg-card px-6 py-4"
      data-testid="calendar-header"
    >
      <Button variant="outline" size="sm" className="rounded-full px-5">
        Level
      </Button>
      <Button variant="outline" size="sm" className="rounded-full px-5">
        Auto-Schedule
      </Button>
      <Button variant="outline" size="sm" className="rounded-full px-5">
        Clear
      </Button>
    </div>
  );
}
