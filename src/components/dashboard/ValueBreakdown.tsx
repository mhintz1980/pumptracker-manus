// src/components/dashboard/ValueBreakdown.tsx
import React from "react";
import { Pump } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatCurrency } from "../../lib/format";

interface TooltipPayload {
  name: string;
  value: number;
  payload: { percent: string };
}

interface ValueBreakdownProps {
  pumps: Pump[];
}

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#4f46e5'];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-xs text-muted-foreground">
          {payload[0].payload.percent}%
        </p>
      </div>
    );
  }
  return null;
};

export function ValueBreakdown({ pumps }: ValueBreakdownProps) {
  // Value by Customer
  const customerValue = React.useMemo(() => {
    const values = pumps.reduce((acc, p) => {
      acc[p.customer] = (acc[p.customer] || 0) + p.value;
      return acc;
    }, {} as Record<string, number>);
    
    const total = Object.values(values).reduce((sum, v) => sum + v, 0);
    
    return Object.entries(values)
      .map(([name, value]) => ({ 
        name, 
        value,
        percent: total > 0 ? ((value / total) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.value - a.value);
  }, [pumps]);

  // Value by Model
  const modelValue = React.useMemo(() => {
    const values = pumps.reduce((acc, p) => {
      acc[p.model] = (acc[p.model] || 0) + p.value;
      return acc;
    }, {} as Record<string, number>);
    
    const total = Object.values(values).reduce((sum, v) => sum + v, 0);
    
    return Object.entries(values)
      .map(([name, value]) => ({ 
        name, 
        value,
        percent: total > 0 ? ((value / total) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.value - a.value);
  }, [pumps]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Value by Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={customerValue}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
              >
                {customerValue.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: { payload: TooltipPayload }) => `${value}: ${formatCurrency(entry.payload.value)}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Value by Model</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={modelValue}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
              >
                {modelValue.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: { payload: TooltipPayload }) => `${value}: ${formatCurrency(entry.payload.value)}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

