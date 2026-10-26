import type { AmenityId, CommunityEvent, Park, ParkFilters } from "@/lib/types";

export const CARD_AMENITY_PREVIEW = 4;

export function cardAmenityPreview(amenities: AmenityId[]): {
  shown: AmenityId[];
  hidden: AmenityId[];
} {
  return {
    shown: amenities.slice(0, CARD_AMENITY_PREVIEW),
    hidden: amenities.slice(CARD_AMENITY_PREVIEW),
  };
}

export function filterParks(
  parks: Park[],
  filters: ParkFilters,
  visitorAmenitiesFor: (parkId: string) => AmenityId[] = () => [],
): Park[] {
  const query = filters.query.trim().toLowerCase();
  return parks.filter((park) => {
    if (filters.town !== "All" && park.town !== filters.town) return false;
    const amenities = new Set<AmenityId>([...park.amenities, ...visitorAmenitiesFor(park.id)]);
    if (!filters.amenities.every((id) => amenities.has(id))) return false;
    if (!query) return true;
    const haystack = [
      park.name,
      park.town,
      park.summary,
      park.address,
      park.description,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

export function upcomingEvents(
  events: CommunityEvent[],
  now = new Date(),
  limit = 3,
): CommunityEvent[] {
  const byStart = (a: CommunityEvent, b: CommunityEvent) =>
    new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  const future = events
    .filter((event) => new Date(event.endsAt).getTime() >= now.getTime())
    .sort(byStart);
  if (future.length > 0) return future.slice(0, limit);
  return [...events].sort(byStart).slice(-limit);
}

export function eventsAtPark(events: CommunityEvent[], parkId: string): CommunityEvent[] {
  return events
    .filter((event) => event.parkId === parkId)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}
