import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { seedEvents } from "../data/events";
import { parks } from "../data/parks";
import type { CommunityEvent } from "../lib/types";
import { seedReports } from "../data/reports";
import { AMENITY_IDS, TOWNS } from "../lib/types";
import {
  eventFromDraft,
  mergeCommunity,
  reportFromDraft,
  toggleRsvp,
  validateEventDraft,
  validateReportDraft,
} from "../lib/community";
import { cardAmenityPreview, eventsAtPark, filterParks, upcomingEvents } from "../lib/filters";

const parkIds = parks.map((park) => park.id);

describe("park seed", () => {
  it("covers every San Joaquin town in the guide", () => {
    for (const town of TOWNS) {
      assert.ok(
        parks.some((park) => park.town === town),
        `missing a park in ${town}`,
      );
    }
  });

  it("uses unique slugs and county coordinates", () => {
    const slugs = new Set(parks.map((park) => park.slug));
    assert.equal(slugs.size, parks.length);
    assert.ok(parks.length >= 6 && parks.length <= 8);
    for (const park of parks) {
      assert.ok(park.lat > 37.4 && park.lat < 38.4, park.name);
      assert.ok(park.lng < -120.9 && park.lng > -121.7, park.name);
      assert.ok(park.photos.length >= 1, park.name);
      assert.ok(park.photos[0].src.startsWith("/parks/"), park.name);
      for (const amenity of park.amenities) {
        assert.ok(AMENITY_IDS.includes(amenity), amenity);
        assert.ok(park.amenityNotes[amenity], `${park.name} missing note for ${amenity}`);
      }
    }
  });
});

describe("filterParks", () => {
  it("filters by town", () => {
    const tracy = filterParks(parks, { query: "", town: "Tracy", amenities: [] });
    assert.ok(tracy.length >= 1);
    assert.ok(tracy.every((park) => park.town === "Tracy"));
  });

  it("requires every selected amenity", () => {
    const paved = filterParks(parks, { query: "", town: "All", amenities: ["paved-surface"] });
    assert.ok(paved.some((park) => park.id === "lincoln-park"));
    assert.ok(paved.every((park) => park.amenities.includes("paved-surface")));
    const impossible = filterParks(parks, {
      query: "",
      town: "Tracy",
      amenities: ["paved-surface", "loaner-equipment"],
    });
    assert.equal(impossible.length, 0);
  });

  it("names the features a park card hides behind +N more", () => {
    const preview = cardAmenityPreview([
      "wheelchair-paths",
      "paved-surface",
      "accessible-restrooms",
      "changing-station",
      "sensory-friendly",
    ]);
    assert.equal(preview.shown.length, 4);
    assert.deepEqual(preview.hidden, ["sensory-friendly"]);

    const oak = parks.find((park) => park.id === "oak-grove");
    assert.ok(oak);
    assert.deepEqual(oak.amenities, ["wheelchair-paths"]);
    assert.ok(oak.address.includes("95209"));

    const victory = parks.find((park) => park.id === "victory-park");
    assert.deepEqual(victory?.amenities, [
      "wheelchair-paths",
      "adaptive-swings",
      "paved-surface",
      "woodchip-surface",
      "accessible-restrooms",
    ]);
    const lincoln = parks.find((park) => park.id === "lincoln-park");
    assert.ok(lincoln?.amenities.includes("woodchip-surface"));
    assert.equal(lincoln?.amenities.includes("adaptive-swings"), false);
    const woodward = parks.find((park) => park.id === "woodward");
    assert.equal(woodward?.name, "Woodward Community Park");
    assert.equal(woodward?.amenities.includes("adaptive-swings"), false);

    const buckley = parks.find((park) => park.id === "buckley-cove");
    assert.ok(buckley);
    assert.deepEqual(buckley.amenities, ["wheelchair-paths", "paved-surface", "accessible-restrooms"]);
    assert.ok(buckley.address.includes("4311"));

    const micke = parks.find((park) => park.id === "micke-grove");
    assert.ok(micke);
    assert.deepEqual(micke.amenities, ["wheelchair-paths"]);
    assert.equal(micke.amenities.includes("adaptive-swings"), false);
    assert.equal(micke.amenities.includes("accessible-restrooms"), false);
  });

  it("matches a search against the name and summary", () => {
    const found = filterParks(parks, { query: "japanese garden", town: "All", amenities: [] });
    assert.ok(found.some((park) => park.id === "micke-grove"));
  });
});

const sampleEvent: CommunityEvent = {
  id: "evt-sample",
  title: "Morning roll",
  parkId: "oak-grove",
  startsAt: "2026-10-24T09:00:00-07:00",
  endsAt: "2026-10-24T11:00:00-07:00",
  ageGroup: "Children",
  sensoryLevel: "Low Sensory",
  description: "A short paved loop with no music.",
  host: "Sam",
  rsvpCount: 2,
  capacity: 12,
};

