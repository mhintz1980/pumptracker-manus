import { useEffect, useRef } from "react";
import { FilterBar } from "../toolbar/FilterBar";
import { cn } from "../../lib/utils";

interface ControlFlyoutProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

export function ControlFlyout({ open, onClose, className }: ControlFlyoutProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed left-1/2 top-16 z-50 w-full max-w-xl -translate-x-1/2 px-4",
        className
      )}
    >
      <div
        ref={cardRef}
        className="layer-glass border border-primary/40 p-4 shadow-layer-lg"
      >
        <FilterBar layout="stacked" />
      </div>
    </div>
  );
}
