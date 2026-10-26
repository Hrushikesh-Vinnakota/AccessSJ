export const TOWNS = [
  "Stockton",
  "Tracy",
  "Lodi",
  "Manteca",
  "Mountain House",
] as const;

export type Town = (typeof TOWNS)[number];

export const AMENITY_IDS = [
  "wheelchair-paths",
  "adaptive-swings",
  "paved-surface",
  "woodchip-surface",
  "accessible-restrooms",
  "changing-station",
  "sensory-friendly",
  "loaner-equipment",
] as const;

export type AmenityId = (typeof AMENITY_IDS)[number];

export const AGE_GROUPS = [
  "Toddlers",
  "Children",
  "Teens",
  "Adults",
  "Seniors",
  "All ages",
] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number];

export const SENSORY_LEVELS = ["Low Sensory", "Moderate", "Active Play"] as const;

export type SensoryLevel = (typeof SENSORY_LEVELS)[number];

export const REPORT_CONDITIONS = ["good", "needs-attention", "blocked"] as const;

export type ReportCondition = (typeof REPORT_CONDITIONS)[number];

export const REPORT_STATUSES = ["pending", "approved"] as const;

export type ReportStatus = (typeof REPORT_STATUSES)[number];

export interface ParkPhoto {
  src: string;
  alt: string;
}

export interface CommunityNote {
  id: string;
  author: string;
  date: string;
  text: string;
}

export interface Park {
  id: string;
  slug: string;
  name: string;
  town: Town;
  address: string;
  lat: number;
  lng: number;
  summary: string;
  description: string;
  hours: string;
  website: string;
  websiteLabel: string;
  amenities: AmenityId[];
  amenityNotes: Partial<Record<AmenityId, string>>;
  photos: ParkPhoto[];
  communityNotes: CommunityNote[];
}

export interface Rsvp {
  id: string;
  eventId: string;
  name: string;
  createdAt: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  parkId: string;
  startsAt: string;
  endsAt: string;
  ageGroup: AgeGroup;
  sensoryLevel: SensoryLevel;
  description: string;
  host: string;
  rsvpCount: number;
  capacity: number;
}

export interface AccessibilityReport {
  id: string;
  parkId: string;
  condition: ReportCondition;
  feature: AmenityId | "general";
  note: string;
  author: string;
  createdAt: string;
  status: ReportStatus;
  photoName?: string;
  photoDataUrl?: string;
}

export interface ParkFilters {
  query: string;
  town: Town | "All";
  amenities: AmenityId[];
}

export interface EventDraft {
  title: string;
  parkId: string;
  startsAt: string;
  endsAt: string;
  ageGroup: AgeGroup | "";
  sensoryLevel: SensoryLevel | "";
  description: string;
  host: string;
  capacity: string;
}

export interface ReportDraft {
  parkId: string;
  condition: ReportCondition | "";
  feature: AmenityId | "general" | "";
  note: string;
  author: string;
  photoName?: string;
  photoDataUrl?: string;
}

export interface StoredCommunity {
  version: number;
  events: CommunityEvent[];
  goingIds: string[];
  reports: AccessibilityReport[];
}
