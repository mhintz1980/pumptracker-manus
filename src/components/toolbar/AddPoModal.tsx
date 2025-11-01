// src/components/toolbar/AddPoModal.tsx
import React, { useState } from "react";
import { useApp } from "../../store";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { PoLine } from "../../types";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

interface AddPoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPoModal({ isOpen, onClose }: AddPoModalProps) {
  const { addPO } = useApp();
  const [po, setPo] = useState("");
  const [customer, setCustomer] = useState("");
  const [lines, setLines] = useState<PoLine[]>([
    { model: "", quantity: 1, color: "", promiseDate: "", valueEach: 0 }
  ]);

  const handleAddLine = () => {
    setLines([...lines, { model: "", quantity: 1, color: "", promiseDate: "", valueEach: 0 }]);
  };

  const handleRemoveLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleLineChange = <T extends keyof PoLine>(index: number, field: T, value: PoLine[T]) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!po.trim() || !customer.trim()) {
      toast.error("PO and Customer are required");
      return;
    }
    
    const validLines = lines.filter(line => line.model.trim() && line.quantity > 0);
    if (validLines.length === 0) {
      toast.error("At least one line with a model is required");
      return;
    }

    // Submit
    addPO({ po, customer, lines: validLines });
    toast.success(`Added ${validLines.reduce((sum, l) => sum + l.quantity, 0)} pumps to ${po}`);
    
    // Reset and close
    setPo("");
    setCustomer("");
    setLines([{ model: "", quantity: 1, color: "", promiseDate: "", valueEach: 0 }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl px-4">
      <div className="surface-elevated shadow-frame border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Add Purchase Order</h2>
            <p className="text-sm text-foreground/60">Create a new job and instantly populate the board.</p>
          </div>
          <button onClick={onClose} className="text-foreground/60 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white mb-2">PO Number *</label>
              <Input
                value={po}
                onChange={(e) => setPo(e.target.value)}
                placeholder="PO-12345"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Customer *</label>
              <Input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="Customer Name"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Line Items</label>
              <Button type="button" variant="outline" size="default" className="rounded-full" onClick={handleAddLine}>
                <Plus className="h-4 w-4 mr-1" />
                Add Line
              </Button>
            </div>

            <div className="space-y-3">
              {lines.map((line, index) => (
                <div key={index} className="grid grid-cols-6 gap-3 items-end surface-panel border border-white/10 rounded-xl p-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold tracking-wide text-foreground/60 mb-1">Model *</label>
                    <Input
                      value={line.model}
                      onChange={(e) => handleLineChange(index, "model", e.target.value)}
                      placeholder="P-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wide text-foreground/60 mb-1">Qty *</label>
                    <Input
                      type="number"
                      value={line.quantity}
                      onChange={(e) => handleLineChange(index, "quantity", parseInt(e.target.value) || 1)}
                      min={1}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wide text-foreground/60 mb-1">Color</label>
                    <Input
                      value={line.color}
                      onChange={(e) => handleLineChange(index, "color", e.target.value)}
                      placeholder="Red"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wide text-foreground/60 mb-1">Value ($)</label>
                    <Input
                      type="number"
                      value={line.valueEach}
                      onChange={(e) => handleLineChange(index, "valueEach", parseFloat(e.target.value) || 0)}
                      min={0}
                      step={0.01}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold tracking-wide text-foreground/60 mb-1">Promise Date</label>
                      <Input
                        type="date"
                        value={line.promiseDate}
                        onChange={(e) => handleLineChange(index, "promiseDate", e.target.value)}
                      />
                    </div>
                    {lines.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveLine(index)}
                        className="text-destructive hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" className="rounded-full" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-full">
              Add PO
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
