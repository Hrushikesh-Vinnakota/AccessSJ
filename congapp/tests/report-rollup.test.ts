import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parks } from "../data/parks";
import { addNamedRsvp, addReportToCommunity, approveReportInCommunity, PHOTO_DATA_URL_LIMIT, type CommunityFile } from "../lib/community-file";
import { filterParks } from "../lib/filters";
import { currentIssues, visitorAmenities } from "../lib/report-rollup";
import type { AccessibilityReport, CommunityEvent } from "../lib/types";

function report(partial: Pick<AccessibilityReport, "feature" | "condition" | "createdAt"> & { note?: string }): AccessibilityReport {
  return {
    id: partial.createdAt,
    parkId: "micke-grove",
    condition: partial.condition,
    feature: partial.feature,
    note: partial.note ?? "The entrance was usable today.",
    author: "Visitor",
    createdAt: partial.createdAt,
    status: "approved",
  };
}

describe("visitor reports consolidate into badges and issues", () => {
  it("keeps a pending Oak Grove feature off the badges until it is approved", () => {
    const pending = report({ feature: "paved-surface", condition: "good", createdAt: "2026-10-24T18:00:00.000Z" });
    pending.parkId = "oak-grove";
    pending.status = "pending";
    assert.deepEqual(visitorAmenities([pending], "oak-grove", ["wheelchair-paths"]), []);
    pending.status = "approved";
    assert.deepEqual(visitorAmenities([pending], "oak-grove", ["wheelchair-paths"]), ["paved-surface"]);
    const issue = report({ feature: "changing-station", condition: "blocked", createdAt: "2026-10-24T19:00:00.000Z", note: "No adult changing station." });
    issue.parkId = "oak-grove";
    assert.deepEqual(visitorAmenities([issue], "oak-grove", ["wheelchair-paths"]), []);
    assert.equal(currentIssues([issue], "oak-grove")[0]?.feature, "changing-station");
  });

  it("adds a badge when the newest report says a feature works", () => {
    const reports = [report({ feature: "changing-station", condition: "good", createdAt: "2026-10-22T18:00:00.000Z" })];
    assert.deepEqual(visitorAmenities(reports, "micke-grove", ["wheelchair-paths"]), ["changing-station"]);
    assert.deepEqual(currentIssues(reports, "micke-grove"), []);
  });

  it("drops the visitor badge when a later report says the feature is blocked", () => {
    const reports = [
      report({ feature: "changing-station", condition: "blocked", createdAt: "2026-10-22T19:00:00.000Z", note: "The stall door does not open wide enough." }),
      report({ feature: "changing-station", condition: "good", createdAt: "2026-10-22T18:00:00.000Z" }),
    ];
    assert.deepEqual(visitorAmenities(reports, "micke-grove", []), []);
    const issues = currentIssues(reports, "micke-grove");
    assert.equal(issues.length, 1);
    assert.equal(issues[0]?.condition, "blocked");
  });

  it("lets the directory filter use a visitor badge", () => {
    const reports = [report({ feature: "changing-station", condition: "good", createdAt: "2026-10-22T18:00:00.000Z" })];
    const matches = filterParks(parks, { query: "", town: "All", amenities: ["changing-station"] }, (parkId) => {
      const park = parks.find((item) => item.id === parkId);
      return park ? visitorAmenities(reports, parkId, park.amenities) : [];
    });
    assert.ok(matches.some((park) => park.id === "micke-grove"));
  });

  it("saves a report into the shared file and refuses a full playdate", () => {
    const stroll: CommunityEvent = {
      id: "evt-victory-stroll",
      title: "Garden stroll",
      parkId: "victory-park",
      startsAt: "2026-10-28T17:00:00.000Z",
      endsAt: "2026-10-28T18:30:00.000Z",
      ageGroup: "Seniors",
      sensoryLevel: "Moderate",
      description: "A short loop by the duck ponds.",
      host: "Helen",
      rsvpCount: 1,
      capacity: 1,
    };
    const file: CommunityFile = { version: 1, events: [stroll], reports: [] };
    const saved = addReportToCommunity(
      file,
      {
        parkId: "victory-park",
        condition: "good",
        feature: "loaner-equipment",
        note: "The desk had a beach wheelchair we could borrow.",
        author: "Sam",
      },
      "rpt-1",
      "2026-10-22T20:00:00.000Z",
      parks.map((park) => park.id),
    );
    assert.equal(saved.ok, true);
    if (!saved.ok) return;
    assert.equal(saved.file.reports[0]?.status, "pending");
    assert.deepEqual(visitorAmenities(saved.file.reports, "victory-park", []), []);
    const approved = approveReportInCommunity(saved.file, "rpt-1");
    assert.equal(approved.ok, true);
    if (!approved.ok) return;
    assert.equal(visitorAmenities(approved.file.reports, "victory-park", [])[0], "loaner-equipment");

    const withPhoto = addReportToCommunity(
      file,
      {
        parkId: "victory-park",
        condition: "needs-attention",
        feature: "changing-station",
        note: "The restroom has no changing station.",
        author: "Sam",
        photoName: "gate.jpg",
        photoDataUrl: "data:image/jpeg;base64,abc",
      },
      "rpt-photo",
      "2026-10-22T20:05:00.000Z",
      parks.map((park) => park.id),
    );
    assert.equal(withPhoto.ok, true);
    if (!withPhoto.ok) return;
    assert.equal(withPhoto.file.reports[0]?.photoDataUrl, "data:image/jpeg;base64,abc");
    const tooLarge = addReportToCommunity(
      file,
      {
        parkId: "victory-park",
        condition: "needs-attention",
        feature: "changing-station",
        note: "The restroom has no changing station.",
        author: "Sam",
        photoName: "huge.jpg",
        photoDataUrl: `data:image/jpeg;base64,${"a".repeat(PHOTO_DATA_URL_LIMIT)}`,
      },
      "rpt-huge",
      "2026-10-22T20:06:00.000Z",
      parks.map((park) => park.id),
    );
    assert.equal(tooLarge.ok, false);

    const full = addNamedRsvp(file.events, [{ id: "rsvp-1", eventId: "evt-victory-stroll", name: "Helen", createdAt: "2026-10-22T20:00:00.000Z" }], "evt-victory-stroll", "Sam", "rsvp-2", "2026-10-22T21:00:00.000Z");
    assert.equal(full.ok, false);
  });
});
