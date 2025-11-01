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
      size="default"
      variant="secondary"
      className="rounded-full bg-[#facc15] text-slate-900 hover:bg-[#f4c614] shadow-soft hover:-translate-y-[1px]"
    >
      <Plus className="h-4 w-4 mr-1" />
      Add PO
    </Button>
  );
}
