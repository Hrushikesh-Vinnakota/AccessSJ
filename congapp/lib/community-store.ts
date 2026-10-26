import { promises as fs } from "fs";
import path from "path";
import { seedEvents } from "@/data/events";
import { seedReports } from "@/data/reports";
import {
  addEventToCommunity,
  addNamedRsvp,
  addReportToCommunity,
  approveReportInCommunity,
  countsFromRsvps,
  deleteReportFromCommunity,
  removeNamedRsvp,
  updateReportInCommunity,
  type CommunityFile,
} from "@/lib/community-file";
import { DATA_VERSION, mergeCommunity } from "@/lib/community";
import type { AccessibilityReport, CommunityEvent, EventDraft, ReportDraft, Rsvp } from "@/lib/types";

const STORE_PATH = path.join(process.cwd(), "data", "community-store.json");
const RSVP_PATH = path.join(process.cwd(), "data", "rsvps.json");

export interface CommunitySnapshot {
  events: CommunityEvent[];
  reports: AccessibilityReport[];
  rsvps: Rsvp[];
}

let chain: Promise<unknown> = Promise.resolve();

function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(task, task);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function emptyFile(): CommunityFile {
  return { version: 1, events: [], reports: [] };
}

async function readEventsFile(): Promise<CommunityFile> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<CommunityFile>;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.events) || !Array.isArray(parsed.reports)) {
      return emptyFile();
    }
    return {
      version: 1,
      events: parsed.events,
      reports: parsed.reports.map((report) => ({
        ...report,
        status: report.status === "approved" ? "approved" : "pending",
      })),
    };
  } catch {
    return emptyFile();
  }
}

async function readRsvps(): Promise<Rsvp[]> {
  try {
    const raw = await fs.readFile(RSVP_PATH, "utf8");
    const parsed = JSON.parse(raw) as { version?: number; rsvps?: Rsvp[] };
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.rsvps)) return [];
    return parsed.rsvps.filter(
      (rsvp) => rsvp && typeof rsvp.id === "string" && typeof rsvp.eventId === "string" && typeof rsvp.name === "string",
    );
  } catch {
    return [];
  }
}

export function presentCommunity(file: CommunityFile): CommunityFile {
  const merged = mergeCommunity(seedEvents, seedReports, {
    version: DATA_VERSION,
    events: file.events,
    goingIds: [],
    reports: file.reports,
  });
  return { version: 1, events: merged.events, reports: merged.reports };
}

function snapshot(file: CommunityFile, rsvps: Rsvp[]): CommunitySnapshot {
  const presented = presentCommunity(file);
  return {
    events: countsFromRsvps(presented.events, rsvps),
    reports: presented.reports,
    rsvps,
  };
}

async function writeEvents(file: CommunityFile): Promise<void> {
  await fs.writeFile(STORE_PATH, `${JSON.stringify(file, null, 2)}\n`, "utf8");
}

async function writeRsvps(rsvps: Rsvp[]): Promise<void> {
  await fs.writeFile(RSVP_PATH, `${JSON.stringify({ version: 1, rsvps }, null, 2)}\n`, "utf8");
}

export async function loadCommunity(): Promise<CommunitySnapshot> {
  return withLock(async () => snapshot(await readEventsFile(), await readRsvps()));
}

export async function storeReport(
  draft: ReportDraft,
  id: string,
  createdAt: string,
  parkIds: string[],
): Promise<{ ok: true; snapshot: CommunitySnapshot; id: string } | { ok: false; errors: Record<string, string> }> {
  return withLock(async () => {
    const current = presentCommunity(await readEventsFile());
    const rsvps = await readRsvps();
    const result = addReportToCommunity(current, draft, id, createdAt, parkIds);
    if (!result.ok) return result;
    await writeEvents(result.file);
    return { ok: true, id, snapshot: snapshot(result.file, rsvps) };
  });
}

export async function storeEvent(
  draft: EventDraft,
  id: string,
  parkIds: string[],
  rsvpId: string,
  createdAt: string,
): Promise<{ ok: true; snapshot: CommunitySnapshot; id: string } | { ok: false; errors: Record<string, string> }> {
  return withLock(async () => {
    const current = presentCommunity(await readEventsFile());
    const rsvps = await readRsvps();
    const result = addEventToCommunity(current, draft, id, parkIds);
    if (!result.ok) return result;
    const created = result.file.events.find((event) => event.id === id);
    const named = addNamedRsvp(result.file.events, rsvps, id, created?.host ?? "Community member", rsvpId, createdAt);
    if (!named.ok) return { ok: false, errors: { form: named.error } };
    await writeEvents(result.file);
    await writeRsvps(named.rsvps);
    return { ok: true, id, snapshot: snapshot(result.file, named.rsvps) };
  });
}

export async function storeAddRsvp(
  eventId: string,
  name: string,
  id: string,
  createdAt: string,
): Promise<{ ok: true; snapshot: CommunitySnapshot } | { ok: false; error: string }> {
  return withLock(async () => {
    const file = presentCommunity(await readEventsFile());
    const rsvps = await readRsvps();
    const result = addNamedRsvp(file.events, rsvps, eventId, name, id, createdAt);
    if (!result.ok) return result;
    await writeRsvps(result.rsvps);
    return { ok: true, snapshot: snapshot(file, result.rsvps) };
  });
}

export async function storeUpdateReport(
  id: string,
  draft: ReportDraft,
  parkIds: string[],
): Promise<{ ok: true; snapshot: CommunitySnapshot } | { ok: false; errors: Record<string, string> } | { ok: false; error: string }> {
  return withLock(async () => {
    const current = presentCommunity(await readEventsFile());
    const result = updateReportInCommunity(current, id, draft, parkIds);
    if (!result.ok) return result;
    await writeEvents(result.file);
    return { ok: true, snapshot: snapshot(result.file, await readRsvps()) };
  });
}

export async function storeApproveReport(
  id: string,
): Promise<{ ok: true; snapshot: CommunitySnapshot } | { ok: false; error: string }> {
  return withLock(async () => {
    const current = presentCommunity(await readEventsFile());
    const result = approveReportInCommunity(current, id);
    if (!result.ok) return result;
    await writeEvents(result.file);
    return { ok: true, snapshot: snapshot(result.file, await readRsvps()) };
  });
}

export async function storeDeleteReport(
  id: string,
): Promise<{ ok: true; snapshot: CommunitySnapshot } | { ok: false; error: string }> {
  return withLock(async () => {
    const current = presentCommunity(await readEventsFile());
    const result = deleteReportFromCommunity(current, id);
    if (!result.ok) return result;
    await writeEvents(result.file);
    return { ok: true, snapshot: snapshot(result.file, await readRsvps()) };
  });
}

export async function storeRemoveRsvp(id: string): Promise<CommunitySnapshot> {
  return withLock(async () => {
    const file = presentCommunity(await readEventsFile());
    const rsvps = removeNamedRsvp(await readRsvps(), id);
    await writeRsvps(rsvps);
    return snapshot(file, rsvps);
  });
}
