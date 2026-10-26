import { amenityById } from "@/lib/amenities";
import { AMENITY_IDS, type AccessibilityReport, type AmenityId } from "@/lib/types";

function byNewest(a: AccessibilityReport, b: AccessibilityReport): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function isFeatureReport(report: Pick<AccessibilityReport, "condition" | "feature">): boolean {
  return report.condition === "good" && report.feature !== "general";
}

export function approvedReports(reports: AccessibilityReport[]): AccessibilityReport[] {
  return reports.filter((report) => report.status === "approved");
}

export function latestReportForFeature(
  reports: AccessibilityReport[],
  parkId: string,
  feature: AmenityId | "general",
): AccessibilityReport | undefined {
  return approvedReports(reports)
    .filter((report) => report.parkId === parkId && report.feature === feature)
    .sort(byNewest)[0];
}

export function visitorAmenities(
  reports: AccessibilityReport[],
  parkId: string,
  official: AmenityId[],
): AmenityId[] {
  return AMENITY_IDS.filter((id) => {
    if (official.includes(id)) return false;
    return latestReportForFeature(reports, parkId, id)?.condition === "good";
  });
}

export function currentIssues(reports: AccessibilityReport[], parkId: string): AccessibilityReport[] {
  const features: Array<AmenityId | "general"> = [...AMENITY_IDS, "general"];
  return features
    .map((feature) => latestReportForFeature(reports, parkId, feature))
    .filter((report): report is AccessibilityReport => Boolean(report && report.condition !== "good"))
    .sort(byNewest);
}

export function reportFeatureLabel(feature: AccessibilityReport["feature"]): string {
  if (feature === "general") return "General";
  return amenityById(feature).short;
}

export function visitorBadgeNote(
  reports: AccessibilityReport[],
  parkId: string,
  feature: AmenityId,
): string {
  const matching = reports.filter(
    (report) => report.parkId === parkId && report.feature === feature && report.condition === "good",
  );
  const latest = latestReportForFeature(reports, parkId, feature);
  const count = matching.length;
  const people = count === 1 ? "1 visitor reported" : `${count} visitors reported`;
  return `${people} this works. Latest note: ${latest?.note ?? ""}`;
}
