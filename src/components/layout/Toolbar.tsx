import { FilterBar } from "../toolbar/FilterBar";
import { AddPoButton } from "../toolbar/AddPoButton";
import { cn } from "../../lib/utils";

interface ToolbarProps {
  onOpenAddPo: () => void;
  className?: string;
}

export function Toolbar({ onOpenAddPo, className }: ToolbarProps) {
  return (
    <div
      className={cn(
        "bg-card border-b border-border sticky top-16 z-40 shadow-layer-md",
        className
      )}
    >
      <div className="container mx-auto flex flex-wrap items-center gap-3 px-6 py-3">
        <FilterBar className="flex-1 min-w-[260px]" />
        <div className="ml-auto">
          <AddPoButton onClick={onOpenAddPo} />
        </div>
      </div>
    </div>
  );
}
