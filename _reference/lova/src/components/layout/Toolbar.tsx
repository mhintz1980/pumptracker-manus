import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { useStore, Stage, Priority } from "@/store/useStore";
import { AddPOModal } from "@/components/modals/AddPOModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

/**
 * Toolbar - Persistent action bar below header
 * Contains filter controls and Add PO button
 */
export const Toolbar = () => {
  const [addPOOpen, setAddPOOpen] = useState(false);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const clearFilters = useStore((state) => state.clearFilters);
  const pumps = useStore((state) => state.pumps);

  const customers = [...new Set(pumps.map((p) => p.customer))];
  const models = [...new Set(pumps.map((p) => p.model))];
  const poNumbers = [...new Set(pumps.map((p) => p.poId))];

  const activeFilterCount = [
    filters.search,
    filters.po,
    filters.customer,
    filters.model,
    filters.stage,
    filters.priority,
  ].filter(Boolean).length;

  return (
    <motion.div 
      className="bg-card border-b border-border sticky top-16 z-40 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.28,
        delay: 0.1,
        ease: [0.2, 0.8, 0.2, 1]
      }}
    >
      <div className="container mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search POs, customers, models..."
            className="pl-9 h-9 rounded-full bg-muted/50 border-muted focus-visible:ring-primary"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>

        {/* PO Filter */}
        <motion.div
          whileHover={{ y: -1 }}
          transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Select
            value={filters.po || "all"}
            onValueChange={(value) => setFilters({ po: value === "all" ? "" : value })}
          >
            <SelectTrigger className="w-[140px] h-9 bg-muted/50 hover:bg-muted shadow-sm hover:shadow-md transition-all">
              <SelectValue placeholder="All POs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All POs</SelectItem>
              {poNumbers.map((po) => (
                <SelectItem key={po} value={po}>{po}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Customer Filter */}
        <motion.div
          whileHover={{ y: -1 }}
          transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Select
            value={filters.customer || "all"}
            onValueChange={(value) => setFilters({ customer: value === "all" ? "" : value })}
          >
            <SelectTrigger className="w-[160px] h-9 bg-muted/50 hover:bg-muted shadow-sm hover:shadow-md transition-all">
              <SelectValue placeholder="All Customers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer} value={customer}>{customer}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Model Filter */}
        <motion.div
          whileHover={{ y: -1 }}
          transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Select
            value={filters.model || "all"}
            onValueChange={(value) => setFilters({ model: value === "all" ? "" : value })}
          >
            <SelectTrigger className="w-[140px] h-9 bg-muted/50 hover:bg-muted shadow-sm hover:shadow-md transition-all">
              <SelectValue placeholder="All Models" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              {models.map((model) => (
                <SelectItem key={model} value={model}>{model}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Stage Filter */}
        <motion.div
          whileHover={{ y: -1 }}
          transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Select
            value={filters.stage || "all"}
            onValueChange={(value) => setFilters({ stage: value === "all" ? "" : (value as Stage) })}
          >
            <SelectTrigger className="w-[140px] h-9 bg-muted/50 hover:bg-muted shadow-sm hover:shadow-md transition-all">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="NOT_STARTED">Not Started</SelectItem>
              <SelectItem value="FABRICATION">Fabrication</SelectItem>
              <SelectItem value="POWDER_COAT">Powder Coat</SelectItem>
              <SelectItem value="ASSEMBLY">Assembly</SelectItem>
              <SelectItem value="TESTING">Testing</SelectItem>
              <SelectItem value="SHIPPING">Shipping</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Priority Filter */}
        <motion.div
          whileHover={{ y: -1 }}
          transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Select
            value={filters.priority || "all"}
            onValueChange={(value) => setFilters({ priority: value === "all" ? "" : (value as Priority) })}
          >
            <SelectTrigger className="w-[120px] h-9 bg-muted/50 hover:bg-muted shadow-sm hover:shadow-md transition-all">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <motion.div
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1.5 h-9 shadow-sm hover:shadow-md"
            >
              <X className="h-3.5 w-3.5" />
              Clear
              <Badge variant="secondary" className="ml-0.5 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            </Button>
          </motion.div>
        )}

        {/* Add PO Button */}
        <motion.div
          whileHover={{ y: -1, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Button 
            size="sm"
            className="ml-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-md hover:shadow-lg transition-all h-9"
            onClick={() => setAddPOOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add PO
          </Button>
        </motion.div>
      </div>

      <AddPOModal open={addPOOpen} onOpenChange={setAddPOOpen} />
    </motion.div>
  );
};
