// src/components/dashboard/PumpTable.tsx
import React, { useState } from "react";
import { Pump, Priority } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { ChevronRight, Package, Calendar } from "lucide-react";

interface PumpTableProps {
  pumps: Pump[];
  onSelectPump: (pump: Pump) => void;
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case "Urgent":
    case "Rush":
      return "bg-destructive/15 text-destructive border-destructive/30";
    case "High":
      return "bg-orange-500/15 text-orange-700 border-orange-500/30";
    default:
      return "bg-muted/50 text-muted-foreground border-muted/70";
  }
};

const getStageColor = (stage: string) => {
  const stageColors = {
    "NOT STARTED": "bg-muted text-muted-foreground",
    "FABRICATION": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "POWDER COAT": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    "ASSEMBLY": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "TESTING": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    "SHIPPING": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    "CLOSED": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  };
  return stageColors[stage as keyof typeof stageColors] || "bg-muted text-muted-foreground";
};

export const PumpTable: React.FC<PumpTableProps> = ({ pumps, onSelectPump }) => {
  const [expandedPOs, setExpandedPOs] = useState<Set<string>>(new Set());

  // Group pumps by PO
  const groupedByPO = React.useMemo(() => {
    return pumps.reduce((groups, pump) => {
      const po = pump.po;
      if (!groups[po]) {
        groups[po] = [];
      }
      groups[po].push(pump);
      return groups;
    }, {} as Record<string, Pump[]>);
  }, [pumps]);

  // Sort POs by total value (descending)
  const sortedPOs = React.useMemo(() => {
    return Object.entries(groupedByPO)
      .map(([po, poPumps]) => ({
        po,
        pumps: poPumps,
        totalValue: poPumps.reduce((sum, p) => sum + p.value, 0),
        completedCount: poPumps.filter(p => p.stage === "CLOSED").length,
      }))
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [groupedByPO]);

  const togglePO = (po: string) => {
    setExpandedPOs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(po)) {
        newSet.delete(po);
      } else {
        newSet.add(po);
      }
      return newSet;
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="layer-l1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Purchase Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedPOs.map(({ po, pumps: poPumps, totalValue, completedCount }) => {
              const isExpanded = expandedPOs.has(po);

              return (
                <div
                  key={po}
                >
                  <div
                    className="layer-l2 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => togglePO(po)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`inline-block transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{po}</div>
                          <div className="text-sm text-muted-foreground">
                            {poPumps[0].customer} • {poPumps.length} pumps
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(totalValue)}</div>
                          <div className="text-xs text-muted-foreground">
                            {completedCount}/{poPumps.length} completed
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2">
                      {poPumps.map((pump) => (
                        <div
                          key={pump.id}
                          className="layer-l3 p-3 cursor-pointer hover:bg-accent/30 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPump(pump);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="font-medium text-sm">{pump.model}</div>
                                <div className="text-xs text-muted-foreground">
                                  #{pump.serial} • {formatCurrency(pump.value)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(pump.priority)}`}>
                                {pump.priority}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStageColor(pump.stage)}`}>
                                {pump.stage}
                              </span>
                            </div>
                          </div>

                          {pump.scheduledEnd && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(pump.scheduledEnd).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {sortedPOs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No purchase orders found</p>
            </div>
          )}
        </CardContent>
      </Card>
  );
};