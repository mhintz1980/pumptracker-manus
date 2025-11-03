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

  const metrics = [
    {
      label: "Avg Build Time",
      value: `${round(avgBuildDays, 1)} days`,
      helper: closed.length ? `Across ${closed.length} closed pumps` : "No closed pumps yet",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      label: "Shop Efficiency",
      value: `${round(shopEfficiency, 1)}%`,
      helper: `${closed.length} of ${pumps.length || 0} pumps closed`,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
      borderColor: "border-emerald-200 dark:border-emerald-800"
    },
    {
      label: "On-time Orders",
      value: `${onTime.length}`,
      helper: closed.length ? `${onTime.length} closed on schedule` : "Monitoring active jobs",
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/50",
      borderColor: "border-cyan-200 dark:border-cyan-800"
    },
    {
      label: "Late Orders",
      value: `${lateOpen.length}`,
      helper: lateOpen.length ? `${lateOpen.length} require attention` : "All jobs on pace",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-950/50",
      borderColor: "border-rose-200 dark:border-rose-800"
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className={`layer-l1 ${metric.bgColor} ${metric.borderColor} border-2`}>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium">
                {metric.label}
              </div>
              <div className={`text-2xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {metric.helper}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}