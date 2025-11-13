import type { Stage } from "../types";

export const STAGE_SEQUENCE: Stage[] = [
  "UNSCHEDULED",
  "NOT STARTED",
  "FABRICATION",
  "POWDER COAT",
  "ASSEMBLY",
  "TESTING",
  "SHIPPING",
  "CLOSED",
];

export const PRODUCTION_STAGES: Stage[] = [
  "FABRICATION",
  "POWDER COAT",
  "ASSEMBLY",
  "TESTING",
  "SHIPPING",
];

export const STAGE_LABELS: Record<Stage, string> = {
  "UNSCHEDULED": "Unscheduled",
  "NOT STARTED": "Not Started",
  FABRICATION: "Fabrication",
  "POWDER COAT": "Powder Coat",
  ASSEMBLY: "Assembly",
  TESTING: "Testing",
  SHIPPING: "Shipping",
  CLOSED: "Closed",
};

export const STAGE_COLORS: Record<Stage, string> = {
  "UNSCHEDULED": "bg-gradient-to-r from-slate-500/30 to-slate-400/20",
  "NOT STARTED": "bg-gradient-to-r from-slate-500/40 to-slate-400/30",
  FABRICATION: "bg-gradient-to-r from-blue-500/70 to-sky-400/70",
  "POWDER COAT": "bg-gradient-to-r from-purple-500/70 to-fuchsia-400/70",
  ASSEMBLY: "bg-gradient-to-r from-amber-500/70 to-orange-400/70",
  TESTING: "bg-gradient-to-r from-rose-500/70 to-orange-400/70",
  SHIPPING: "bg-gradient-to-r from-emerald-500/70 to-lime-400/70",
  CLOSED: "bg-gradient-to-r from-cyan-500/70 to-blue-400/70",
};
