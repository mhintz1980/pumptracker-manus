import { Priority } from "../../types";
export { STAGE_COLORS, STAGE_SEQUENCE, PRODUCTION_STAGES, STAGE_LABELS } from "../../lib/stage-constants";

export const PRIORITY_DOT: Record<Priority, string> = {
  Low: "bg-blue-500",
  Normal: "bg-sky-500",
  High: "bg-orange-500",
  Rush: "bg-amber-500",
  Urgent: "bg-red-500",
};
