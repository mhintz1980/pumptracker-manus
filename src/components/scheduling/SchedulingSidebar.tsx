// src/components/scheduling/SchedulingSidebar.tsx
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../ui/Button";
import { useApp } from "../../store";
import { UnscheduledJobCard } from "./UnscheduledJobCard";

export function SchedulingSidebar() {
  const pumps = useApp((state) => state.pumps);
  const collapsedCards = useApp((state) => state.collapsedCards);
  const toggleCollapsedCards = useApp((state) => state.toggleCollapsedCards);

  const unscheduledPumps = pumps.filter(
    (pump) => pump.stage === "UNSCHEDULED"
  );

  return (
    <aside
      className="flex h-full w-[280px] flex-col border-r border-border bg-card"
      data-testid="scheduling-sidebar"
    >
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Unscheduled Jobs</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleCollapsedCards}
        >
          {collapsedCards ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
      </header>

      <div className="flex-1 overflow-hidden px-3 py-4">
        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
          {unscheduledPumps.map((pump) => (
            <UnscheduledJobCard key={pump.id} pump={pump} collapsed={collapsedCards} />
          ))}
          {unscheduledPumps.length === 0 && (
            <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
              All pumps scheduled—nice!
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
