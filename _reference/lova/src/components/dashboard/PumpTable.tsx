import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const priorityColors = {
  LOW: 'bg-blue-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  URGENT: 'bg-red-500',
};

const stageLabels = {
  NOT_STARTED: 'Not Started',
  FABRICATION: 'Fabrication',
  POWDER_COAT: 'Powder Coat',
  ASSEMBLY: 'Assembly',
  TESTING: 'Testing',
  SHIPPING: 'Shipping',
};

export const PumpTable = () => {
  const getFilteredPumps = useStore((state) => state.getFilteredPumps);
  const purchaseOrders = useStore((state) => state.purchaseOrders);
  const [expandedPOs, setExpandedPOs] = useState<Set<string>>(new Set());

  const pumps = getFilteredPumps();

  const togglePO = (poId: string) => {
    const newExpanded = new Set(expandedPOs);
    if (newExpanded.has(poId)) {
      newExpanded.delete(poId);
    } else {
      newExpanded.add(poId);
    }
    setExpandedPOs(newExpanded);
  };

  const groupedByPO = pumps.reduce((acc, pump) => {
    if (!acc[pump.poId]) {
      acc[pump.poId] = [];
    }
    acc[pump.poId].push(pump);
    return acc;
  }, {} as Record<string, typeof pumps>);

  return (
    <Card className="layer-l1 md:col-span-2">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          Purchase Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>PO Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Promise Date</TableHead>
              <TableHead className="text-right">Total Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders.map((po) => {
              const poPumps = groupedByPO[po.id] || [];
              const isExpanded = expandedPOs.has(po.id);

              return (
                <>
                  <TableRow
                    key={po.id}
                    className="cursor-pointer"
                    onClick={() => togglePO(po.id)}
                  >
                    <TableCell>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{po.poNumber}</TableCell>
                    <TableCell>{po.customer}</TableCell>
                    <TableCell>{new Date(po.promiseDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">${po.totalValue.toLocaleString()}</TableCell>
                  </TableRow>
                  {isExpanded && poPumps.map((pump) => (
                    <TableRow key={pump.id} className="bg-muted/30">
                      <TableCell></TableCell>
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-2">
                          <div 
                            className={`h-2 w-2 rounded-full ${priorityColors[pump.priority]}`}
                          />
                          {pump.serialNumber}
                        </div>
                      </TableCell>
                      <TableCell>{pump.model}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{stageLabels[pump.stage]}</Badge>
                      </TableCell>
                      <TableCell className="text-right">${pump.value.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
