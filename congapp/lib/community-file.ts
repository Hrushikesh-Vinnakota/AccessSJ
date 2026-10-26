import { eventFromDraft, reportFromDraft, validateEventDraft, validateReportDraft } from "@/lib/community";
import type { AccessibilityReport, CommunityEvent, EventDraft, ReportDraft, Rsvp } from "@/lib/types";

export interface CommunityFile {
  version: 1;
  events: CommunityEvent[];
  reports: AccessibilityReport[];
}

export const PHOTO_DATA_URL_LIMIT = 700_000;

export function addReportToCommunity(
  file: CommunityFile,
  draft: ReportDraft,
  id: string,
  createdAt: string,
  parkIds: string[],
): { ok: true; file: CommunityFile; id: string } | { ok: false; errors: Record<string, string> } {
  const errors = validateReportDraft(draft, parkIds);
  if (draft.photoDataUrl && draft.photoDataUrl.length > PHOTO_DATA_URL_LIMIT) {
    errors.photo = "That photo is too large to store.";
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  const created = reportFromDraft(draft, id, createdAt);
  return { ok: true, id, file: { ...file, reports: [created, ...file.reports] } };
}

export function updateReportInCommunity(
  file: CommunityFile,
  id: string,
  draft: ReportDraft,
  parkIds: string[],
): { ok: true; file: CommunityFile } | { ok: false; errors: Record<string, string> } | { ok: false; error: string } {
  const index = file.reports.findIndex((report) => report.id === id);
  if (index < 0) return { ok: false, error: "That report is not on the list." };
  const errors = validateReportDraft(draft, parkIds);
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  const current = file.reports[index];
  const next = reportFromDraft(draft, current.id, current.createdAt);
  const reports = file.reports.slice();
  reports[index] = {
    ...next,
    status: current.status === "approved" ? "approved" : "pending",
    photoName: draft.photoName ?? current.photoName,
    photoDataUrl: draft.photoDataUrl ?? current.photoDataUrl,
  };
  return { ok: true, file: { ...file, reports } };
}

export function approveReportInCommunity(
  file: CommunityFile,
  id: string,
): { ok: true; file: CommunityFile } | { ok: false; error: string } {
  if (!file.reports.some((report) => report.id === id)) return { ok: false, error: "That report is not on the list." };
  return {
    ok: true,
    file: {
      ...file,
      reports: file.reports.map((report) => (report.id === id ? { ...report, status: "approved" } : report)),
    },
  };
}

export function deleteReportFromCommunity(
  file: CommunityFile,
  id: string,
): { ok: true; file: CommunityFile } | { ok: false; error: string } {
  if (!file.reports.some((report) => report.id === id)) return { ok: false, error: "That report is not on the list." };
  return { ok: true, file: { ...file, reports: file.reports.filter((report) => report.id !== id) } };
}

export function addEventToCommunity(
  file: CommunityFile,
  draft: EventDraft,
  id: string,
  parkIds: string[],
): { ok: true; file: CommunityFile; id: string } | { ok: false; errors: Record<string, string> } {
  const errors = validateEventDraft(draft, parkIds);
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  const created = eventFromDraft(draft, id);
  return { ok: true, id, file: { ...file, events: [...file.events, created] } };
}

export function countsFromRsvps(events: CommunityEvent[], rsvps: Rsvp[]): CommunityEvent[] {
  return events.map((event) => ({
    ...event,
    rsvpCount: rsvps.filter((rsvp) => rsvp.eventId === event.id).length,
  }));
}

export function addNamedRsvp(
  events: CommunityEvent[],
  rsvps: Rsvp[],
  eventId: string,
  name: string,
  id: string,
  createdAt: string,
): { ok: true; rsvps: Rsvp[] } | { ok: false; error: string } {
  const event = events.find((item) => item.id === eventId);
  if (!event) return { ok: false, error: "That playdate is not on the list." };
  const trimmed = name.trim();
  if (trimmed.length < 2) return { ok: false, error: "Add a name of at least 2 characters." };
  const count = rsvps.filter((rsvp) => rsvp.eventId === eventId).length;
  if (count >= event.capacity) return { ok: false, error: `${event.title} is full.` };
  return { ok: true, rsvps: [...rsvps, { id, eventId, name: trimmed, createdAt }] };
}

export function removeNamedRsvp(rsvps: Rsvp[], id: string): Rsvp[] {
  return rsvps.filter((rsvp) => rsvp.id !== id);
}
