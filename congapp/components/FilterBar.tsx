"use client";

import { Search, X } from "lucide-react";
import { AMENITIES } from "@/lib/amenities";
import { TOWNS, type AmenityId, type ParkFilters, type Town } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FilterBar({
  filters,
  onChange,
  resultCount,
}: {
  filters: ParkFilters;
  onChange: (next: ParkFilters) => void;
  resultCount: number;
}) {
  function toggleAmenity(id: AmenityId) {
    const has = filters.amenities.includes(id);
    onChange({
      ...filters,
      amenities: has ? filters.amenities.filter((item) => item !== id) : [...filters.amenities, id],
    });
  }

  function setTown(town: Town | "All") {
    onChange({ ...filters, town });
  }

  const active = filters.query.trim().length > 0 || filters.town !== "All" || filters.amenities.length > 0;

  return (
    <div className="rounded-3xl border border-line bg-paper p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="park-search" className="text-sm font-semibold">
          Search parks
        </label>
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            id="park-search"
            type="search"
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            placeholder="Try garden, lake, swing, Tracy…"
            autoComplete="off"
            className="min-h-12 w-full rounded-2xl border border-line bg-cream py-2 pl-11 pr-12 text-base"
          />
          {filters.query ? (
            <button
              type="button"
              className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full hover:bg-soft"
              onClick={() => onChange({ ...filters, query: "" })}
            >
              <X aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          ) : null}
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm font-semibold">Town</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          <TownButton current={filters.town} value="All" onSelect={setTown} />
          {TOWNS.map((town) => (
            <TownButton key={town} current={filters.town} value={town} onSelect={setTown} />
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="text-sm font-semibold">Accessibility features</legend>
        <p id="amenity-hint" className="mt-1 text-sm text-muted">
          A park is shown only when it has every feature you turn on.
        </p>
        <div className="mt-2 flex flex-wrap gap-2" role="group" aria-describedby="amenity-hint">
          {AMENITIES.map((amenity) => {
            const pressed = filters.amenities.includes(amenity.id);
            const Icon = amenity.icon;
            return (
              <button
                key={amenity.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => toggleAmenity(amenity.id)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border px-3 text-left text-sm font-semibold",
                  pressed ? "border-pine bg-pine text-on-pine" : "border-line bg-cream text-ink hover:bg-soft",
                )}
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                {amenity.short}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm font-semibold">
          {resultCount} {resultCount === 1 ? "park" : "parks"} match
        </p>
        {active ? (
          <button
            type="button"
            className="min-h-11 rounded-full px-3 text-sm font-semibold underline"
            onClick={() => onChange({ query: "", town: "All", amenities: [] })}
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}

function TownButton({
  current,
  value,
  onSelect,
}: {
  current: Town | "All";
  value: Town | "All";
  onSelect: (value: Town | "All") => void;
}) {
  const pressed = current === value;
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onSelect(value)}
      className={cn(
        "min-h-11 rounded-full border px-3 text-sm font-semibold",
        pressed ? "border-pine bg-pine text-on-pine" : "border-line bg-cream text-ink hover:bg-soft",
      )}
    >
      {value === "All" ? "All towns" : value}
    </button>
  );
}
