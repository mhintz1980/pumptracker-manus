// src/pages/Dashboard.tsx
import React from "react";
import { Pump } from "../types";
import { KpiStrip } from "../components/dashboard/KpiStrip";
import { WorkloadChart } from "../components/dashboard/WorkloadChart";
import { ValueChart } from "../components/dashboard/ValueChart";
import { CapacityChart } from "../components/dashboard/CapacityChart";
import { TrendChart } from "../components/dashboard/TrendChart";
import { PumpTable } from "../components/dashboard/PumpTable";
import { useApp } from "../store";

interface DashboardProps {
  pumps: Pump[];
  onSelectPump: (pump: Pump) => void;
}



export const Dashboard: React.FC<DashboardProps> = ({
  pumps,
  onSelectPump,
}) => {
  const collapsed = useApp((state) => state.collapsedCards);

  return (
    <div className="space-y-6" data-testid="dashboard-view">
      <KpiStrip pumps={pumps} compact={collapsed} />

      {!collapsed && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <WorkloadChart pumps={pumps} type="customer" />
          <WorkloadChart pumps={pumps} type="model" />
          <ValueChart pumps={pumps} type="customer" />
          <ValueChart pumps={pumps} type="model" />
          <CapacityChart pumps={pumps} />
          <div className="md:col-span-2 lg:col-span-3">
            <TrendChart pumps={pumps} />
          </div>
        </div>
      )}

      <PumpTable pumps={pumps} onSelectPump={onSelectPump} />
    </div>
  );
};
