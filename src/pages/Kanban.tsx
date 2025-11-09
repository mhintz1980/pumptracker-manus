// src/pages/Kanban.tsx
import { Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { KanbanBoard } from "../components/kanban/KanbanBoard";
import type { Pump } from "../types";
import { SortKey, useApp } from "../store";
import { WipLimitPanel } from "../components/kanban/WipLimitPanel";

interface KanbanProps {
  pumps: Pump[];
  onSelectPump?: (pump: Pump) => void;
}

export const Kanban = ({ pumps, onSelectPump }: KanbanProps) => {
  const collapsedCards = useApp((state) => state.collapsedCards);
  const toggleCollapsedCards = useApp((state) => state.toggleCollapsedCards);
  const sortKey = useApp((state) => state.sortKey ?? "priority");
  const setSortKey = useApp((state) => state.setSortKey);
  const [showWipPanel, setShowWipPanel] = useState(false);

  const sortOptions: { value: SortKey; label: string }[] = [
    { value: "priority", label: "Priority" },
    { value: "model", label: "Model" },
    { value: "customer", label: "Customer" },
    { value: "po", label: "PO" },
    { value: "last_update", label: "Last Update" },
  ];

  return (
    <div className="flex h-full flex-col gap-3" data-testid="kanban-view">
      <div className="relative flex flex-wrap items-center gap-3 text-xs text-muted-foreground" style={{ marginTop: "-10px" }}>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full border border-border bg-card shadow-layer-md"
          onClick={toggleCollapsedCards}
          title={collapsedCards ? "Expand cards" : "Collapse cards"}
        >
          {collapsedCards ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
        </Button>
        <p>Drag pumps between stages to update their status</p>
        <div className="flex flex-1 items-center justify-end gap-2 text-[11px] font-semibold">
          <label className="flex items-center gap-1 text-muted-foreground">
            Sort by
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className="rounded-lg border border-border bg-card px-2 py-1 text-foreground"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <Button variant="ghost" size="sm" onClick={() => setShowWipPanel((value) => !value)}>
            Edit WIP limits
          </Button>
        </div>
        <WipLimitPanel open={showWipPanel} onClose={() => setShowWipPanel(false)} />
      </div>

      <div className="flex-1">
        <KanbanBoard
          pumps={pumps}
          collapsed={collapsedCards}
          onCardClick={onSelectPump}
          sortKey={sortKey}
        />
      </div>
    </div>
  );
};
