import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../ui/Button";

interface CollapseToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function CollapseToggle({ collapsed, onToggle }: CollapseToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20"
      onClick={onToggle}
      title={collapsed ? "Expand cards" : "Collapse cards"}
      aria-label="Toggle pump card density"
    >
      {collapsed ? (
        <Maximize2 className="h-4 w-4" />
      ) : (
        <Minimize2 className="h-4 w-4" />
      )}
    </Button>
  );
}
