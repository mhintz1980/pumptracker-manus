// src/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Pump, Filters, AddPoPayload, Stage, DataAdapter } from "./types";
import { nanoid } from "nanoid";
import { LocalAdapter } from "./adapters/local";

// --- Utils ---

function genSerial(existing: Pump[]): number {
  const used = new Set(existing.map(p => p.serial));
  for (let s = 1000; s <= 9999; s++) {
    if (!used.has(s)) return s;
  }
  // Fallback: use a random serial if 1000-9999 are all used (unlikely for Lite)
  return Math.floor(1000 + Math.random() * 9000);
}

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

interface AppState {
  pumps: Pump[];
  filters: Filters;
  collapsedStages: Record<Stage, boolean>;
  adapter: DataAdapter;
  
  // actions
  setAdapter: (a: DataAdapter) => void;
  load: () => Promise<void>;
  setFilters: (f: Partial<Filters>) => void;
  clearFilters: () => void;
  addPO: (payload: AddPoPayload) => void;
  moveStage: (id: string, to: Stage) => void;
  replaceDataset: (rows: Pump[]) => void;
  toggleStageCollapse: (stage: Stage) => void;

  // selectors
  filtered: () => Pump[];
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      pumps: [],
      filters: {},
      collapsedStages: {
        "NOT STARTED": false, FABRICATION: false, "POWDER COAT": false,
        ASSEMBLY: false, TESTING: false, SHIPPING: false, CLOSED: false
      } as Record<Stage, boolean>,
      adapter: LocalAdapter, // Default to LocalAdapter
      
      setAdapter: (a) => set({ adapter: a }),

      load: async () => {
        const rows = await get().adapter.load();
        set({ pumps: rows });
      },
      
      setFilters: (f) => set({ filters: { ...get().filters, ...f } }),
      clearFilters: () => set({ filters: {} }),

      addPO: ({ po, customer, lines }) => {
        const expanded: Pump[] = lines.flatMap((line) =>
          Array.from({ length: line.quantity || 1 }).map(() => ({
            id: nanoid(),
            serial: genSerial(get().pumps),
            po,
            customer,
            model: line.model,
            stage: "NOT STARTED",
            priority: "Normal", // Default priority
            powder_color: line.color,
            last_update: new Date().toISOString(),
            value: line.valueEach ?? 0,
            scheduledEnd: line.promiseDate,
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

      filtered: () => applyFilters(get().pumps, get().filters),
    }),
    { 
      name: "pumptracker-lite",
      // Only persist filters and collapsed stages, not the pumps array itself 
      // since the adapter handles persistence.
      partialize: (state) => ({ 
        filters: state.filters, 
        collapsedStages: state.collapsedStages 
      }),
    }
  )
);

