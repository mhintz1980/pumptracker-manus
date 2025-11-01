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
      accent: "from-sky-500/30 via-sky-400/10 to-transparent"
    },
    {
      label: "Shop Efficiency",
      value: `${round(shopEfficiency, 1)}%`,
      helper: `${closed.length} of ${pumps.length || 0} pumps closed`,
      accent: "from-emerald-500/25 via-emerald-400/10 to-transparent"
    },
    {
      label: "On-time Orders",
      value: `${onTime.length}`,
      helper: closed.length ? `${onTime.length} closed on schedule` : "Monitoring active jobs",
      accent: "from-blue-500/25 via-blue-400/10 to-transparent"
    },
    {
      label: "Late Orders",
      value: `${lateOpen.length}`,
      helper: lateOpen.length ? `${lateOpen.length} require attention` : "All jobs on pace",
      accent: "from-rose-500/30 via-rose-400/10 to-transparent"
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="relative overflow-hidden">
          <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${metric.accent}`}></div>
          <CardContent className="relative p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-foreground/55 mb-3">
              {metric.label}
            </div>
            <div className="text-3xl font-semibold text-white">
              {metric.value}
            </div>
            <div className="mt-3 text-xs text-foreground/60">
              {metric.helper}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
