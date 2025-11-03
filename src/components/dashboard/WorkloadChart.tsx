// src/components/dashboard/WorkloadChart.tsx
import React from "react";
import { Pump } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface WorkloadChartProps {
  pumps: Pump[];
  type: 'customer' | 'model';
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
    };
    value: number;
  }>;
  type: 'customer' | 'model';
}


const buildCounts = (pumps: Pump[], type: 'customer' | 'model') => {
  const counts = pumps.reduce((acc, pump) => {
    const key = type === 'customer' ? pump.customer : pump.model;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 for better visualization
};

const CustomTooltip = ({ active, payload, type }: TooltipProps) => {
  if (active && payload && payload[0]) {
    return (
      <div className="bg-popover border border-border rounded-md shadow-lg p-2">
        <p className="text-sm font-medium">{payload[0].payload.name}</p>
        <p className="text-sm text-muted-foreground">
          {payload[0].value} {type === 'customer' ? 'pumps' : 'units'}
        </p>
      </div>
    );
  }
  return null;
};

export const WorkloadChart: React.FC<WorkloadChartProps> = ({ pumps, type }) => {
  const data = React.useMemo(() => buildCounts(pumps, type), [pumps, type]);

  const getChartColor = (index: number) => {
    const colors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="layer-l1">
        <CardHeader>
          <CardTitle className="text-lg">
            Workload by {type === 'customer' ? 'Customer' : 'Model'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getChartColor(index)}
                    stroke="hsl(var(--background))"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip type={type} />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
  );
};
