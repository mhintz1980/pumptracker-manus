import { addBusinessDays, differenceInCalendarDays, startOfDay } from "date-fns";
import type { Pump, Stage } from "../types";

const STAGE_SEQUENCE: Stage[] = [
  "FABRICATION",
  "POWDER COAT",
  "ASSEMBLY",
  "TESTING",
  "SHIPPING",
];

type StageKey = "fabrication" | "powder_coat" | "assembly" | "testing" | "shipping" | "total_days";

export interface StageDurations {
  fabrication: number;
  powder_coat: number;
  assembly: number;
  testing: number;
  shipping?: number;
  total_days?: number;
}

export interface StageBlock {
  stage: Stage;
  start: Date;
  end: Date;
  days: number;
  pump: Pump;
}

export interface CalendarStageEvent {
  id: string;
  pumpId: string;
  stage: Stage;
  title: string;
  subtitle: string;
  week: number;
  startDay: number;
  span: number;
  row: number;
  startDate: Date;
  endDate: Date;
}

export interface BuildCalendarEventsOptions {
  pumps: Pump[];
  viewStart: Date;
  days: number;
  leadTimeLookup: (model: string) => StageDurations | undefined;
}

const STAGE_ROWS: Record<Stage, number> = {
  "UNSCHEDULED": 0,
  "NOT STARTED": 1,
  FABRICATION: 2,
  "POWDER COAT": 3,
  ASSEMBLY: 4,
  TESTING: 5,
  SHIPPING: 6,
  CLOSED: 7,
};

const STAGE_TO_KEY: Record<Exclude<Stage, "NOT STARTED" | "CLOSED">, StageKey> = {
  FABRICATION: "fabrication",
  "POWDER COAT": "powder_coat",
  ASSEMBLY: "assembly",
  TESTING: "testing",
  SHIPPING: "shipping",
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const normalizeDays = (value?: number) => Math.max(1, Math.ceil(value ?? 0));

export interface ScheduleWindow {
  startISO: string;
  endISO: string;
}

export function isValidScheduleDate(date: Date, today: Date = startOfDay(new Date())): boolean {
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  return differenceInCalendarDays(date, today) >= 0;
}

function deriveShippingDays(raw: StageDurations, roundedSum: number): number {
  if (typeof raw.shipping === "number") {
    return normalizeDays(raw.shipping);
  }

  if (typeof raw.total_days === "number") {
    const remainder = Math.max(raw.total_days - roundedSum, 0);
    return normalizeDays(remainder || 1);
  }

  return 1;
}

function sanitizeDurations(raw: StageDurations) {
  const baseStages = STAGE_SEQUENCE.slice(0, 4) as Array<Exclude<Stage, "NOT STARTED" | "CLOSED">>;
  const durations = baseStages.map((stage) => {
    const key = STAGE_TO_KEY[stage];
    return { stage, days: normalizeDays((raw as Record<StageKey, number | undefined>)[key] as number | undefined) };
  });

  const roundedSum = durations.reduce((sum, entry) => sum + entry.days, 0);
  const shippingDays = deriveShippingDays(raw, roundedSum);
  durations.push({ stage: "SHIPPING", days: shippingDays });

  return durations;
}

function resolveScheduleStart(pump: Pump, totalDays: number): Date {
  if (pump.scheduledStart) {
    return startOfDay(new Date(pump.scheduledStart));
  }

  if (pump.scheduledEnd) {
    return startOfDay(addBusinessDays(new Date(pump.scheduledEnd), -totalDays));
  }

  return startOfDay(new Date());
}

export function buildStageTimeline(
  pump: Pump,
  leadTimes: StageDurations,
  options?: { startDate?: Date }
): StageBlock[] {
  const durations = sanitizeDurations(leadTimes);
  if (durations.length === 0) {
    return [];
  }

  const totalDays = durations.reduce((sum, entry) => sum + entry.days, 0);
  const timelineStart = startOfDay(options?.startDate ?? resolveScheduleStart(pump, totalDays));

  let cursor = timelineStart;
  return durations.map((entry) => {
    const start = cursor;
    const end = addBusinessDays(start, entry.days);
    cursor = end;
    return { stage: entry.stage, start, end, days: entry.days, pump };
  });
}

function buildEventSegments(
  pump: Pump,
  block: StageBlock,
  viewStart: Date,
  totalDays: number
): CalendarStageEvent[] {
  const segments: CalendarStageEvent[] = [];
  const startOffset = differenceInCalendarDays(block.start, viewStart);
  const endOffset = differenceInCalendarDays(block.end, viewStart);

  if (endOffset <= 0 || startOffset >= totalDays) {
    return segments;
  }

  let cursor = clamp(startOffset, 0, totalDays - 1);
  let remaining = Math.max(1, clamp(endOffset, 0, totalDays) - cursor);

  while (remaining > 0) {
    const startDay = ((cursor % 7) + 7) % 7;
    const week = Math.floor(cursor / 7);
    const capacity = Math.min(remaining, 7 - startDay);

    segments.push({
      id: `${pump.id}-${block.stage}-${segments.length}`,
      pumpId: pump.id,
      stage: block.stage,
      title: pump.model,
      subtitle: pump.po,
      week,
      startDay,
      span: Math.max(1, capacity),
      row: STAGE_ROWS[block.stage],
      startDate: block.start,
      endDate: block.end,
    });

    cursor += capacity;
    remaining -= capacity;
  }

  return segments;
}

export function buildCalendarEvents({
  pumps,
  viewStart,
  days,
  leadTimeLookup,
}: BuildCalendarEventsOptions): CalendarStageEvent[] {
  const viewStartDay = startOfDay(viewStart);

  return pumps.flatMap((pump) => {
    const leadTimes = leadTimeLookup(pump.model);
    if (!leadTimes) {
      return [];
    }
    const timeline = buildStageTimeline(pump, leadTimes);
    return timeline.flatMap((block) => buildEventSegments(pump, block, viewStartDay, days));
  });
}

export function getScheduleWindow(blocks: StageBlock[]): ScheduleWindow | null {
  if (!blocks.length) {
    return null;
  }

  const startISO = blocks[0].start.toISOString();
  const endISO = blocks[blocks.length - 1].end.toISOString();
  return { startISO, endISO };
}

export function deriveScheduleWindow(
  pump: Pump,
  leadTimes: StageDurations,
  dropDate: Date
): { timeline: StageBlock[]; window: ScheduleWindow } | null {
  const start = startOfDay(dropDate);
  const timeline = buildStageTimeline(pump, leadTimes, { startDate: start });
  const window = getScheduleWindow(timeline);
  if (!window) {
    return null;
  }
  return { timeline, window };
}
