import { seedEvents } from "@/data/events";
import { parks } from "@/data/parks";
import { seedReports } from "@/data/reports";
import type { Park } from "@/lib/types";

export function loadParks(): Park[] {
  return parks;
}

export function loadSeedEvents() {
  return seedEvents;
}

export function loadSeedReports() {
  return seedReports;
}

export function findPark(idOrSlug: string): Park | undefined {
  return parks.find((park) => park.id === idOrSlug || park.slug === idOrSlug);
}
