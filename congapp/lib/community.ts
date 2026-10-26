import type {
  AccessibilityReport,
  AgeGroup,
  CommunityEvent,
  EventDraft,
  ReportDraft,
  SensoryLevel,
  StoredCommunity,
} from "@/lib/types";

export const DATA_VERSION = 1;

export function mergeCommunity(
  seedEvents: CommunityEvent[],
  seedReports: AccessibilityReport[],
  stored: StoredCommunity | null,
): { events: CommunityEvent[]; goingIds: string[]; reports: AccessibilityReport[] } {
  if (!stored || stored.version !== DATA_VERSION) {
    return { events: seedEvents, goingIds: [], reports: seedReports };
  }

  const savedById = new Map(stored.events.map((event) => [event.id, event]));
  const seedIds = new Set(seedEvents.map((event) => event.id));
  const events = [
    ...seedEvents.map((seed) => {
      const saved = savedById.get(seed.id);
      return saved ? { ...seed, rsvpCount: saved.rsvpCount } : seed;
    }),
    ...stored.events.filter((event) => !seedIds.has(event.id)),
  ];

  const seedReportIds = new Set(seedReports.map((report) => report.id));
  const reports = [
    ...seedReports,
    ...stored.reports.filter((report) => !seedReportIds.has(report.id)),
  ];

  const eventIds = new Set(events.map((event) => event.id));
  return {
    events,
    reports,
    goingIds: stored.goingIds.filter((id) => eventIds.has(id)),
  };
}

export function toggleRsvp(
  event: CommunityEvent,
  goingIds: string[],
): { event: CommunityEvent; goingIds: string[] } {
  const going = goingIds.includes(event.id);
  if (going) {
    return {
      event: { ...event, rsvpCount: Math.max(0, event.rsvpCount - 1) },
      goingIds: goingIds.filter((id) => id !== event.id),
    };
  }
  return {
    event: { ...event, rsvpCount: event.rsvpCount + 1 },
    goingIds: [...goingIds, event.id],
  };
}

export function validateEventDraft(
  draft: EventDraft,
  parkIds: string[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (typeof draft.title !== "string" || draft.title.trim().length < 3) {
    errors.title = "Add a title of at least 3 characters.";
  }
  if (!parkIds.includes(draft.parkId)) {
    errors.parkId = "Choose a park.";
  }
  if (!draft.startsAt) {
    errors.startsAt = "Choose a start date and time.";
  }
  if (!draft.endsAt) {
    errors.endsAt = "Choose an end time.";
  }
  if (draft.startsAt && draft.endsAt && draft.endsAt <= draft.startsAt) {
    errors.endsAt = "End time must be after the start time.";
  }
  if (!draft.ageGroup) {
    errors.ageGroup = "Choose an age group.";
  }
  if (!draft.sensoryLevel) {
    errors.sensoryLevel = "Choose a sensory level.";
  }
  if (typeof draft.description !== "string" || draft.description.trim().length < 10) {
    errors.description = "Add a short description of at least 10 characters.";
  }
  const capacity = Number(draft.capacity);
  if (!Number.isFinite(capacity) || capacity < 2 || capacity > 500) {
    errors.capacity = "Capacity should be a number from 2 to 500.";
  }
  return errors;
}

export function eventFromDraft(draft: EventDraft, id: string): CommunityEvent {
  return {
    id,
    title: draft.title.trim(),
    parkId: draft.parkId,
    startsAt: new Date(draft.startsAt).toISOString(),
    endsAt: new Date(draft.endsAt).toISOString(),
    ageGroup: draft.ageGroup as AgeGroup,
    sensoryLevel: draft.sensoryLevel as SensoryLevel,
    description: draft.description.trim(),
    host: (draft.host ?? "").trim() || "Community member",
    rsvpCount: 1,
    capacity: Number(draft.capacity),
  };
}

export function validateReportDraft(draft: ReportDraft, parkIds: string[]): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!parkIds.includes(draft.parkId)) {
    errors.parkId = "Choose a park.";
  }
  if (!draft.condition) {
    errors.condition = "Choose the condition you saw.";
  }
  if (!draft.feature) {
    errors.feature = "Choose which feature this is about.";
  }
  if (typeof draft.note !== "string" || draft.note.trim().length < 8) {
    errors.note = "Describe what you saw in at least 8 characters.";
  }
  return errors;
}

export function reportFromDraft(draft: ReportDraft, id: string, createdAt: string): AccessibilityReport {
  return {
    id,
    parkId: draft.parkId,
    condition: draft.condition as AccessibilityReport["condition"],
    feature: draft.feature as AccessibilityReport["feature"],
    note: draft.note.trim(),
    author: (draft.author ?? "").trim() || "Community member",
    createdAt,
    status: "pending",
    photoName: draft.photoName,
    photoDataUrl: draft.photoDataUrl,
  };
}
