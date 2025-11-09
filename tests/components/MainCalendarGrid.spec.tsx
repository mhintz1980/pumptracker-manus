import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MainCalendarGrid } from "../../src/components/scheduling/MainCalendarGrid";
import type { Pump } from "../../src/types";

const pumps: Pump[] = [
  {
    id: "pump-123",
    serial: 1200,
    po: "PO2025-0001-01",
    customer: "United Rentals",
    model: "DD-6",
    stage: "FABRICATION",
    priority: "Normal",
    last_update: "2025-10-31T00:00:00.000Z",
    value: 30000,
    scheduledStart: "2025-11-10T00:00:00.000Z",
    scheduledEnd: "2025-11-20T00:00:00.000Z",
  },
];

const mockGetModelLeadTimes = vi.fn().mockReturnValue({
  fabrication: 2,
  powder_coat: 3,
  assembly: 1,
  testing: 1,
  total_days: 7,
});

vi.mock("../../src/store", () => {
  const mockUseApp: any = (selector?: (state: any) => unknown) => {
    const state = { pumps };
    return selector ? selector(state) : state;
  };
  mockUseApp.getState = () => ({ getModelLeadTimes: mockGetModelLeadTimes });
  return { useApp: mockUseApp };
});

describe("MainCalendarGrid", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-11-10T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders events with stage labels", () => {
    const handleClick = vi.fn();
    render(<MainCalendarGrid onEventClick={handleClick} />);

    expect(screen.getAllByText(/DD-6/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Fabrication/i).length).toBeGreaterThan(0);
  });
});
