import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface KpiWidgetProps {
  title: string;
  value: number;
  unit?: string;
  icon?: LucideIcon;
  format?: "number" | "currency";
}

/**
 * KpiWidget - Individual KPI card with animated value reveal
 * Features hover effects and numeric animation
 */
export const KpiWidget = ({ 
  title, 
  value, 
  unit = "", 
  icon: Icon,
  format = "number"
}: KpiWidgetProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimationControls();

  useEffect(() => {
    // Animate number counting up
    const duration = 1000; // 1 second
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val: number) => {
    if (format === "currency") {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    
    if (Number.isInteger(value)) {
      return Math.round(val).toString();
    }
    
    return val.toFixed(1);
  };

  return (
    <motion.div
      className="layer-l1 p-5 relative overflow-hidden group cursor-default"
      whileHover={{ 
        y: -2, 
        scale: 1.01,
        transition: { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      {/* Background Gradient on Hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Content */}
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="mb-3">
            <Icon className="w-5 h-5 text-primary" strokeWidth={2} />
          </div>
        )}

        {/* Title */}
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          {title}
        </h3>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          <motion.span 
            className="text-2xl md:text-3xl font-bold text-foreground tabular-nums"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ 
              duration: 0.4,
              delay: 0.2,
              ease: [0.2, 0.8, 0.2, 1]
            }}
          >
            {format === "currency" ? "" : formatValue(displayValue)}
          </motion.span>
          {format === "currency" ? (
            <span className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
              {formatValue(displayValue)}
            </span>
          ) : null}
          {unit && (
            <span className="text-sm font-medium text-muted-foreground ml-1">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Accent Border on Hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
      />
    </motion.div>
  );
};
