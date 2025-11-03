import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

interface ValueChartProps {
  type: 'customer' | 'model';
}

export const ValueChart = ({ type }: ValueChartProps) => {
  const purchaseOrders = useStore((state) => state.purchaseOrders);

  const data = purchaseOrders.reduce((acc, po) => {
    po.lineItems.forEach(item => {
      const key = type === 'customer' ? po.customer : item.model;
      const itemValue = item.value * item.quantity;
      const existing = acc.find((entry) => entry.name === key);
      if (existing) {
        existing.value += itemValue;
      } else {
        acc.push({ name: key, value: itemValue });
      }
    });
    return acc;
  }, [] as { name: string; value: number }[]);

  const formatValue = (value: number) => `$${(value / 1000).toFixed(0)}k`;

  return (
    <Card className="layer-l1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          PO Value by {type === 'customer' ? 'Customer' : 'Model'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11 }} 
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
            />
            <YAxis 
              tickFormatter={formatValue}
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
