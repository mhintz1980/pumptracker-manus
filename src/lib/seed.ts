// src/lib/seed.ts
import { Pump, Stage, Priority } from "../types";
import { nanoid } from "nanoid";

const CUSTOMERS = ["Acme Corp", "Beta Solutions", "Gamma Industries", "Delta Tech", "Epsilon Energy", "Zeta Mfg"];
const MODELS = ["P-100", "P-250-HD", "P-500-SS", "P-750-HP"];
const STAGES: Stage[] = ["NOT STARTED", "FABRICATION", "POWDER COAT", "ASSEMBLY", "TESTING", "SHIPPING", "CLOSED"];
const COLORS = ["Red", "Blue", "Green", "Yellow", "Black", "White"];
const PRIORITIES: Priority[] = ["Low", "Normal", "High", "Rush", "Urgent"];

const usedSerials = new Set<number>();

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genSerial(): number {
  let serial: number;
  do {
    serial = getRandomInt(1000, 9999);
  } while (usedSerials.has(serial));
  usedSerials.add(serial);
  return serial;
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generatePump(): Pump {
  const customer = getRandomElement(CUSTOMERS);
  const model = getRandomElement(MODELS);
  const stage = getRandomElement(STAGES);
  const priority = getRandomElement(PRIORITIES);
  const hasColor = Math.random() > 0.5;
  const value = getRandomInt(5000, 50000);

  const now = new Date();
  const scheduledEnd = getRandomDate(new Date(now.getTime() - 6 * 7 * 24 * 60 * 60 * 1000), new Date(now.getTime() + 6 * 7 * 24 * 60 * 60 * 1000)).toISOString();
  const lastUpdate = getRandomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now).toISOString();

  return {
    id: nanoid(),
    serial: genSerial(),
    po: `PO-${getRandomInt(10000, 99999)}`,
    customer,
    model,
    stage,
    priority,
    powder_color: hasColor ? getRandomElement(COLORS) : undefined,
    last_update: lastUpdate,
    value,
    scheduledEnd,
  };
}

export function seed(count: number = 80): Pump[] {
  usedSerials.clear();
  const pumps: Pump[] = [];
  for (let i = 0; i < count; i++) {
    pumps.push(generatePump());
  }
  return pumps;
}

