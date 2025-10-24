// src/components/toolbar/AddPoButton.tsx
import { Button } from "../ui/Button";
import { Plus } from "lucide-react";

interface AddPoButtonProps {
  onClick: () => void;
}

export function AddPoButton({ onClick }: AddPoButtonProps) {
  return (
    <Button onClick={onClick} size="sm">
      <Plus className="h-4 w-4 mr-1" />
      Add PO
    </Button>
  );
}

