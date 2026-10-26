"use client";

import { useState } from "react";
import { parks } from "@/data/parks";
import { AGE_GROUPS, SENSORY_LEVELS, type EventDraft } from "@/lib/types";
import { useCommunity } from "@/context/Community";
import { ParkAccessPanel } from "@/components/ParkAccessPanel";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const emptyDraft = (): EventDraft => ({
  title: "",
  parkId: "",
  startsAt: "",
  endsAt: "",
  ageGroup: "",
  sensoryLevel: "",
  description: "",
  host: "",
  capacity: "20",
});

export function CreateEventModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addEvent } = useCommunity();
  const [draft, setDraft] = useState<EventDraft>(emptyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update<K extends keyof EventDraft>(key: K, value: EventDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function close(next: boolean) {
    if (!next) {
      setDraft(emptyDraft());
      setErrors({});
    }
    onOpenChange(next);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await addEvent(draft);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setDraft(emptyDraft());
    setErrors({});
    onOpenChange(false);
  }

  return (
    <Modal
      open={open}
      onOpenChange={close}
      title="Host a playdate"
      description="Choose a park to see its badges and current issues before you post. The meetup is then visible to everyone using AccessSJ."
    >
      <form onSubmit={onSubmit} className="grid gap-4" noValidate>
        <div>
          <Label htmlFor="event-title">Title</Label>
          <Input
            id="event-title"
            value={draft.title}
            onChange={(event) => update("title", event.target.value)}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "event-title-error" : undefined}
            className="mt-1"
            required
          />
          <FieldError id="event-title-error" message={errors.title} />
        </div>
        <div>
          <Label htmlFor="event-park">Park</Label>
          <select
            id="event-park"
            value={draft.parkId}
            onChange={(event) => update("parkId", event.target.value)}
            aria-invalid={Boolean(errors.parkId)}
            aria-describedby={errors.parkId ? "event-park-error" : undefined}
            className="mt-1 min-h-11 w-full rounded-2xl border border-line bg-paper px-3"
            required
          >
            <option value="">Choose a park</option>
            {parks.map((park) => (
              <option key={park.id} value={park.id}>
                {park.name} — {park.town}
              </option>
            ))}
          </select>
          <FieldError id="event-park-error" message={errors.parkId} />
          {draft.parkId ? (
            <div className="mt-3">
              <ParkAccessPanel parkId={draft.parkId} showBadges />
            </div>
          ) : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="event-start">Starts</Label>
            <Input
              id="event-start"
              type="datetime-local"
              value={draft.startsAt}
              onChange={(event) => update("startsAt", event.target.value)}
              aria-invalid={Boolean(errors.startsAt)}
              aria-describedby={errors.startsAt ? "event-start-error" : undefined}
              className="mt-1"
              required
            />
            <FieldError id="event-start-error" message={errors.startsAt} />
          </div>
          <div>
            <Label htmlFor="event-end">Ends</Label>
            <Input
              id="event-end"
              type="datetime-local"
              value={draft.endsAt}
              onChange={(event) => update("endsAt", event.target.value)}
              aria-invalid={Boolean(errors.endsAt)}
              aria-describedby={errors.endsAt ? "event-end-error" : undefined}
              className="mt-1"
              required
            />
            <FieldError id="event-end-error" message={errors.endsAt} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="event-age">Age group</Label>
            <select
              id="event-age"
              value={draft.ageGroup}
              onChange={(event) => update("ageGroup", event.target.value as EventDraft["ageGroup"])}
              aria-invalid={Boolean(errors.ageGroup)}
              aria-describedby={errors.ageGroup ? "event-age-error" : undefined}
              className="mt-1 min-h-11 w-full rounded-2xl border border-line bg-paper px-3"
              required
            >
              <option value="">Choose</option>
              {AGE_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            <FieldError id="event-age-error" message={errors.ageGroup} />
          </div>
          <div>
            <Label htmlFor="event-sensory">Sensory level</Label>
            <select
              id="event-sensory"
              value={draft.sensoryLevel}
              onChange={(event) => update("sensoryLevel", event.target.value as EventDraft["sensoryLevel"])}
              aria-invalid={Boolean(errors.sensoryLevel)}
              aria-describedby={errors.sensoryLevel ? "event-sensory-error" : undefined}
              className="mt-1 min-h-11 w-full rounded-2xl border border-line bg-paper px-3"
              required
            >
              <option value="">Choose</option>
              {SENSORY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <FieldError id="event-sensory-error" message={errors.sensoryLevel} />
          </div>
        </div>
        <div>
          <Label htmlFor="event-description">What should people expect?</Label>
          <Textarea
            id="event-description"
            value={draft.description}
            onChange={(event) => update("description", event.target.value)}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "event-description-error" : undefined}
            className="mt-1"
            required
          />
          <FieldError id="event-description-error" message={errors.description} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="event-host">Your name, as you want it shown</Label>
            <Input
              id="event-host"
              value={draft.host}
              onChange={(event) => update("host", event.target.value)}
              className="mt-1"
              placeholder="Optional"
            />
          </div>
          <div>
            <Label htmlFor="event-capacity">Capacity</Label>
            <Input
              id="event-capacity"
              inputMode="numeric"
              value={draft.capacity}
              onChange={(event) => update("capacity", event.target.value)}
              aria-invalid={Boolean(errors.capacity)}
              aria-describedby={errors.capacity ? "event-capacity-error" : undefined}
              className="mt-1"
              required
            />
            <FieldError id="event-capacity-error" message={errors.capacity} />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          {errors.form ? (
            <p role="alert" className="text-sm font-semibold">
              {errors.form}
            </p>
          ) : null}
          <Button type="submit">Post meetup</Button>
          <Button type="button" variant="secondary" onClick={() => close(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
