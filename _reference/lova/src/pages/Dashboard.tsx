import { motion } from "framer-motion";
import { KpiStrip } from "@/components/dashboard/KpiStrip";
import { WorkloadChart } from "@/components/dashboard/WorkloadChart";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { CapacityChart } from "@/components/dashboard/CapacityChart";
import { ValueChart } from "@/components/dashboard/ValueChart";
import { PumpTable } from "@/components/dashboard/PumpTable";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/card";

/**
 * Dashboard Page - Main overview with KPIs, charts, and pump tracking
 * Entry point for the application
 */
const Dashboard = () => {
  const purchaseOrders = useStore((state) => state.purchaseOrders);
  
  const totalPOValue = purchaseOrders.reduce((sum, po) => {
    return sum + po.totalValue;
  }, 0);

  return (
    <motion.div
      className="container mx-auto px-4 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.32,
        ease: [0.2, 0.8, 0.2, 1]
      }}
    >
      {/* KPI Strip */}
      <KpiStrip />

      {/* Dashboard Widgets */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total PO Value */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Card className="layer-l1 p-6">
            <div className="text-sm font-semibold text-muted-foreground mb-2">Total PO Value</div>
            <div className="text-4xl font-bold text-foreground">${(totalPOValue / 1000).toFixed(0)}k</div>
            <div className="text-xs text-muted-foreground mt-1">{purchaseOrders.length} Active Orders</div>
          </Card>
        </motion.div>

        {/* Pumps by Customer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <WorkloadChart type="customer" />
        </motion.div>

        {/* Pumps by Model */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <WorkloadChart type="model" />
        </motion.div>

        {/* Trend Chart */}
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <TrendChart />
        </motion.div>

        {/* Capacity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <CapacityChart />
        </motion.div>

        {/* Value by Customer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <ValueChart type="customer" />
        </motion.div>

        {/* Value by Model */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <ValueChart type="model" />
        </motion.div>

        {/* PO List */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28, delay: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <PumpTable />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
