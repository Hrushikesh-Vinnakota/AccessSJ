"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { AccessibilityBadge } from "@/components/AccessibilityBadge";
import { Photo } from "@/components/Photo";
import { amenityById } from "@/lib/amenities";
import { useCommunity } from "@/context/Community";
import { cardAmenityPreview } from "@/lib/filters";
import { currentIssues, visitorAmenities } from "@/lib/report-rollup";
import type { Park } from "@/lib/types";

export function ParkCard({ park }: { park: Park }) {
  const { reports, ready } = useCommunity();
  const photo = park.photos[0];
  const visitor = visitorAmenities(reports, park.id, park.amenities);
  const issues = currentIssues(reports, park.id);
  const preview = cardAmenityPreview(park.amenities);
  const [open, setOpen] = useState(false);
  const visible = open ? park.amenities : preview.shown;
  const hiddenNames = preview.hidden.map((id) => amenityById(id).short);
  const listId = `${park.id}-amenities`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-card">
      <Link href={`/parks/${park.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-soft">
        {photo ? <Photo photo={photo} fallback={park.name} className="absolute inset-0" /> : null}
        <span className="sr-only">View {park.name}</span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="inline-flex items-center gap-1 text-sm font-semibold text-pine">
            <MapPin aria-hidden="true" className="h-4 w-4" />
            {park.town}
          </p>
          <h3 className="mt-1 font-serif text-2xl font-semibold leading-tight">
            <Link href={`/parks/${park.slug}`} className="underline decoration-transparent underline-offset-4 hover:decoration-current">
              {park.name}
            </Link>
          </h3>
        </div>
        <p className="text-base text-muted">{park.summary}</p>
        <ul id={listId} className="mt-auto flex flex-wrap gap-2" aria-label={`Accessibility features at ${park.name}`}>
          {park.amenities.length === 0 ? (
            <li className="text-sm font-semibold text-muted">Not listed on the public park page.</li>
          ) : null}
          {visible.map((id) => (
            <li key={id}>
              <AccessibilityBadge id={id} compact />
            </li>
          ))}
          {visitor.map((id) => (
            <li key={id}>
              <AccessibilityBadge id={id} compact visitor />
            </li>
          ))}
          {ready && issues.length > 0 ? (
            <li className="basis-full text-sm font-semibold">
              <Link href={`/parks/${park.slug}#reports`} className="underline underline-offset-2">
                {issues.length === 1 ? "1 current issue" : `${issues.length} current issues`}
              </Link>
            </li>
          ) : null}
          {preview.hidden.length > 0 ? (
            <li>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={listId}
                className="inline-flex min-h-11 items-center rounded-full border border-pine bg-paper px-3 text-sm font-semibold text-pine underline decoration-pine/40 underline-offset-2 hover:bg-soft"
                onClick={() => setOpen((current) => !current)}
              >
                {open ? "Show fewer" : `+${preview.hidden.length} more`}
                <span className="sr-only">
                  {open
                    ? ` features at ${park.name}`
                    : `, ${hiddenNames.join(", ")}, at ${park.name}`}
                </span>
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
}
