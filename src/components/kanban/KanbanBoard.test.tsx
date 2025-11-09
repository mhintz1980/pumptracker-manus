import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import type { Pump } from "../../types";
import type { ReactNode } from "react";
import { useApp } from "../../store";

vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: ReactNode }) => <div data-testid="dnd-context">{children}</div>,
  DragOverlay: ({ children }: { children: ReactNode }) => <div data-testid="drag-overlay">{children}</div>,
  useSensor: vi.fn(() => ({})),
  useSensors: vi.fn(() => []),
  useDroppable: vi.fn(() => ({ setNodeRef: vi.fn(), isOver: false })),
  useDraggable: vi.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  })),
  PointerSensor: vi.fn(),
}));

import { KanbanBoard, sortStagePumps } from "./KanbanBoard";

const samplePumps: Pump[] = [
  {
    id: "pump-1",
    serial: 1001,
    po: "PO-001",
    customer: "Customer A",
    model: "Model X",
    stage: "NOT STARTED",
    priority: "Normal",
    last_update: new Date().toISOString(),
    value: 5000,
  },
];

describe("KanbanBoard", () => {
  it("uses the dark scrollbar styling for the horizontal scroll area", () => {
    const { container } = render(
      <KanbanBoard pumps={samplePumps} collapsed={false} />
    );

    const scrollArea = container.querySelector(".flex.h-full.gap-4");

    expect(scrollArea).not.toBeNull();
    expect(scrollArea?.className).toContain("scrollbar-dark");
  });

  it("sorts pumps by priority when requested", () => {
    const pumps: Pump[] = [
      { ...samplePumps[0], id: "low", priority: "Low", stage: "FABRICATION" },
      { ...samplePumps[0], id: "urgent", priority: "Urgent", stage: "FABRICATION" },
      { ...samplePumps[0], id: "normal", priority: "Normal", stage: "FABRICATION" },
    ];

    const sorted = sortStagePumps(pumps, "priority");

    expect(sorted.map((pump) => pump.id)).toEqual(["urgent", "normal", "low"]);
  });
});
