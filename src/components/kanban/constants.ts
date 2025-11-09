import { Priority, Stage } from "../../types";

export const PRIORITY_DOT: Record<Priority, string> = {
  Low: "bg-blue-500",
  Normal: "bg-sky-500",
  High: "bg-orange-500",
  Rush: "bg-amber-500",
  Urgent: "bg-red-500",
};

export const KANBAN_STAGES: Stage[] = [
  "NOT STARTED",
  "FABRICATION",
  "POWDER COAT",
  "ASSEMBLY",
  "TESTING",
  "SHIPPING",
  "CLOSED",
];
