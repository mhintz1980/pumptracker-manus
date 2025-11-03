// src/components/toolbar/FilterBar.tsx
import { useMemo } from "react";
import { X, Search } from "lucide-react";
import { useApp } from "../../store";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import type { Priority, Stage } from "../../types";
import { cn } from "../../lib/utils";

interface FilterBarProps {
  className?: string;
}

export function FilterBar({ className }: FilterBarProps) {
  const { filters, setFilters, clearFilters, pumps } = useApp();

  const uniquePOs = useMemo(
    () => [...new Set(pumps.map((p) => p.po))].sort(),
    [pumps]
  );
  const uniqueCustomers = useMemo(
    () => [...new Set(pumps.map((p) => p.customer))].sort(),
    [pumps]
  );
  const uniqueModels = useMemo(
    () => [...new Set(pumps.map((p) => p.model))].sort(),
    [pumps]
  );

  const priorities: Priority[] = ["Low", "Normal", "High", "Rush", "Urgent"];
  const stages: Stage[] = [
    "NOT STARTED",
    "FABRICATION",
    "POWDER COAT",
    "ASSEMBLY",
    "TESTING",
    "SHIPPING",
    "CLOSED",
  ];

  const activeFilterCount = [
    filters.q,
    filters.po,
    filters.customer,
    filters.model,
    filters.priority,
    filters.stage,
  ].filter(Boolean).length;

  const selectClasses =
    "h-9 rounded-full border border-border bg-muted/60 px-3 text-xs font-medium text-muted-foreground transition-colors shadow-layer-sm hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/40";

  return (
    <div className={cn("flex w-full flex-wrap items-center gap-3", className)}>
      <div className="relative min-w-[220px] flex-1 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search POs, customers, models..."
          value={filters.q || ""}
          onChange={(event) => setFilters({ q: event.target.value })}
          className="h-9 rounded-full border-muted/80 bg-muted/50 pl-9 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-primary/40"
        />
      </div>

      <select
        value={filters.po || ""}
        onChange={(event) =>
          setFilters({ po: event.target.value || undefined })
        }
        className={selectClasses}
      >
        <option value="">All POs</option>
        {uniquePOs.map((po) => (
          <option key={po} value={po}>
            {po}
          </option>
        ))}
      </select>

      <select
        value={filters.customer || ""}
        onChange={(event) =>
          setFilters({ customer: event.target.value || undefined })
        }
        className={selectClasses}
      >
        <option value="">All Customers</option>
        {uniqueCustomers.map((customer) => (
          <option key={customer} value={customer}>
            {customer}
          </option>
        ))}
      </select>

      <select
        value={filters.model || ""}
        onChange={(event) =>
          setFilters({ model: event.target.value || undefined })
        }
        className={selectClasses}
      >
        <option value="">All Models</option>
        {uniqueModels.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>

      <select
        value={filters.priority || ""}
        onChange={(event) =>
          setFilters({
            priority: (event.target.value as Priority) || undefined,
          })
        }
        className={selectClasses}
      >
        <option value="">All Priorities</option>
        {priorities.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select>

      <select
        value={filters.stage || ""}
        onChange={(event) =>
          setFilters({ stage: (event.target.value as Stage) || undefined })
        }
        className={selectClasses}
      >
        <option value="">All Stages</option>
        {stages.map((stage) => (
          <option key={stage} value={stage}>
            {stage}
          </option>
        ))}
      </select>

      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="ml-auto gap-1.5 rounded-full border border-border/70 bg-muted/40 px-4 text-xs font-semibold text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Clear
          <Badge className="ml-1 h-5 w-5 -translate-y-[1px] rounded-full border-none bg-primary/90 text-primary-foreground">
            {activeFilterCount}
          </Badge>
        </Button>
      )}
    </div>
  );
}
