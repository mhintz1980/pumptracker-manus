// src/components/toolbar/FilterBar.tsx
import React from "react";
import { useApp } from "../../store";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Priority, Stage } from "../../types";
import { X } from "lucide-react";

export function FilterBar() {
  const { filters, setFilters, clearFilters, pumps } = useApp();

  // Derive unique values from the dataset for dropdowns
  const uniquePOs = React.useMemo(() => [...new Set(pumps.map(p => p.po))].sort(), [pumps]);
  const uniqueCustomers = React.useMemo(() => [...new Set(pumps.map(p => p.customer))].sort(), [pumps]);
  const uniqueModels = React.useMemo(() => [...new Set(pumps.map(p => p.model))].sort(), [pumps]);

  const priorities: Priority[] = ["Low", "Normal", "High", "Rush", "Urgent"];
  const stages: Stage[] = ["NOT STARTED", "FABRICATION", "POWDER COAT", "ASSEMBLY", "TESTING", "SHIPPING", "CLOSED"];

  const selectClasses =
    "h-10 rounded-lg border border-white/12 bg-[hsl(var(--surface-200)_/_0.95)] px-3 text-sm text-foreground/90 shadow-soft transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/40";

  return (
    <div className="border-b border-white/5 bg-transparent">
      <div className="container mx-auto px-4 py-6">
        <div className="surface-panel shadow-frame border border-white/8 rounded-2xl px-4 py-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <Input
            type="text"
            placeholder="Search..."
            value={filters.q || ""}
            onChange={(e) => setFilters({ q: e.target.value })}
            className="w-56 border-white/10 bg-[hsl(var(--surface-200)_/_0.95)] placeholder:text-foreground/45"
          />

          {/* PO Filter */}
          <select
            value={filters.po || ""}
            onChange={(e) => setFilters({ po: e.target.value || undefined })}
            className={selectClasses}
          >
            <option value="">All POs</option>
            {uniquePOs.map(po => (
              <option key={po} value={po}>{po}</option>
            ))}
          </select>

          {/* Customer Filter */}
          <select
            value={filters.customer || ""}
            onChange={(e) => setFilters({ customer: e.target.value || undefined })}
            className={selectClasses}
          >
            <option value="">All Customers</option>
            {uniqueCustomers.map(customer => (
              <option key={customer} value={customer}>{customer}</option>
            ))}
          </select>

          {/* Model Filter */}
          <select
            value={filters.model || ""}
            onChange={(e) => setFilters({ model: e.target.value || undefined })}
            className={selectClasses}
          >
            <option value="">All Models</option>
            {uniqueModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority || ""}
            onChange={(e) => setFilters({ priority: (e.target.value as Priority) || undefined })}
            className={selectClasses}
          >
            <option value="">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>

          {/* Stage Filter */}
          <select
            value={filters.stage || ""}
            onChange={(e) => setFilters({ stage: (e.target.value as Stage) || undefined })}
            className={selectClasses}
          >
            <option value="">All Stages</option>
            {stages.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>

          {/* Clear Filters Button */}
          <Button
            variant="outline"
            size="default"
            onClick={clearFilters}
            className="ml-auto rounded-full"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
