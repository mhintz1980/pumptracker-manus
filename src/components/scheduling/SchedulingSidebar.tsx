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
    <div className="w-[300px] border-r bg-muted/20 flex flex-col h-full p-4">
      <Card className="flex flex-col h-full">
        <CardHeader className="py-3 border-b">
          <CardTitle className="text-lg flex justify-between items-center">
            Unscheduled Jobs
            <span className="text-sm font-normal text-muted-foreground">
              {unscheduledPumps.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 flex-1 overflow-hidden">
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

