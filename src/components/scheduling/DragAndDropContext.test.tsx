import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { DragAndDropContext } from "./DragAndDropContext";
import { useApp } from "../../store";

const handlers: { onDragEnd?: (event: any) => void } = {};

vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children, onDragEnd }: { children: React.ReactNode; onDragEnd?: (event: any) => void }) => {
    handlers.onDragEnd = onDragEnd;
    return <div data-testid="dnd-context">{children}</div>;
  },
  DragOverlay: ({ children }: { children: React.ReactNode }) => <div data-testid="drag-overlay">{children}</div>,
}));

describe("DragAndDropContext", () => {
  const pump = {
    id: "pump-1",
    serial: 1234,
    po: "PO-1",
    customer: "Customer",
    model: "Model X",
    stage: "NOT STARTED" as const,
    priority: "Normal" as const,
    last_update: new Date().toISOString(),
    value: 1000,
  };

  beforeEach(() => {
    handlers.onDragEnd = undefined;
    useApp.setState((state) => ({ ...state, pumps: [pump] }));
  });

  afterEach(() => {
    useApp.setState((state) => ({ ...state, pumps: [] }));
    vi.restoreAllMocks();
  });

  it("updates the pump when an unscheduled card is dropped on a date", () => {
    const updatePumpSpy = vi.spyOn(useApp.getState(), "updatePump");

    render(
      <DragAndDropContext>
        <div>content</div>
      </DragAndDropContext>
    );

    handlers.onDragEnd?.({
      active: {
        id: `unscheduled-${pump.id}`,
      },
      over: { id: "2024-01-10" },
    });

    expect(updatePumpSpy).toHaveBeenCalledWith(pump.id, {
      stage: "FABRICATION",
      scheduledStart: "2024-01-10",
    });
  });
});
