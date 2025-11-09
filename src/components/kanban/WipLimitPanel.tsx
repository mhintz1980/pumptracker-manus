import { useMemo } from "react";
import { DEFAULT_WIP_LIMITS, useApp } from "../../store";
import type { Stage } from "../../types";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { KANBAN_STAGES } from "./constants";

interface WipLimitPanelProps {
  open: boolean;
  onClose: () => void;
}

export function WipLimitPanel({ open, onClose }: WipLimitPanelProps) {
  const wipLimits = useApp((state) => state.wipLimits ?? DEFAULT_WIP_LIMITS);
  const setWipLimit = useApp((state) => state.setWipLimit);

  const stageList = useMemo(() => KANBAN_STAGES, []);

  if (!open) return null;

  const handleChange = (stage: Stage, value: string) => {
    if (value === "") {
      setWipLimit(stage, null);
      return;
    }
    const parsed = Number(value);
    setWipLimit(stage, Number.isNaN(parsed) ? null : Math.max(0, parsed));
  };

  const resetLimits = () => {
    stageList.forEach((stage) => setWipLimit(stage, DEFAULT_WIP_LIMITS[stage] ?? null));
  };

  return (
    <div className="absolute right-0 top-12 z-20 w-[320px] rounded-xl border border-border/60 bg-[hsl(var(--surface-200)_/_0.95)] p-4 shadow-layer-lg">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">WIP limits</p>
          <p className="text-xs text-muted-foreground">Adjust caps per stage</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      <div className="space-y-3 text-xs">
        {stageList.map((stage) => (
          <label key={stage} className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">{stage}</span>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={wipLimits?.[stage] ?? ""}
              onChange={(event) => handleChange(stage, event.target.value)}
              className="h-8 w-24 text-right"
            />
          </label>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <Button variant="ghost" size="sm" onClick={resetLimits}>
          Reset defaults
        </Button>
        <Button size="sm" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}
