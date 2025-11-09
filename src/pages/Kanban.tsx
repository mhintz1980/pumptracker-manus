// src/pages/Kanban.tsx
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { KanbanBoard } from "../components/kanban/KanbanBoard";
import type { Pump } from "../types";
import { useApp } from "../store";

interface KanbanProps {
  pumps: Pump[];
  onSelectPump?: (pump: Pump) => void;
}

export const Kanban = ({ pumps, onSelectPump }: KanbanProps) => {
  const collapsedCards = useApp((state) => state.collapsedCards);
  const toggleCollapsedCards = useApp((state) => state.toggleCollapsedCards);

  return (
    <div className="flex h-full flex-col gap-3" data-testid="kanban-view">
      <div className="flex items-center gap-2 text-xs text-muted-foreground" style={{ marginTop: "-10px" }}>
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
      </div>

      <div className="flex-1">
        <KanbanBoard pumps={pumps} collapsed={collapsedCards} onCardClick={onSelectPump} />
      </div>
    </div>
  );
};
