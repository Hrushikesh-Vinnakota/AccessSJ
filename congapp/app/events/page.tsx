"use client";

import { useState } from "react";
import Link from "next/link";
import { useCommunity } from "@/context/Community";
import { CreateEventModal } from "@/components/CreateEventModal";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  const { events } = useCommunity();
  const [open, setOpen] = useState(false);
  const ordered = [...events].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  return (
    <div className="mx-auto max-w-page px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-serif text-5xl font-semibold">Community playdates</h1>
          <p className="mt-3 text-lg text-muted">
            Each card lists current issues from visits at that park. Add your name to RSVP.{" "}
            <Link href="/report" className="font-semibold text-ink underline underline-offset-2">
              All accessibility reports
            </Link>
          </p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          Host a playdate
        </Button>
      </div>
      {ordered.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-dashed border-line bg-paper p-6 text-lg">No playdates yet. Host one when you are ready.</p>
      ) : (
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {ordered.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
      <CreateEventModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