describe("events and reports", () => {
  it("ships no bundled playdates and still resolves a meetup to a real park", () => {
    assert.equal(seedEvents.length, 0);
    for (const report of seedReports) {
      assert.ok(parkIds.includes(report.parkId));
    }
    assert.equal(eventsAtPark([sampleEvent], "oak-grove")[0]?.id, "evt-sample");
  });

  it("keeps future meetups ahead of a date in October 2026", () => {
    const next = upcomingEvents([sampleEvent], new Date("2026-10-17T12:00:00-07:00"), 1);
    assert.equal(next[0]?.id, "evt-sample");
  });

  it("toggles RSVP without dropping below zero", () => {
    const event = sampleEvent;
    const added = toggleRsvp(event, []);
    assert.equal(added.event.rsvpCount, event.rsvpCount + 1);
    assert.deepEqual(added.goingIds, [event.id]);
    const removed = toggleRsvp(added.event, added.goingIds);
    assert.equal(removed.event.rsvpCount, event.rsvpCount);
    assert.deepEqual(removed.goingIds, []);
    const floored = toggleRsvp({ ...event, rsvpCount: 0 }, [event.id]);
    assert.equal(floored.event.rsvpCount, 0);
  });

  it("merges saved RSVP counts and keeps visitor-created meetups", () => {
    const custom = {
      ...sampleEvent,
      id: "local-evt-1",
      title: "Neighborhood roll",
      rsvpCount: 3,
    };
    const merged = mergeCommunity(
      [sampleEvent],
      seedReports,
      {
        version: 1,
        events: [{ ...sampleEvent, rsvpCount: 40 }, custom],
        goingIds: [sampleEvent.id, "missing"],
        reports: [
          ...seedReports,
          {
            id: "local-rpt-1",
            parkId: "oak-grove",
            condition: "good",
            feature: "paved-surface",
            note: "Path was clear.",
            author: "Visitor",
            createdAt: "2026-10-17T12:00:00-07:00",
            status: "pending",
          },
        ],
      },
    );
    assert.equal(merged.events.find((event) => event.id === sampleEvent.id)?.rsvpCount, 40);
    assert.equal(merged.events.find((event) => event.id === sampleEvent.id)?.title, sampleEvent.title);
    assert.ok(merged.events.some((event) => event.id === "local-evt-1"));
    assert.deepEqual(merged.goingIds, [sampleEvent.id]);
    assert.ok(merged.reports.some((report) => report.id === "local-rpt-1"));
    const reset = mergeCommunity([sampleEvent], seedReports, {
      version: 99,
      events: [],
      goingIds: ["evt-sample"],
      reports: [],
    });
    assert.equal(reset.events.length, 1);
    assert.deepEqual(reset.goingIds, []);
  });

  it("rejects a meetup that ends before it starts", () => {
    const errors = validateEventDraft(
      {
        title: "Morning roll",
        parkId: "oak-grove",
        startsAt: "2026-11-01T11:00",
        endsAt: "2026-11-01T09:00",
        ageGroup: "Children",
        sensoryLevel: "Low Sensory",
        description: "A short paved loop with no music.",
        host: "Sam",
        capacity: "12",
      },
      parkIds,
    );
    assert.equal(errors.endsAt, "End time must be after the start time.");
    const ok = validateEventDraft(
      {
        title: "Morning roll",
        parkId: "oak-grove",
        startsAt: "2026-11-01T09:00",
        endsAt: "2026-11-01T11:00",
        ageGroup: "Children",
        sensoryLevel: "Low Sensory",
        description: "A short paved loop with no music.",
        host: "",
        capacity: "12",
      },
      parkIds,
    );
    assert.deepEqual(ok, {});
    const built = eventFromDraft(
      {
        title: "Morning roll",
        parkId: "oak-grove",
        startsAt: "2026-11-01T09:00",
        endsAt: "2026-11-01T11:00",
        ageGroup: "Children",
        sensoryLevel: "Low Sensory",
        description: "A short paved loop with no music.",
        host: "",
        capacity: "12",
      },
      "local-evt-2",
    );
    assert.equal(built.host, "Community member");
    assert.equal(built.rsvpCount, 1);
  });

  it("requires a report note and a known park", () => {
    const errors = validateReportDraft(
      { parkId: "", condition: "", feature: "", note: "short", author: "" },
      parkIds,
    );
    assert.ok(errors.parkId);
    assert.ok(errors.condition);
    assert.ok(errors.note);
    const report = reportFromDraft(
      {
        parkId: "lodi-lake",
        condition: "blocked",
        feature: "wheelchair-paths",
        note: "Sand covered the beach ramp.",
        author: "",
      },
      "local-rpt-2",
      "2026-10-17T18:00:00.000Z",
    );
    assert.equal(report.author, "Community member");
    assert.equal(report.condition, "blocked");
  });
});
