// src/adapters/local.ts
import { Pump, DataAdapter } from "../types";
import { seed } from "../lib/seed";

const KEY = "pumptracker-data-v1";

export const LocalAdapter: DataAdapter = {
  async load(): Promise<Pump[]> {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : seed();
  },
  async replaceAll(rows: Pump[]) {
    localStorage.setItem(KEY, JSON.stringify(rows));
  },
  async upsertMany(rows: Pump[]) {
    const all = await this.load();
    const byId = new Map(all.map(r => [r.id, r]));
    rows.forEach(r => byId.set(r.id, r));
    localStorage.setItem(KEY, JSON.stringify([...byId.values()]));
  },
  async update(id: string, patch: Partial<Pump>) {
    const all = await this.load();
    const next = all.map(r => (r.id === id ? { ...r, ...patch } : r));
    localStorage.setItem(KEY, JSON.stringify(next));
  },
};

