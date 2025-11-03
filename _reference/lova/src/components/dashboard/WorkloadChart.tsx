import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

interface WorkloadChartProps {
  type: 'customer' | 'model';
}

export const WorkloadChart = ({ type }: WorkloadChartProps) => {
  const getFilteredPumps = useStore((state) => state.getFilteredPumps);
  const pumps = getFilteredPumps();

  const data = pumps.reduce((acc, pump) => {
    const key = type === 'customer' ? pump.customer : pump.model;
    const existing = acc.find((item) => item.name === key);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: key, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <Card className="layer-l1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          Pumps by {type === 'customer' ? 'Customer' : 'Model'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 relative">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={95}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
