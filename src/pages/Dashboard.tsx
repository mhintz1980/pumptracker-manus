// src/pages/Dashboard.tsx
import React from "react";
import { Pump } from "../types";
import { KpiStrip } from "../components/dashboard/KpiStrip";
import { WorkloadChart } from "../components/dashboard/WorkloadChart";
import { ValueChart } from "../components/dashboard/ValueChart";
import { CapacityChart } from "../components/dashboard/CapacityChart";
import { TrendChart } from "../components/dashboard/TrendChart";
import { PumpTable } from "../components/dashboard/PumpTable";

interface DashboardProps {
  pumps: Pump[];
  onSelectPump: (pump: Pump) => void;
}



export const Dashboard: React.FC<DashboardProps> = ({ pumps, onSelectPump }) => {

  return (
    <div className="space-y-6" data-testid="dashboard-view">
      {/* KPI Strip */}
      <KpiStrip pumps={pumps} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Workload Charts */}
        <WorkloadChart pumps={pumps} type="customer" />
        <WorkloadChart pumps={pumps} type="model" />

        {/* Value Charts */}
        <ValueChart pumps={pumps} type="customer" />
        <ValueChart pumps={pumps} type="model" />

        {/* Capacity Chart */}
        <CapacityChart pumps={pumps} />

        {/* Trend Chart */}
        <div className="md:col-span-2 lg:col-span-3">
          <TrendChart pumps={pumps} />
        </div>
      </div>

      {/* Pump Table */}
      <PumpTable pumps={pumps} onSelectPump={onSelectPump} />
    </div>
  );
};
