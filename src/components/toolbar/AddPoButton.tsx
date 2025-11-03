// src/components/toolbar/AddPoButton.tsx
import { Button } from "../ui/Button";
import { Plus } from "lucide-react";

interface AddPoButtonProps {
  onClick: () => void;
}

export function AddPoButton({ onClick }: AddPoButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="sm"
      className="rounded-full bg-accent text-accent-foreground font-semibold shadow-layer-md hover:bg-accent/85 hover:-translate-y-[1px]"
    >
      <Plus className="h-4 w-4 mr-1" />
      Add PO
    </Button>
  );
}
