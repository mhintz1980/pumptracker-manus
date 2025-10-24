// src/components/dashboard/OrderTable.tsx
import React from "react";
import { Pump } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { formatCurrency, formatDate } from "../../lib/format";

interface OrderTableProps {
  pumps: Pump[];
  onRowClick?: (pump: Pump) => void;
}

export function OrderTable({ pumps, onRowClick }: OrderTableProps) {
  const [sortField, setSortField] = React.useState<keyof Pump>("serial");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Pump) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedPumps = React.useMemo(() => {
    return [...pumps].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });
  }, [pumps, sortField, sortDirection]);

  const SortButton = ({ field, label }: { field: keyof Pump; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="font-medium text-left hover:text-primary transition-colors"
    >
      {label}
      {sortField === field && (
        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
      )}
    </button>
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-muted-foreground">
                <th className="text-left p-2"><SortButton field="serial" label="Serial" /></th>
                <th className="text-left p-2"><SortButton field="po" label="PO" /></th>
                <th className="text-left p-2"><SortButton field="customer" label="Customer" /></th>
                <th className="text-left p-2"><SortButton field="model" label="Model" /></th>
                <th className="text-left p-2"><SortButton field="stage" label="Stage" /></th>
                <th className="text-left p-2"><SortButton field="priority" label="Priority" /></th>
                <th className="text-left p-2"><SortButton field="value" label="Value" /></th>
                <th className="text-left p-2"><SortButton field="scheduledEnd" label="Scheduled End" /></th>
                <th className="text-left p-2"><SortButton field="last_update" label="Last Update" /></th>
              </tr>
            </thead>
            <tbody>
              {sortedPumps.map((pump) => (
                <tr
                  key={pump.id}
                  onClick={() => onRowClick?.(pump)}
                  className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <td className="p-2 font-mono">{pump.serial}</td>
                  <td className="p-2">{pump.po}</td>
                  <td className="p-2">{pump.customer}</td>
                  <td className="p-2">{pump.model}</td>
                  <td className="p-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {pump.stage}
                    </span>
                  </td>
                  <td className="p-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      pump.priority === "Urgent" || pump.priority === "Rush"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : pump.priority === "High"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {pump.priority}
                    </span>
                  </td>
                  <td className="p-2">{formatCurrency(pump.value)}</td>
                  <td className="p-2">{formatDate(pump.scheduledEnd)}</td>
                  <td className="p-2 text-muted-foreground">{formatDate(pump.last_update)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

