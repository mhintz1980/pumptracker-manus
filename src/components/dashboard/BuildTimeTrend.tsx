// src/components/dashboard/BuildTimeTrend.tsx
import React from "react";
import { Pump } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { round } from "../../lib/format";

interface BuildTimeTrendProps {
  pumps: Pump[];
}

function getWeekNumber(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `W${weekNo}`;
}

function diffDays(pump: Pump): number {
  if (!pump.scheduledEnd) return 0;
  const start = new Date(pump.last_update);
  const end = new Date(pump.scheduledEnd);
  return Math.abs((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function BuildTimeTrend({ pumps }: BuildTimeTrendProps) {
  const weeklyData = React.useMemo(() => {
    const closed = pumps.filter(p => p.stage === "CLOSED" && p.scheduledEnd);
    
    // Group by week
    const byWeek = closed.reduce((acc, pump) => {
      const week = getWeekNumber(new Date(pump.last_update));
      if (!acc[week]) {
        acc[week] = { week, total: 0, count: 0 };
      }
      acc[week].total += diffDays(pump);
      acc[week].count += 1;
      return acc;
    }, {} as Record<string, { week: string; total: number; count: number }>);

    // Calculate averages
    return Object.values(byWeek)
      .map(({ week, total, count }) => ({
        week,
        avgDays: round(total / count, 1),
      }))
      .sort((a, b) => {
        const aNum = parseInt(a.week.substring(1));
        const bNum = parseInt(b.week.substring(1));
        return aNum - bNum;
      })
      .slice(-12); // Last 12 weeks
  }, [pumps]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Build Time Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="week" 
              className="text-xs text-muted-foreground"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              className="text-xs text-muted-foreground"
              tick={{ fill: 'currentColor' }}
              label={{ value: 'Days', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area 
              type="monotone" 
              dataKey="avgDays" 
              stroke="#2563eb" 
              strokeWidth={2}
              fill="url(#colorAvg)"
              name="Avg Build Time (days)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

