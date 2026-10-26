"use client";

import { useState } from "react";
import Link from "next/link";
import { upcomingEvents } from "@/lib/filters";
import { useCommunity } from "@/context/Community";
import { EventCard } from "@/components/EventCard";
import { CreateEventModal } from "@/components/CreateEventModal";
import { Button } from "@/components/ui/button";

export function EventHighlights() {
  const { events } = useCommunity();
  const [open, setOpen] = useState(false);
  const highlights = upcomingEvents(events, new Date(), 3);

  return (
    <section aria-labelledby="playdates-heading" className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 id="playdates-heading" className="font-serif text-4xl font-semibold">
            Upcoming playdates
          </h2>
          <p className="mt-2 text-lg text-muted">
            Gatherings posted by caregivers. Sensory level and age group are on every card so you can decide before you drive.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => setOpen(true)}>
            Host a playdate
          </Button>
          <Button asChild variant="secondary">
            <Link href="/events">All meetups</Link>
          </Button>
        </div>
      </div>
      {highlights.length === 0 ? (
        <p className="mt-5 rounded-3xl border border-dashed border-line bg-paper p-6 text-lg">No playdates yet. Host one when you are ready.</p>
      ) : (
        <ul className="mt-5 grid gap-4 lg:grid-cols-3">
          {highlights.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
      <CreateEventModal open={open} onOpenChange={setOpen} />
    </section>
  );
}
