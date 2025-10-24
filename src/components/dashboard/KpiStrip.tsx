// src/components/dashboard/KpiStrip.tsx
import { Pump } from "../../types";
import { Card, CardContent } from "../ui/Card";
import { round } from "../../lib/format";

interface KpiStripProps {
  pumps: Pump[];
}

function diffDays(pump: Pump): number {
  if (!pump.scheduledEnd) return 0;
  const start = new Date(pump.last_update);
  const end = new Date(pump.scheduledEnd);
  return Math.abs((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function KpiStrip({ pumps }: KpiStripProps) {
  const closed = pumps.filter(p => p.stage === "CLOSED");
  const onTime = closed.filter(p => !p.scheduledEnd || new Date(p.last_update) <= new Date(p.scheduledEnd));
  const lateOpen = pumps.filter(p => p.scheduledEnd && new Date() > new Date(p.scheduledEnd) && p.stage !== "CLOSED");
  
  const avgBuildDays = closed.length > 0
    ? closed.reduce((sum, p) => sum + diffDays(p), 0) / closed.length
    : 0;
  
  const shopEfficiency = pumps.length > 0 ? (closed.length / pumps.length) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Avg Build Time</div>
          <div className="text-3xl font-bold">{round(avgBuildDays, 1)} days</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Shop Efficiency</div>
          <div className="text-3xl font-bold">{round(shopEfficiency, 1)}%</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground mb-1">On-time Orders</div>
          <div className="text-3xl font-bold text-green-600">{onTime.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Late Orders</div>
          <div className="text-3xl font-bold text-red-600">{lateOpen.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}

