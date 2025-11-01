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
      className="flex items-center gap-1 text-xs font-semibold tracking-wide uppercase text-foreground/55 transition-colors hover:text-white"
    >
      {label}
      {sortField === field && (
        <span className="text-[10px]">{sortDirection === "asc" ? "▲" : "▼"}</span>
      )}
    </button>
  );

  const priorityBadgeClasses = (priority: Pump["priority"]) => {
    switch (priority) {
      case "Urgent":
      case "Rush":
        return "bg-rose-500/20 text-rose-200";
      case "High":
        return "bg-amber-500/20 text-amber-200";
      default:
        return "bg-white/12 text-white/80";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="text-lg text-white">Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-2xl border border-white/8">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="p-3 text-left"><SortButton field="serial" label="Serial" /></th>
                <th className="p-3 text-left"><SortButton field="po" label="PO" /></th>
                <th className="p-3 text-left"><SortButton field="customer" label="Customer" /></th>
                <th className="p-3 text-left"><SortButton field="model" label="Model" /></th>
                <th className="p-3 text-left"><SortButton field="stage" label="Stage" /></th>
                <th className="p-3 text-left"><SortButton field="priority" label="Priority" /></th>
                <th className="p-3 text-left"><SortButton field="value" label="Value" /></th>
                <th className="p-3 text-left"><SortButton field="scheduledEnd" label="Scheduled End" /></th>
                <th className="p-3 text-left"><SortButton field="last_update" label="Last Update" /></th>
              </tr>
            </thead>
            <tbody>
              {sortedPumps.map((pump) => (
                <tr
                  key={pump.id}
                  onClick={() => onRowClick?.(pump)}
                  className="border-b border-white/5 bg-white/0 transition-colors hover:bg-white/8 cursor-pointer"
                >
                  <td className="p-3 font-mono text-foreground/80">{pump.serial}</td>
                  <td className="p-3 text-foreground/85">{pump.po}</td>
                  <td className="p-3 text-foreground/85">{pump.customer}</td>
                  <td className="p-3 text-foreground/85">{pump.model}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-full bg-white/12 px-3 py-1 text-[11px] font-medium text-white/80">
                      {pump.stage}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${priorityBadgeClasses(pump.priority)}`}>
                      {pump.priority}
                    </span>
                  </td>
                  <td className="p-3 text-white">{formatCurrency(pump.value)}</td>
                  <td className="p-3 text-foreground/75">{formatDate(pump.scheduledEnd)}</td>
                  <td className="p-3 text-foreground/55">{formatDate(pump.last_update)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
