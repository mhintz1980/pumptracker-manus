import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const capacityData = [
  {
    name: 'Capacity',
    value: 75,
    fill: 'hsl(var(--primary))',
  },
];

export const CapacityChart = () => {
  return (
    <Card className="layer-l1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          Weekly Capacity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center pt-2 relative">
        <ResponsiveContainer width="100%" height={240}>
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="55%" 
            outerRadius="100%" 
            barSize={32} 
            data={capacityData}
          >
            <RadialBar
              background
              dataKey="value"
              cornerRadius={10}
            />
            <Legend 
              iconSize={10} 
              layout="vertical" 
              verticalAlign="middle" 
              content={() => (
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground">75%</div>
                  <div className="text-sm text-muted-foreground mt-1">Utilized</div>
                </div>
              )}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
