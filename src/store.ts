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
  loading: boolean;
  
  // actions
  levelSchedule: () => void;
  autoSchedule: (priority: 'Model' | 'Customer' | 'Purchase Order' | 'Priority' | 'Promise Date' | 'Best Fit') => void;
  clearSchedule: () => void;
  setAdapter: (a: DataAdapter) => void;
  load: () => Promise<void>;
  setFilters: (f: Partial<Filters>) => void;
  clearFilters: () => void;
  addPO: (payload: AddPoPayload) => void;
  moveStage: (id: string, to: Stage) => void;
  updatePump: (id: string, patch: Partial<Pump>) => void;
  replaceDataset: (rows: Pump[]) => void;
  toggleStageCollapse: (stage: Stage) => void;

  // selectors
      getWorkingDays: (startDate, days) => {
        let date = new Date(startDate);
        let workDays = 0;
        while (workDays < days) {
          date.setDate(date.getDate() + 1);
          // 0 = Sunday, 6 = Saturday
          if (date.getDay() !== 0 && date.getDay() !== 6) {
            workDays++;
          }
        }
        return date;
      },
  filtered: () => Pump[];
  getModelLeadTimes: (model: string) => Record<string, number> | undefined;
  getWorkingDays: (startDate: Date, days: number) => Date;
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
      loading: true,
      
      setAdapter: (a) => set({ adapter: a }),

      load: async () => {
        set({ loading: true });
        const rows = await get().adapter.load();
        set({ pumps: rows, loading: false });
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

      clearSchedule: () => {
        const scheduledPumps = get().pumps.filter(p => p.scheduledStart);
        const nextPumps = get().pumps.map(p => {
          if (p.scheduledStart) {
            return { ...p, scheduledStart: undefined, stage: "NOT STARTED" };
          }
          return p;
        });
        set({ pumps: nextPumps });
        get().adapter.upsertMany(scheduledPumps.map(p => ({ ...p, scheduledStart: undefined, stage: "NOT STARTED" })));
      },

      levelSchedule: () => {
        const { pumps, getModelLeadTimes, getWorkingDays, adapter } = get();
        
        // 1. Identify and sort scheduled jobs by their current scheduledStart date
        const scheduledPumps = pumps
          .filter(p => p.scheduledStart)
          .sort((a, b) => new Date(a.scheduledStart!).getTime() - new Date(b.scheduledStart!).getTime());

        if (scheduledPumps.length === 0) return;

        // 2. Start with the earliest scheduled date or today
        let currentDate = new Date();
        // Find the earliest scheduled date among all pumps
        const earliestScheduledDate = scheduledPumps.reduce((minDate, pump) => {
          const pumpDate = new Date(pump.scheduledStart!);
          return pumpDate < minDate ? pumpDate : minDate;
        }, new Date(scheduledPumps[0].scheduledStart!));
        
        // Start leveling from the earliest scheduled date
        currentDate = earliestScheduledDate;

        const updatedPumps: Pump[] = [];
        const updatesForAdapter: Partial<Pump>[] = [];

        for (const pump of scheduledPumps) {
          const leadTimes = getModelLeadTimes(pump.model);
          const fabricationLeadTime = leadTimes?.fabrication || 1;

          // Find the next available working day for the start date
          let nextWorkingDay = new Date(currentDate);
          // 0 = Sunday, 6 = Saturday
          while (nextWorkingDay.getDay() === 0 || nextWorkingDay.getDay() === 6) {
            nextWorkingDay.setDate(nextWorkingDay.getDate() + 1);
          }
          
          // 3. Calculate the new scheduled start and end dates
          const newScheduledStart = nextWorkingDay.toISOString().split('T')[0];
          
          // Calculate the new end date (which is the start date for the next job)
          // getWorkingDays returns the day *after* the last working day
          const newEndDate = getWorkingDays(nextWorkingDay, fabricationLeadTime);
          
          // 4. Update the pump
          const updatedPump = {
            ...pump,
            scheduledStart: newScheduledStart,
            last_update: new Date().toISOString(),
          };
          updatedPumps.push(updatedPump);
          updatesForAdapter.push({ id: pump.id, scheduledStart: newScheduledStart, last_update: updatedPump.last_update });

          // 5. Set the current date for the next job to the new end date
          currentDate = newEndDate;
        }

        // 6. Update the state and adapter
        const nextPumps = pumps.map(p => {
          const updated = updatedPumps.find(up => up.id === p.id);
          return updated || p;
        });
        
        set({ pumps: nextPumps });
        adapter.upsertMany(updatesForAdapter as Pump[]);
      },

      autoSchedule: (priority) => {
        const { pumps, getModelLeadTimes, getWorkingDays, levelSchedule, adapter } = get();
        
        // 1. Get unscheduled pumps
        let unscheduledPumps = pumps.filter(p => !p.scheduledStart);

        // 2. Sort pumps based on priority
        switch (priority) {
          case 'Model':
            unscheduledPumps.sort((a, b) => a.model.localeCompare(b.model));
            break;
          case 'Customer':
            unscheduledPumps.sort((a, b) => a.customer.localeCompare(b.customer));
            break;
          case 'Purchase Order':
            unscheduledPumps.sort((a, b) => a.po.localeCompare(b.po));
            break;
          case 'Priority':
            const priorityOrder = { Urgent: 1, High: 2, Normal: 3, Low: 4 };
            unscheduledPumps.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            break;
          case 'Promise Date':
            unscheduledPumps.sort((a, b) => {
              const dateA = a.scheduledEnd ? new Date(a.scheduledEnd).getTime() : Infinity;
              const dateB = b.scheduledEnd ? new Date(b.scheduledEnd).getTime() : Infinity;
              return dateA - dateB;
            });
            break;
          case 'Best Fit':
            // "Best Fit" groups similar pumps together (by model)
            unscheduledPumps.sort((a, b) => a.model.localeCompare(b.model));
            break;
          default:
            // Default to Priority
            unscheduledPumps.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            break;
        }

        if (unscheduledPumps.length === 0) return;

        // 3. Schedule pumps sequentially
        let currentDate = new Date();
        const updatedPumps: Pump[] = [];
        const updatesForAdapter: Partial<Pump>[] = [];

        for (const pump of unscheduledPumps) {
          const leadTimes = getModelLeadTimes(pump.model);
          const fabricationLeadTime = leadTimes?.fabrication || 1;

          // Find the next available working day for the start date
          let nextWorkingDay = new Date(currentDate);
          // 0 = Sunday, 6 = Saturday
          while (nextWorkingDay.getDay() === 0 || nextWorkingDay.getDay() === 6) {
            nextWorkingDay.setDate(nextWorkingDay.getDate() + 1);
          }
          
          // Calculate the new scheduled start date
          const newScheduledStart = nextWorkingDay.toISOString().split('T')[0];
          
          // Calculate the end date for the next job's start
          const newEndDate = getWorkingDays(nextWorkingDay, fabricationLeadTime);
          
          // Update the pump
          const updatedPump = {
            ...pump,
            stage: "FABRICATION",
            scheduledStart: newScheduledStart,
            last_update: new Date().toISOString(),
          };
          updatedPumps.push(updatedPump);
          updatesForAdapter.push({ id: pump.id, stage: "FABRICATION", scheduledStart: newScheduledStart, last_update: updatedPump.last_update });

          // Set the current date for the next job to the new end date
          currentDate = newEndDate;
        }

        // 4. Update the state and adapter
        const nextPumps = pumps.map(p => {
          const updated = updatedPumps.find(up => up.id === p.id);
          return updated || p;
        });
        
        set({ pumps: nextPumps });
        adapter.upsertMany(updatesForAdapter as Pump[]);

        // 5. Level the schedule after auto-scheduling
        levelSchedule();
      },

      filtered: () => applyFilters(get().pumps, get().filters),

      getModelLeadTimes: (model: string) => {
        // This is a mock implementation. In a real scenario, this would come from a database or config file.
        const leadTimes: Record<string, Record<string, number>> = {
          "5-3000": { fabrication: 1.5, powder_coat: 0.5, assembly: 1, testing: 0.5 },
          "7-3000": { fabrication: 2, powder_coat: 0.5, assembly: 1.5, testing: 0.5 },
          "10-5000": { fabrication: 2.5, powder_coat: 1, assembly: 2, testing: 1 },
        };
        return leadTimes[model];
      },
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

