/**
 * The camera plan from the Hikvision planner (hikvision-camera-planner.tsx),
 * kept in sessionStorage so the thank-you page can put it in the WhatsApp
 * message. Its own file so the thank-you page doesn't load the planner.
 */
export type HikvisionPlan = { spots: string[]; inside: boolean; rooms?: string[]; count: number };

const STORAGE_KEY = "hikvisionPlan";

export function savePlan(plan: HikvisionPlan): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch {
    /* storage blocked: the plan just doesn't travel */
  }
}

export function readPlan(): HikvisionPlan | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const plan = JSON.parse(raw) as HikvisionPlan;
    return Array.isArray(plan.spots) && (plan.spots.length > 0 || (plan.rooms?.length ?? 0) > 0) ? plan : null;
  } catch {
    return null;
  }
}

function sentenceList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** The plan for the lead and Will's Zap (migration 0024), count first:
 *  "4 cameras. Outside: front door, drive and car, back door. Inside: hall." */
export function planForLead(plan: HikvisionPlan): string {
  const parts = [`${plan.count} camera${plan.count === 1 ? "" : "s"}.`];
  if (plan.spots.length) parts.push(`Outside: ${plan.spots.map((s) => s.toLowerCase()).join(", ")}.`);
  if (plan.rooms?.length) parts.push(`Inside: ${plan.rooms.map((r) => r.toLowerCase()).join(", ")}.`);
  return parts.join(" ");
}

/** The plan this visitor made on a planner, if any, ready for the lead. */
export function storedPlanForLead(): string | undefined {
  const plan = readPlan();
  return plan ? planForLead(plan) : undefined;
}

/** The plan as one line: "front door, drive and car and back door: 3 cameras". */
export function describePlan(plan: HikvisionPlan): string {
  const where = sentenceList(plan.spots.map((s) => s.toLowerCase()));
  const count = `${plan.count} camera${plan.count === 1 ? "" : "s"}`;
  const rooms = plan.rooms?.length ? sentenceList(plan.rooms.map((r) => r.toLowerCase())) : "";
  if (rooms) return `${where}, and inside: ${rooms}. ${count}`;
  return plan.inside ? `${where}, plus one inside: ${count}` : `${where}: ${count}`;
}
