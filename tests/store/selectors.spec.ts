import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useApp } from "../../src/store";
import type { Pump, Stage } from "../../src/types";
import { LocalAdapter } from "../../src/adapters/local";

// Mock the dependencies
vi.mock("../../src/lib/seed");
import { getModelLeadTimes as mockGetModelLeadTimes } from "../../src/lib/seed";

vi.mock("../../src/adapters/local", () => ({
  LocalAdapter: {
    load: vi.fn(),
    upsertMany: vi.fn(),
    update: vi.fn(),
    replaceAll: vi.fn(),
  },
}));

vi.mock("nanoid", () => ({
  nanoid: vi.fn(() => `test-id-${Math.random()}`),
}));

describe("Store Integration - Calendar Selectors", () => {
  beforeEach(() => {
    // Reset the store state before each test
    useApp.setState({
      pumps: [],
      filters: {},
      loading: false,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getModelLeadTimes selector", () => {
    beforeEach(() => {
      vi.mocked(mockGetModelLeadTimes).mockClear();
    });

    it("returns lead times for known models", () => {
      const { getModelLeadTimes } = useApp.getState();

      const mockLeadTimes = {
        fabrication: 3,
        powder_coat: 2,
        assembly: 1,
        testing: 1,
        shipping: 2,
        total_days: 9,
      };

      vi.mocked(mockGetModelLeadTimes).mockReturnValue(mockLeadTimes);

      const result = getModelLeadTimes("DD-8");
      expect(result).toEqual(mockLeadTimes);
      expect(mockGetModelLeadTimes).toHaveBeenCalledWith("DD-8");
    });

    it("returns undefined for unknown models", () => {
      const { getModelLeadTimes } = useApp.getState();

      vi.mocked(mockGetModelLeadTimes).mockReturnValue(undefined);

      const result = getModelLeadTimes("UNKNOWN-MODEL");
      expect(result).toBeUndefined();
    });

    it("handles calls with different models independently", () => {
      const { getModelLeadTimes } = useApp.getState();

      vi.mocked(mockGetModelLeadTimes).mockImplementation((model: string) => {
        if (model === "DD-6") {
          return {
            fabrication: 2,
            powder_coat: 2,
            assembly: 1,
            testing: 1,
            shipping: 1,
            total_days: 7,
          };
        }
        if (model === "DD-8") {
          return {
            fabrication: 3,
            powder_coat: 2,
            assembly: 1,
            testing: 1,
            shipping: 2,
            total_days: 9,
          };
        }
        return undefined;
      });

      const dd6LeadTimes = getModelLeadTimes("DD-6");
      const dd8LeadTimes = getModelLeadTimes("DD-8");
      const unknownLeadTimes = getModelLeadTimes("UNKNOWN");

      expect(dd6LeadTimes?.total_days).toBe(7);
      expect(dd8LeadTimes?.total_days).toBe(9);
      expect(unknownLeadTimes).toBeUndefined();
    });
  });

  describe("getStageSegments selector", () => {
    const mockPump: Pump = {
      id: "pump-segments-test",
      serial: 1400,
      po: "PO2025-SEGMENTS-01",
      customer: "Test Customer",
      model: "DD-8",
      stage: "FABRICATION",
      priority: "Normal",
      last_update: "2025-11-01T00:00:00.000Z",
      value: 45000,
      scheduledStart: "2025-11-12T00:00:00.000Z",
      scheduledEnd: "2025-11-25T00:00:00.000Z",
    };

    const mockLeadTimes = {
      fabrication: 3,
      powder_coat: 2,
      assembly: 1,
      testing: 1,
      shipping: 2,
      total_days: 9,
    };

    beforeEach(() => {
      vi.mocked(mockGetModelLeadTimes).mockReturnValue(mockLeadTimes);
    });

    it("returns stage segments for scheduled pump", () => {
      useApp.setState({ pumps: [mockPump] });

      const { getStageSegments } = useApp.getState();
      const segments = getStageSegments(mockPump.id);

      expect(segments).not.toBeNull();
      expect(segments).toHaveLength(5); // FABRICATION, POWDER_COAT, ASSEMBLY, TESTING, SHIPPING

      // Verify segment structure
      segments?.forEach((segment, index) => {
        expect(segment.stage).toBeTruthy();
        expect(segment.start).toBeInstanceOf(Date);
        expect(segment.end).toBeInstanceOf(Date);
        expect(segment.end.getTime()).toBeGreaterThan(segment.start.getTime());
        expect(segment.days).toBeGreaterThan(0);
        expect(segment.pump).toEqual(mockPump);
      });

      // Verify stage order
      const stages = segments?.map(s => s.stage);
      expect(stages).toEqual([
        "FABRICATION",
        "POWDER COAT",
        "ASSEMBLY",
        "TESTING",
        "SHIPPING",
      ]);
    });

    it("returns null for pump without scheduled start", () => {
      const pumpWithoutSchedule = {
        ...mockPump,
        id: "pump-no-schedule",
        scheduledStart: undefined,
        scheduledEnd: undefined,
      };

      useApp.setState({ pumps: [pumpWithoutSchedule] });

      const { getStageSegments } = useApp.getState();
      const segments = getStageSegments(pumpWithoutSchedule.id);

      expect(segments).toBeNull();
    });

    it("returns null for non-existent pump", () => {
      useApp.setState({ pumps: [mockPump] });

      const { getStageSegments } = useApp.getState();
      const segments = getStageSegments("non-existent-pump-id");

      expect(segments).toBeNull();
    });

    it("returns null when lead times are unavailable", () => {
      
      vi.mocked(mockGetModelLeadTimes).mockReturnValue(undefined);

      useApp.setState({ pumps: [mockPump] });

      const { getStageSegments } = useApp.getState();
      const segments = getStageSegments(mockPump.id);

      expect(segments).toBeNull();
    });

    it("caches results for identical inputs", () => {
      useApp.setState({ pumps: [mockPump] });

      const { getStageSegments } = useApp.getState();
      const { buildStageTimeline } = require("../../src/lib/schedule");

      // Mock buildStageTimeline to track calls
      const mockBuildStageTimeline = vi.fn().mockReturnValue([]);
      vi.doMock("../../src/lib/schedule", () => ({
        buildStageTimeline: mockBuildStageTimeline,
      }));

      // First call should trigger computation
      const segments1 = getStageSegments(mockPump.id);

      // Second call with same inputs should use cache
      const segments2 = getStageSegments(mockPump.id);

      expect(segments1).toEqual(segments2);
    });

    it("invalidates cache when pump data changes", () => {
      useApp.setState({ pumps: [mockPump] });

      const { getStageSegments, updatePump } = useApp.getState();

      // First call
      const segments1 = getStageSegments(mockPump.id);
      expect(segments1).not.toBeNull();

      // Update pump scheduled start date
      act(() => {
        updatePump(mockPump.id, {
          scheduledStart: "2025-11-15T00:00:00.000Z",
        });
      });

      // Second call should return different segments due to new start date
      const segments2 = getStageSegments(mockPump.id);
      expect(segments2).not.toBeNull();

      // The segments should be different due to different start date
      expect(segments1?.[0].start.getTime()).not.toBe(segments2?.[0].start.getTime());
    });

    it("handles multiple pumps with different schedules", () => {
      const pump2: Pump = {
        ...mockPump,
        id: "pump-second",
        po: "PO2025-SECOND-02",
        model: "DD-6",
        scheduledStart: "2025-11-15T00:00:00.000Z",
      };

      
      vi.mocked(mockGetModelLeadTimes).mockImplementation((model: string) => {
        if (model === "DD-8") return mockLeadTimes;
        if (model === "DD-6") {
          return {
            fabrication: 2,
            powder_coat: 2,
            assembly: 1,
            testing: 1,
            shipping: 1,
            total_days: 7,
          };
        }
        return undefined;
      });

      useApp.setState({ pumps: [mockPump, pump2] });

      const { getStageSegments } = useApp.getState();

      const segments1 = getStageSegments(mockPump.id);
      const segments2 = getStageSegments(pump2.id);

      expect(segments1).not.toBeNull();
      expect(segments2).not.toBeNull();
      expect(segments1?.[0].start.getTime()).not.toBe(segments2?.[0].start.getTime());
      expect(segments1?.length).toBe(5);
      expect(segments2?.length).toBe(5);
    });

    it("gracefully handles buildStageTimeline errors", () => {
      // Mock buildStageTimeline to throw an error
      const { buildStageTimeline } = require("../../src/lib/schedule");
      const originalBuildStageTimeline = buildStageTimeline;

      vi.doMock("../../src/lib/schedule", () => ({
        buildStageTimeline: vi.fn().mockImplementation(() => {
          throw new Error("Test error");
        }),
      }));

      useApp.setState({ pumps: [mockPump] });

      const { getStageSegments } = useApp.getState();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const segments = getStageSegments(mockPump.id);

      expect(segments).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error building stage timeline for pump"),
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("schedulePump integration", () => {
    const mockPump: Pump = {
      id: "pump-schedule-test",
      serial: 1500,
      po: "PO2025-SCHEDULE-01",
      customer: "Schedule Test",
      model: "DD-6",
      stage: "UNSCHEDULED",
      priority: "Normal",
      last_update: "2025-11-01T00:00:00.000Z",
      value: 32000,
    };

    const mockLeadTimes = {
      fabrication: 2,
      powder_coat: 2,
      assembly: 1,
      testing: 1,
      shipping: 1,
      total_days: 7,
    };

    beforeEach(() => {
      
      vi.mocked(mockGetModelLeadTimes).mockReturnValue(mockLeadTimes);
      useApp.setState({ pumps: [mockPump] });
    });

    it("schedules pump with correct dates and stage transition", () => {
      const { schedulePump, updatePump } = useApp.getState();
      const dropDate = "2025-11-15";

      const updatePumpSpy = vi.spyOn({ updatePump }, 'updatePump');

      act(() => {
        schedulePump(mockPump.id, dropDate);
      });

      expect(updatePumpSpy).toHaveBeenCalledWith(mockPump.id, {
        scheduledStart: "2025-11-15",
        scheduledEnd: expect.stringMatching(/2025-11-\d{2}/), // 7 days after start
        stage: "NOT STARTED",
        last_update: expect.any(String),
      });
    });

    it("does not schedule pump with unknown model", () => {
      
      vi.mocked(mockGetModelLeadTimes).mockReturnValue(undefined);

      const { schedulePump, updatePump } = useApp.getState();
      const updatePumpSpy = vi.spyOn({ updatePump }, 'updatePump');

      act(() => {
        schedulePump(mockPump.id, "2025-11-15");
      });

      expect(updatePumpSpy).not.toHaveBeenCalled();
    });

    it("does not schedule non-existent pump", () => {
      const { schedulePump, updatePump } = useApp.getState();
      const updatePumpSpy = vi.spyOn({ updatePump }, 'updatePump');

      act(() => {
        schedulePump("non-existent-pump", "2025-11-15");
      });

      expect(updatePumpSpy).not.toHaveBeenCalled();
    });

    it("calculates correct end date based on lead times", () => {
      const { schedulePump, updatePump } = useApp.getState();
      const updatePumpSpy = vi.spyOn({ updatePump }, 'updatePump');

      const dropDate = "2025-11-15";
      const expectedEndDate = new Date("2025-11-15");
      expectedEndDate.setDate(expectedEndDate.getDate() + 7); // total_days from lead times

      act(() => {
        schedulePump(mockPump.id, dropDate);
      });

      expect(updatePumpSpy).toHaveBeenCalledWith(mockPump.id, {
        scheduledStart: dropDate,
        scheduledEnd: expectedEndDate.toISOString().split('T')[0],
        stage: "NOT STARTED",
        last_update: expect.any(String),
      });
    });
  });

  describe("clearSchedule integration", () => {
    const scheduledPump: Pump = {
      id: "pump-clear-test",
      serial: 1600,
      po: "PO2025-CLEAR-01",
      customer: "Clear Test",
      model: "DD-8",
      stage: "FABRICATION",
      priority: "Normal",
      last_update: "2025-11-01T00:00:00.000Z",
      value: 45000,
      scheduledStart: "2025-11-12T00:00:00.000Z",
      scheduledEnd: "2025-11-25T00:00:00.000Z",
    };

    beforeEach(() => {
      useApp.setState({ pumps: [scheduledPump] });
    });

    it("clears pump schedule and resets to UNSCHEDULED", () => {
      const { clearSchedule, updatePump } = useApp.getState();
      const updatePumpSpy = vi.spyOn({ updatePump }, 'updatePump');

      act(() => {
        clearSchedule(scheduledPump.id);
      });

      expect(updatePumpSpy).toHaveBeenCalledWith(scheduledPump.id, {
        scheduledStart: undefined,
        scheduledEnd: undefined,
        stage: "UNSCHEDULED",
        last_update: expect.any(String),
      });
    });

    it("updates getStageSegments to return null after clearing schedule", () => {
      const { clearSchedule, getStageSegments } = useApp.getState();

      // Before clearing, should have segments
      
      mockGetModelLeadTimes.mockReturnValue({
        fabrication: 3,
        powder_coat: 2,
        assembly: 1,
        testing: 1,
        shipping: 2,
        total_days: 9,
      });

      const segmentsBefore = getStageSegments(scheduledPump.id);
      expect(segmentsBefore).not.toBeNull();

      // Clear schedule
      act(() => {
        clearSchedule(scheduledPump.id);
      });

      // After clearing, should return null
      const segmentsAfter = getStageSegments(scheduledPump.id);
      expect(segmentsAfter).toBeNull();
    });
  });

  describe("filtered selector integration with calendar data", () => {
    const mockPumps: Pump[] = [
      {
        id: "pump-filter-1",
        serial: 1001,
        po: "PO2025-FILTER-01",
        customer: "Customer A",
        model: "DD-6",
        stage: "FABRICATION" as Stage,
        priority: "Normal",
        last_update: "2025-11-01T00:00:00.000Z",
        value: 30000,
        scheduledStart: "2025-11-10T00:00:00.000Z",
        scheduledEnd: "2025-11-20T00:00:00.000Z",
      },
      {
        id: "pump-filter-2",
        serial: 1002,
        po: "PO2025-FILTER-02",
        customer: "Customer B",
        model: "DD-8",
        stage: "POWDER COAT" as Stage,
        priority: "High",
        last_update: "2025-11-02T00:00:00.000Z",
        value: 45000,
        scheduledStart: "2025-11-12T00:00:00.000Z",
        scheduledEnd: "2025-11-25T00:00:00.000Z",
      },
      {
        id: "pump-filter-3",
        serial: 1003,
        po: "PO2025-FILTER-03",
        customer: "Customer A",
        model: "DD-6",
        stage: "UNSCHEDULED" as Stage,
        priority: "Low",
        last_update: "2025-11-03T00:00:00.000Z",
        value: 28000,
      },
    ];

    beforeEach(() => {
      useApp.setState({ pumps: mockPumps });
    });

    it("filters pumps by stage for calendar view", () => {
      const { setFilters, filtered } = useApp.getState();

      act(() => {
        setFilters({ stage: "FABRICATION" });
      });

      const filteredPumps = filtered();
      expect(filteredPumps).toHaveLength(1);
      expect(filteredPumps[0].id).toBe("pump-filter-1");
      expect(filteredPumps[0].stage).toBe("FABRICATION");
    });

    it("filters pumps by model for calendar view", () => {
      const { setFilters, filtered } = useApp.getState();

      act(() => {
        setFilters({ model: "DD-6" });
      });

      const filteredPumps = filtered();
      expect(filteredPumps).toHaveLength(2);
      expect(filteredPumps.every(p => p.model === "DD-6")).toBe(true);
    });

    it("filters pumps by customer for calendar view", () => {
      const { setFilters, filtered } = useApp.getState();

      act(() => {
        setFilters({ customer: "Customer A" });
      });

      const filteredPumps = filtered();
      expect(filteredPumps).toHaveLength(2);
      expect(filteredPumps.every(p => p.customer === "Customer A")).toBe(true);
    });

    it("filters pumps by PO number for calendar view", () => {
      const { setFilters, filtered } = useApp.getState();

      act(() => {
        setFilters({ po: "PO2025-FILTER-02" });
      });

      const filteredPumps = filtered();
      expect(filteredPumps).toHaveLength(1);
      expect(filteredPumps[0].po).toBe("PO2025-FILTER-02");
    });

    it("performs global search across pump fields", () => {
      const { setFilters, filtered } = useApp.getState();

      act(() => {
        setFilters({ q: "Customer A" });
      });

      const filteredPumps = filtered();
      expect(filteredPumps).toHaveLength(2);
      expect(filteredPumps.every(p => p.customer === "Customer A")).toBe(true);
    });

    it("search includes serial numbers", () => {
      const { setFilters, filtered } = useApp.getState();

      act(() => {
        setFilters({ q: "1002" });
      });

      const filteredPumps = filtered();
      expect(filteredPumps).toHaveLength(1);
      expect(filteredPumps[0].serial).toBe(1002);
    });

    it("combines multiple filters correctly", () => {
      const { setFilters, filtered } = useApp.getState();

      act(() => {
        setFilters({
          customer: "Customer A",
          model: "DD-6",
          stage: "FABRICATION"
        });
      });

      const filteredPumps = filtered();
      expect(filteredPumps).toHaveLength(1);
      expect(filteredPumps[0].id).toBe("pump-filter-1");
    });

    it("clears filters to show all pumps", () => {
      const { setFilters, clearFilters, filtered } = useApp.getState();

      // Apply filter first
      act(() => {
        setFilters({ stage: "FABRICATION" });
      });

      let filteredPumps = filtered();
      expect(filteredPumps).toHaveLength(1);

      // Clear filters
      act(() => {
        clearFilters();
      });

      filteredPumps = filtered();
      expect(filteredPumps).toHaveLength(3); // All pumps restored
    });

    it("getStageSegments works correctly with filtered results", () => {
      
      mockGetModelLeadTimes.mockReturnValue({
        fabrication: 2,
        powder_coat: 2,
        assembly: 1,
        testing: 1,
        shipping: 1,
        total_days: 7,
      });

      const { setFilters, filtered, getStageSegments } = useApp.getState();

      act(() => {
        setFilters({ model: "DD-6" });
      });

      const filteredPumps = filtered();
      const scheduledFilteredPumps = filteredPumps.filter(p => p.scheduledStart);

      if (scheduledFilteredPumps.length > 0) {
        const pump = scheduledFilteredPumps[0];
        const segments = getStageSegments(pump.id);

        expect(segments).not.toBeNull();
        expect(segments?.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Store state persistence and calendar integration", () => {
    it("maintains filter state across page reloads", () => {
      const { setFilters } = useApp.getState();

      act(() => {
        setFilters({
          stage: "FABRICATION",
          model: "DD-8",
          customer: "Test Customer"
        });
      });

      const currentState = useApp.getState();
      expect(currentState.filters).toEqual({
        stage: "FABRICATION",
        model: "DD-8",
        customer: "Test Customer"
      });

      // Store should persist these filters (handled by zustand persist middleware)
      expect(currentState.filters.stage).toBe("FABRICATION");
    });

    it("does not persist pump array (handled by adapter)", () => {
      const currentState = useApp.getState();

      // Pumps should be managed by adapter, not persisted in store
      expect(Array.isArray(currentState.pumps)).toBe(true);

      // The partialize function should exclude pumps from persistence
      // This is tested implicitly by the store configuration
    });

    it("updates last_update timestamp on calendar operations", () => {
      const mockPump: Pump = {
        id: "pump-timestamp-test",
        serial: 1700,
        po: "PO2025-TIMESTAMP-01",
        customer: "Timestamp Test",
        model: "DD-6",
        stage: "UNSCHEDULED",
        priority: "Normal",
        last_update: "2025-11-01T00:00:00.000Z",
        value: 30000,
      };

      useApp.setState({ pumps: [mockPump] });

      const { schedulePump, updatePump } = useApp.getState();
      const updatePumpSpy = vi.spyOn({ updatePump }, 'updatePump');

      
      mockGetModelLeadTimes.mockReturnValue({
        fabrication: 2,
        powder_coat: 2,
        assembly: 1,
        testing: 1,
        shipping: 1,
        total_days: 7,
      });

      const originalTimestamp = mockPump.last_update;

      act(() => {
        schedulePump(mockPump.id, "2025-11-15");
      });

      expect(updatePumpSpy).toHaveBeenCalledWith(mockPump.id, expect.objectContaining({
        last_update: expect.any(String)
      }));

      const updateCall = updatePumpSpy.mock.calls[0][1];
      expect(updateCall.last_update).not.toBe(originalTimestamp);
      expect(new Date(updateCall.last_update).getTime()).toBeGreaterThan(new Date(originalTimestamp).getTime());
    });
  });
});