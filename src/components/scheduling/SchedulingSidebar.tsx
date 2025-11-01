// src/components/scheduling/SchedulingSidebar.tsx
import { useApp } from "../../store";
import { UnscheduledJobCard } from "./UnscheduledJobCard";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { ScrollArea } from "../ui/ScrollArea";


export function SchedulingSidebar() {
  const { pumps } = useApp();
  const unscheduledPumps = pumps.filter(
    (p) => p.stage === "NOT STARTED" || p.stage === "FABRICATION"
  ); // Assuming NOT STARTED and FABRICATION are unscheduled/backlog

  return (
    <div className="w-[300px] border-r border-white/10 bg-[hsl(var(--surface-100)_/_0.7)] backdrop-blur flex flex-col h-full p-4">
      <Card className="flex h-full flex-col">
        <CardHeader className="border-b border-white/10 py-4">
          <CardTitle className="flex items-center justify-between text-base text-white">
            Unscheduled Jobs
            <span className="text-sm font-normal text-foreground/60">
              {unscheduledPumps.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-3">
          <ScrollArea className="h-full pr-3">
            <div className="space-y-3">
              {unscheduledPumps.map((pump) => (
                <UnscheduledJobCard key={pump.id} pump={pump} />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
