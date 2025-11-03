import { motion } from "framer-motion";
import { KpiWidget } from "./KpiWidget";
import { Clock, CheckCircle2, Gauge, TrendingUp, DollarSign } from "lucide-react";
import { useStore } from "@/store/useStore";

/**
 * KpiStrip - Horizontal strip of key performance indicator widgets
 * Displays critical metrics with staggered entry animations
 */
export const KpiStrip = () => {
  const getFilteredPumps = useStore((state) => state.getFilteredPumps);
  const pumps = getFilteredPumps();

  const totalValue = pumps.reduce((sum, pump) => sum + pump.value, 0);
  const shippingCount = pumps.filter((p) => p.stage === "SHIPPING").length;

  const kpis = [
    {
      title: "Avg Build Time",
      value: 12.5,
      unit: "days",
      icon: Clock,
    },
    {
      title: "On-Time %",
      value: 92,
      unit: "%",
      icon: CheckCircle2,
    },
    {
      title: "Shop Efficiency",
      value: 87,
      unit: "%",
      icon: Gauge,
    },
    {
      title: "Pumps Shipping",
      value: shippingCount,
      unit: "pumps",
      icon: TrendingUp,
    },
    {
      title: "Total Value",
      value: totalValue,
      unit: "$",
      icon: DollarSign,
      format: "currency" as const
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.28,
            delay: 0.15 + index * 0.05,
            ease: [0.2, 0.8, 0.2, 1]
          }}
        >
          <KpiWidget {...kpi} />
        </motion.div>
      ))}
    </div>
  );
};
