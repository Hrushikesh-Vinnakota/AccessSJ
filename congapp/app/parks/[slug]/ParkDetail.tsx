"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Navigation } from "lucide-react";
import { AccessibilityBadge } from "@/components/AccessibilityBadge";
import { EventCard } from "@/components/EventCard";
import { Photo } from "@/components/Photo";
import { ReportForm } from "@/components/ReportForm";
import { eventsAtPark } from "@/lib/filters";
import { mapsDirectionsUrl, mapsSearchUrl } from "@/lib/format";
import { CONDITION_LABELS, amenityById } from "@/lib/amenities";
import { currentIssues, latestReportForFeature, reportFeatureLabel, visitorAmenities, visitorBadgeNote } from "@/lib/report-rollup";
import type { Park } from "@/lib/types";
import { useCommunity } from "@/context/Community";

export function ParkDetail({ park }: { park: Park }) {
  const { events, reports } = useCommunity();
  const visitor = visitorAmenities(reports, park.id, park.amenities);
  const issues = currentIssues(reports, park.id);
  const [active, setActive] = useState(0);
  const photo = park.photos[active] ?? park.photos[0];
  const here = eventsAtPark(events, park.id);

  return (
    <article className="mx-auto max-w-page px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm font-semibold">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="underline underline-offset-2">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/parks" className="underline underline-offset-2">
              Parks
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{park.name}</li>
        </ol>
      </nav>

      <header className="mt-4 max-w-3xl">
        <p className="font-semibold text-pine">{park.town}</p>
        <h1 className="mt-1 font-serif text-5xl font-semibold leading-tight">{park.name}</h1>
        <p className="mt-3 text-lg text-muted">{park.description}</p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-soft">
            {photo ? <Photo photo={photo} fallback={park.name} className="absolute inset-0 h-full w-full object-cover" /> : null}
          </div>
          {park.photos.length > 1 ? (
            <ul className="mt-3 flex gap-2" aria-label="Photos">
              {park.photos.map((item, index) => (
                <li key={item.src}>
                  <button
                    type="button"
                    aria-pressed={index === active}
                    aria-label={`Show photo ${index + 1}: ${item.alt}`}
                    onClick={() => setActive(index)}
                    className={`relative h-20 w-28 overflow-hidden rounded-2xl border-2 ${index === active ? "border-pine" : "border-transparent"}`}
                  >
                    <Photo photo={item} fallback={park.name} className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <aside className="h-fit rounded-3xl border border-line bg-paper p-5 shadow-card">
          <h2 className="font-serif text-2xl font-semibold">Visit</h2>
          <dl className="mt-3 space-y-3 text-base">
            <div>
              <dt className="text-sm font-semibold text-muted">Address</dt>
              <dd>{park.address}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-muted">Hours</dt>
              <dd>{park.hours}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-col gap-2">
            <a
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-pine px-4 font-semibold text-on-pine"
              href={mapsDirectionsUrl(park.lat, park.lng)}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation aria-hidden="true" className="h-4 w-4" />
              Directions in Google Maps
            </a>
            <a
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line px-4 font-semibold"
              href={mapsSearchUrl(park.name, park.address)}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
              Open the place in Google Maps
            </a>
            <a className="inline-flex min-h-11 items-center justify-center rounded-full px-4 font-semibold underline" href={park.website} target="_blank" rel="noreferrer">
              {park.websiteLabel}
            </a>
          </div>
        </aside>
      </div>

      <section className="mt-10" aria-labelledby="amenity-heading">
        <h2 id="amenity-heading" className="font-serif text-3xl font-semibold">
          Accessibility on site
        </h2>
        <p className="mt-2 max-w-3xl text-muted">
          A solid badge is shown when a public source names that feature. A dashed visitor badge is shown when the newest report says the feature works. A later problem report removes that visitor badge and becomes a current issue.
        </p>
        {park.amenities.length === 0 && visitor.length === 0 ? (
          <p className="mt-4 text-muted">No access badges yet. A visit can add one.</p>
        ) : null}
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {park.amenities.map((id) => {
            const meta = amenityById(id);
            const latest = latestReportForFeature(reports, park.id, id);
            return (
              <li key={id} className="rounded-3xl border border-line bg-paper p-4">
                <AccessibilityBadge id={id} />
                <p className="mt-2 text-sm text-muted">{meta.description}</p>
                {park.amenityNotes[id] ? <p className="mt-2">{park.amenityNotes[id]}</p> : null}
                {latest?.condition === "good" ? <p className="mt-2">Visitors also reported this works. {latest.note}</p> : null}
                {latest && latest.condition !== "good" ? (
                  <p className="mt-2">
                    Latest visit: {CONDITION_LABELS[latest.condition]}. {latest.note}
                  </p>
                ) : null}
              </li>
            );
          })}
          {visitor.map((id) => {
            const meta = amenityById(id);
            return (
              <li key={id} className="rounded-3xl border border-dashed border-pine bg-paper p-4">
                <AccessibilityBadge id={id} visitor />
                <p className="mt-2 text-sm text-muted">{meta.description}</p>
                <p className="mt-2">{visitorBadgeNote(reports, park.id, id)}</p>
              </li>
            );
          })}
        </ul>
        {issues.length > 0 ? (
          <div className="mt-4">
            <h3 className="font-semibold">Current issues</h3>
            <ul className="mt-2 space-y-2">
              {issues.map((issue) => (
                <li key={issue.id}>
                  <p className="font-semibold">
                    {CONDITION_LABELS[issue.condition]} · {reportFeatureLabel(issue.feature)}
                  </p>
                  <p>{issue.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="mt-10" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="font-serif text-3xl font-semibold">
          Community notes
        </h2>
        {park.communityNotes.length === 0 ? (
          <p className="mt-3 text-muted">No family notes yet.</p>
        ) : null}
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {park.communityNotes.map((note) => (
            <li key={note.id} className="rounded-3xl border border-line bg-soft p-4">
              <p>{note.text}</p>
              <p className="mt-2 text-sm font-semibold text-muted">
                {note.author} · {note.date}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="events-heading">
        <h2 id="events-heading" className="font-serif text-3xl font-semibold">
          Playdates here
        </h2>
        {here.length === 0 ? (
          <p className="mt-3 text-muted">
            None yet.{" "}
            <Link href="/events" className="font-semibold underline">
              Post one from the playdates page.
            </Link>
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 lg:grid-cols-2">
            {here.map((event) => (
              <li key={event.id}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="reports" className="mt-10 scroll-mt-24" aria-labelledby="report-heading">
        <h2 id="report-heading" className="sr-only">
          Accessibility reports
        </h2>
        <ReportForm parkId={park.id} />
      </section>
    </article>
  );
}
