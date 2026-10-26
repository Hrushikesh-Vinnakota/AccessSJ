"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { findPark } from "@/lib/repository";
import { formatEventRange } from "@/lib/format";
import { useCommunity } from "@/context/Community";
import type { CommunityEvent } from "@/lib/types";
import { ParkAccessPanel } from "@/components/ParkAccessPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const sensoryClass: Record<CommunityEvent["sensoryLevel"], string> = {
  "Low Sensory": "border-line bg-soft text-ink",
  Moderate: "border-line bg-paper text-ink",
  "Active Play": "border-clay bg-soft text-ink",
};

export function EventCard({ event }: { event: CommunityEvent }) {
  const park = findPark(event.parkId);
  const { rsvps, addRsvp, removeRsvp } = useCommunity();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const people = rsvps.filter((rsvp) => rsvp.eventId === event.id);
  const full = event.rsvpCount >= event.capacity;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-line bg-paper p-4 shadow-card">
      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex min-h-8 items-center rounded-full border px-2.5 text-sm font-semibold ${sensoryClass[event.sensoryLevel]}`}>
          {event.sensoryLevel}
        </span>
        <span className="inline-flex min-h-8 items-center rounded-full border border-line px-2.5 text-sm font-semibold">
          {event.ageGroup}
        </span>
      </div>
      <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight">{event.title}</h3>
      <p className="mt-2 text-base text-muted">{event.description}</p>
      <div className="mt-3">
        <ParkAccessPanel parkId={event.parkId} showBadges={false} issueLimit={2} />
      </div>
      <ul className="mt-3 space-y-1 text-sm font-semibold">
        <li className="flex items-start gap-2">
          <Calendar aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{formatEventRange(event.startsAt, event.endsAt)}</span>
        </li>
        <li className="flex items-start gap-2">
          <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {park ? (
            <Link href={`/parks/${park.slug}`} className="underline underline-offset-2">
              {park.name}, {park.town}
            </Link>
          ) : (
            <span>Park to be confirmed</span>
          )}
        </li>
        <li className="flex items-start gap-2">
          <Users aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {event.rsvpCount} of {event.capacity} going · Hosted by {event.host}
          </span>
        </li>
      </ul>
      {people.length > 0 ? (
        <ul className="mt-3 space-y-1" aria-label={`People going to ${event.title}`}>
          {people.map((rsvp) => (
            <li key={rsvp.id} className="flex items-center justify-between gap-2 text-sm">
              <span>{rsvp.name}</span>
              <button type="button" className="min-h-11 font-semibold underline" onClick={() => void removeRsvp(rsvp.id)}>
                Remove {rsvp.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <form
        className="mt-4 flex flex-wrap items-end gap-2"
        onSubmit={(submitEvent) => {
          submitEvent.preventDefault();
          void addRsvp(event.id, name).then((result) => {
            if (!result.ok) {
              setError(result.error);
              return;
            }
            setName("");
            setError("");
          });
        }}
      >
        <div className="min-w-40 flex-1">
          <Label htmlFor={`rsvp-name-${event.id}`}>Your name</Label>
          <Input
            id={`rsvp-name-${event.id}`}
            value={name}
            onChange={(change) => setName(change.target.value)}
            className="mt-1"
            required
          />
        </div>
        <Button type="submit" disabled={full}>
          {full ? "This meetup is full" : "RSVP"}
        </Button>
        {error ? (
          <p role="alert" className="basis-full text-sm font-semibold">
            {error}
          </p>
        ) : null}
      </form>
    </article>
  );
}
