"use client";

import { useMemo, useState } from "react";
import { List, Map } from "lucide-react";
import { parks } from "@/data/parks";
import { useCommunity } from "@/context/Community";
import { filterParks } from "@/lib/filters";
import { visitorAmenities } from "@/lib/report-rollup";
import type { ParkFilters } from "@/lib/types";
import { FilterBar } from "@/components/FilterBar";
import { MapView } from "@/components/MapView";
import { ParkCard } from "@/components/ParkCard";
import { cn } from "@/lib/utils";

const initialFilters: ParkFilters = { query: "", town: "All", amenities: [] };

export function ParkExplorer({
  heading = "Parks and facilities",
  intro = "Filter by town and by the access features your family actually needs. Selecting more than one feature shows parks that have all of them.",
}: {
  heading?: string;
  intro?: string;
}) {
  const { reports } = useCommunity();
  const [filters, setFilters] = useState<ParkFilters>(initialFilters);
  const [showMap, setShowMap] = useState(false);
  const matches = useMemo(
    () =>
      filterParks(parks, filters, (parkId) => {
        const park = parks.find((item) => item.id === parkId);
        return park ? visitorAmenities(reports, parkId, park.amenities) : [];
      }),
    [filters, reports],
  );

  return (
    <section id="parks" aria-labelledby="parks-heading" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 id="parks-heading" className="font-serif text-4xl font-semibold">
            {heading}
          </h2>
          <p className="mt-2 text-lg text-muted">{intro}</p>
        </div>
        <div className="flex rounded-full border border-line bg-paper p-1" role="group" aria-label="Directory view">
          <button
            type="button"
            aria-pressed={!showMap}
            onClick={() => setShowMap(false)}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold",
              !showMap ? "bg-pine text-on-pine" : "text-ink",
            )}
          >
            <List aria-hidden="true" className="h-4 w-4" />
            List
          </button>
          <button
            type="button"
            aria-pressed={showMap}
            onClick={() => setShowMap(true)}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold",
              showMap ? "bg-pine text-on-pine" : "text-ink",
            )}
          >
            <Map aria-hidden="true" className="h-4 w-4" />
            Map
          </button>
        </div>
      </div>

      <div className="mt-5">
        <FilterBar filters={filters} onChange={setFilters} resultCount={matches.length} />
      </div>

      {showMap ? (
        <div className="mt-5">
          <MapView parks={matches} />
        </div>
      ) : null}

      {matches.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-dashed border-line bg-paper p-6 text-lg" role="status">
          No parks match those filters. Clear one feature or switch the town back to all.
        </p>
      ) : (
        <ul className={cn("mt-5 grid gap-4", showMap ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3")}>
          {matches.map((park) => (
            <li key={park.id}>
              <ParkCard park={park} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
