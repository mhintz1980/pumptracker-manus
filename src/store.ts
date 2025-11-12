// src/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Pump, Filters, AddPoPayload, Stage, DataAdapter } from "./types";
import { nanoid } from "nanoid";
import { LocalAdapter } from "./adapters/local";
import { getModelLeadTimes as getCatalogLeadTimes } from "./lib/seed";

// --- Utils ---

function genSerial(existing: Pump[]): number {
  const used = new Set(existing.map(p => p.serial));
  for (let s = 1000; s <= 9999; s++) {
    if (!used.has(s)) return s;
  }
  // Fallback: use a random serial if 1000-9999 are all used (unlikely for Lite)
  return Math.floor(1000 + Math.random() * 9000);
}

const DEFAULT_WIP_LIMITS: Record<Stage, number | null> = {
  "UNSCHEDULED": null,
  "NOT STARTED": 12,
  FABRICATION: 8,
  "POWDER COAT": 6,
  ASSEMBLY: 8,
  TESTING: 5,
  SHIPPING: 4,
  CLOSED: null,
};

function applyFilters(rows: Pump[], f: Filters): Pump[] {
  const q = f.q?.toLowerCase();
  return rows.filter(r => {
    if (f.po && r.po !== f.po) return false;
    if (f.customer && r.customer !== f.customer) return false;
    if (f.model && r.model !== f.model) return false;
    if (f.priority && r.priority !== f.priority) return false;
    if (f.stage && r.stage !== f.stage) return false;
    
    // Simple global search
    if (q) {
      const searchable = [r.po, r.customer, r.model, r.serial.toString(), r.powder_color].join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    
    // Date filters (optional for trend, but apply here for consistency)
    // if (f.dateFrom && r.scheduledEnd && new Date(r.scheduledEnd) < new Date(f.dateFrom)) return false;
    // if (f.dateTo && r.scheduledEnd && new Date(r.scheduledEnd) > new Date(f.dateTo)) return false;

    return true;
  });
}

// --- Store Definition ---

export type SortKey = "priority" | "model" | "customer" | "po" | "last_update";

interface AppState {
  pumps: Pump[];
  filters: Filters;
  collapsedStages: Record<Stage, boolean>;
  collapsedCards: boolean;
  wipLimits: Record<Stage, number | null>;
  sortKey: SortKey;
  adapter: DataAdapter;
  loading: boolean;
  
  // actions
  setAdapter: (a: DataAdapter) => void;
  load: () => Promise<void>;
  setFilters: (f: Partial<Filters>) => void;
  clearFilters: () => void;
  addPO: (payload: AddPoPayload) => void;
  moveStage: (id: string, to: Stage) => void;
  updatePump: (id: string, patch: Partial<Pump>) => void;
  schedulePump: (id: string, dropDate: string) => void;
  clearSchedule: (id: string) => void;
  replaceDataset: (rows: Pump[]) => void;
  toggleStageCollapse: (stage: Stage) => void;
  toggleCollapsedCards: () => void;
  setWipLimit: (stage: Stage, limit: number | null) => void;
  setSortKey: (key: SortKey) => void;

  // selectors
  filtered: () => Pump[];
  getModelLeadTimes: (model: string) => Record<string, number> | undefined;
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      pumps: [],
      filters: {},
      collapsedStages: {
        "UNSCHEDULED": false,
        "NOT STARTED": false, FABRICATION: false, "POWDER COAT": false,
        ASSEMBLY: false, TESTING: false, SHIPPING: false, CLOSED: false
      } as Record<Stage, boolean>,
      collapsedCards: false,
      wipLimits: { ...DEFAULT_WIP_LIMITS },
      sortKey: "priority",
      adapter: LocalAdapter, // Default to LocalAdapter
      loading: true,
      
      setAdapter: (a) => set({ adapter: a }),

      load: async () => {
        set({ loading: true });
        const rows = await get().adapter.load();
        set({ pumps: rows, loading: false });
      },
      
      setFilters: (f) => set({ filters: { ...get().filters, ...f } }),
      clearFilters: () => set({ filters: {} }),

      addPO: ({ po, customer, lines, dateReceived, promiseDate }) => {
        const expanded: Pump[] = lines.flatMap((line) =>
          Array.from({ length: line.quantity || 1 }).map(() => ({
            id: nanoid(),
            serial: genSerial(get().pumps),
            po,
            customer,
            model: line.model,
            stage: "UNSCHEDULED",
            priority: line.priority ?? "Normal",
            powder_color: line.color,
            last_update: dateReceived || new Date().toISOString(),
            value: line.valueEach ?? 0,
            scheduledEnd: line.promiseDate || promiseDate,
          }))
        );

        const next = [...get().pumps, ...expanded];
        set({ pumps: next });
        get().adapter.upsertMany(expanded);
      },

      moveStage: (id, to) => {
        const now = new Date().toISOString();
        const next = get().pumps.map(p =>
          p.id === id ? { ...p, stage: to, last_update: now } : p
        );
        set({ pumps: next });
        get().adapter.update(id, { stage: to, last_update: now });
      },

      updatePump: (id, patch) => {
        const now = new Date().toISOString();
        const next = get().pumps.map(p =>
          p.id === id ? { ...p, ...patch, last_update: now } : p
        );
        set({ pumps: next });
        get().adapter.update(id, { ...patch, last_update: now });
      },

      replaceDataset: (rows) => {
        set({ pumps: rows });
        get().adapter.replaceAll(rows);
      },

      toggleStageCollapse: (stage) => {
        set(state => ({
          collapsedStages: {
            ...state.collapsedStages,
            [stage]: !state.collapsedStages[stage],
          }
        }));
      },
      toggleCollapsedCards: () => {
        set((state) => ({
          collapsedCards: !state.collapsedCards,
        }));
      },
      setWipLimit: (stage, limit) => {
        set((state) => ({
          wipLimits: {
            ...state.wipLimits,
            [stage]: limit,
          }
        }));
      },
      setSortKey: (key) => set({ sortKey: key }),

      schedulePump: (id: string, dropDate: string) => {
        const { pumps, getModelLeadTimes } = get();
        const pump = pumps.find(p => p.id === id);

        if (!pump) return;

        // Get lead times for this model
        const leadTimes = getModelLeadTimes(pump.model);
        if (!leadTimes) return;

        // Calculate start/end dates based on lead times
        const totalDays = Object.values(leadTimes).reduce((sum, days) => sum + days, 0);
        const startDate = new Date(dropDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + totalDays);

        // Update pump with schedule and advance stage
        get().updatePump(id, {
          scheduledStart: startDate.toISOString().split('T')[0],
          scheduledEnd: endDate.toISOString().split('T')[0],
          stage: "NOT STARTED",
          last_update: new Date().toISOString(),
        });
      },

      clearSchedule: (id: string) => {
        get().updatePump(id, {
          scheduledStart: undefined,
          scheduledEnd: undefined,
          stage: "UNSCHEDULED",
          last_update: new Date().toISOString(),
        });
      },

      filtered: () => applyFilters(get().pumps, get().filters),

      getModelLeadTimes: (model: string) => {
        // Use real catalog data instead of hardcoded values
        return getCatalogLeadTimes(model);
      },
    }),
    {
      name: "pumptracker-lite-v3-catalog",
      // Only persist filters and collapsed stages, not the pumps array itself 
      // since the adapter handles persistence.
      partialize: (state) => ({
        filters: state.filters,
        collapsedStages: state.collapsedStages,
        collapsedCards: state.collapsedCards,
        wipLimits: state.wipLimits,
        sortKey: state.sortKey,
      }),
    }
  )
);

export { DEFAULT_WIP_LIMITS };
