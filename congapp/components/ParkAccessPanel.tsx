"use client";

import Link from "next/link";
import { parks } from "@/data/parks";
import { AccessibilityBadge } from "@/components/AccessibilityBadge";
import { CONDITION_LABELS } from "@/lib/amenities";
import { currentIssues, reportFeatureLabel, visitorAmenities } from "@/lib/report-rollup";
import { useCommunity } from "@/context/Community";

export function ParkAccessPanel({
  parkId,
  showBadges,
  issueLimit,
}: {
  parkId: string;
  showBadges: boolean;
  issueLimit?: number;
}) {
  const { reports, ready } = useCommunity();
  const park = parks.find((item) => item.id === parkId);
  if (!park) return null;
  if (!ready) {
    return <p className="text-sm text-muted">Loading visits…</p>;
  }

  const visitor = visitorAmenities(reports, park.id, park.amenities);
  const issues = currentIssues(reports, park.id);
  const shownIssues = typeof issueLimit === "number" ? issues.slice(0, issueLimit) : issues;
  const hiddenIssues = issues.length - shownIssues.length;

  return (
    <div className={showBadges ? "rounded-2xl border border-line bg-soft p-4" : ""}>
      {showBadges ? (
        <>
          <h3 className="font-semibold">At {park.name} right now</h3>
          <p className="mt-1 text-sm text-muted">
            Listed badges come from a public source. A visitor badge appears when the newest report says that feature works.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label={`Badges at ${park.name}`}>
            {park.amenities.map((id) => (
              <li key={id}>
                <AccessibilityBadge id={id} compact />
              </li>
            ))}
            {visitor.map((id) => (
              <li key={id}>
                <AccessibilityBadge id={id} compact visitor />
              </li>
            ))}
            {park.amenities.length + visitor.length === 0 ? (
              <li className="text-sm font-semibold">No badges yet for this park.</li>
            ) : null}
          </ul>
        </>
      ) : null}

      <h4 className={showBadges ? "mt-4 font-semibold" : "font-semibold"}>Current issues</h4>
      {shownIssues.length === 0 ? (
        <p className="mt-1 text-sm text-muted">No open issues from visits.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {shownIssues.map((issue) => (
            <li key={issue.id}>
              <p className="text-sm font-semibold">
                {CONDITION_LABELS[issue.condition]} · {reportFeatureLabel(issue.feature)}
              </p>
              <p className="text-sm">{issue.note}</p>
            </li>
          ))}
        </ul>
      )}
      {hiddenIssues > 0 ? (
        <p className="mt-2 text-sm font-semibold">
          <Link href={`/parks/${park.slug}#reports`} className="underline underline-offset-2">
            {hiddenIssues} more {hiddenIssues === 1 ? "issue" : "issues"} on the park page
          </Link>
        </p>
      ) : (
        <p className="mt-2 text-sm font-semibold">
          <Link href={`/parks/${park.slug}#reports`} className="underline underline-offset-2">
            Reports for {park.name}
          </Link>
        </p>
      )}
    </div>
  );
}
