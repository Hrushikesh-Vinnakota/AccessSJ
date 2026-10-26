"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { parks } from "@/data/parks";
import { AMENITIES, CONDITION_LABELS } from "@/lib/amenities";
import { isFeatureReport } from "@/lib/report-rollup";
import { findPark } from "@/lib/repository";
import { REPORT_CONDITIONS, type AccessibilityReport, type ReportDraft } from "@/lib/types";
import { useCommunity } from "@/context/Community";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function draftFromReport(report: AccessibilityReport): ReportDraft {
  return {
    parkId: report.parkId,
    condition: report.condition,
    feature: report.feature,
    note: report.note,
    author: report.author,
  };
}

export function AdminReports() {
  const { reload, reportsVersion } = useCommunity();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [reports, setReports] = useState<AccessibilityReport[]>([]);
  const [drafts, setDrafts] = useState<Record<string, ReportDraft>>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/community");
    const payload = (await response.json().catch(() => null)) as { adminReports?: AccessibilityReport[] } | null;
    if (!payload || !Array.isArray(payload.adminReports)) {
      setSignedIn(false);
      setReports([]);
      return;
    }
    setSignedIn(true);
    const next = payload.adminReports.slice().sort((a, b) => {
      if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setReports(next);
    setDrafts(Object.fromEntries(next.map((report) => [report.id, draftFromReport(report)])));
  }, []);

  useEffect(() => {
    void load();
  }, [load, reportsVersion]);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    const response = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "admin-login", username, password }),
    });
    const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!response.ok || !payload?.ok) {
      setError(payload?.error ?? "Could not sign in.");
      return;
    }
    setPassword("");
    setMessage("Signed in. Pending reports are listed first.");
    await load();
  }

  async function signOut() {
    await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "admin-logout" }),
    });
    setSignedIn(false);
    setReports([]);
    setMessage("Signed out.");
  }

  async function run(action: "admin-approve" | "admin-delete" | "admin-update", reportId: string) {
    setError("");
    setMessage("");
    const response = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        reportId,
        ...(action === "admin-update" ? { draft: drafts[reportId] } : {}),
      }),
    });
    const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string; errors?: Record<string, string> } | null;
    if (!response.ok || !payload?.ok) {
      setError(payload?.error ?? Object.values(payload?.errors ?? {})[0] ?? "Could not update that report.");
      return;
    }
    setMessage(action === "admin-approve" ? "Approved. It is now on the public list." : action === "admin-delete" ? "Deleted." : "Saved.");
    await load();
    await reload();
  }

  return (
    <section className="mt-10 rounded-3xl border border-line bg-paper p-5 shadow-card" aria-labelledby="admin-heading">
      <h2 id="admin-heading" className="font-serif text-3xl font-semibold">
        Admin
      </h2>
      {signedIn ? (
        <div className="mt-3">
          <p className="text-muted">Approve a feature report to add its badge. Issue reports stay on the public list with a park link and do not add a badge.</p>
          <Button type="button" className="mt-3" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      ) : (
        <form className="mt-4 grid max-w-md gap-3" onSubmit={(event) => void signIn(event)}>
          <p className="text-muted">Sign in to review every report, including ones the public cannot see yet.</p>
          <div>
            <Label htmlFor="admin-username">Username</Label>
            <Input id="admin-username" value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1" autoComplete="username" required />
          </div>
          <div>
            <Label htmlFor="admin-password">Password</Label>
            <Input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1" autoComplete="current-password" required />
          </div>
          <Button type="submit">Sign in</Button>
        </form>
      )}
      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="mt-3 text-sm font-semibold text-pine">
          {message}
        </p>
      ) : null}
      {signedIn ? (
        reports.length === 0 ? (
          <p className="mt-4 text-muted">No reports to review.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {reports.map((report) => {
              const draft = drafts[report.id] ?? draftFromReport(report);
              const park = findPark(report.parkId);
              const kind = isFeatureReport(draft.feature && draft.condition ? { condition: draft.condition, feature: draft.feature } : report) ? "Feature" : "Issue";
              return (
                <li key={report.id} className="rounded-2xl border border-line p-4">
                  <p className="text-sm font-semibold text-pine">
                    {report.status === "pending" ? "Waiting for approval" : "Approved"} · {kind}
                    {park ? ` · ${park.name}` : ""}
                  </p>
                  <div className="mt-3 grid gap-3">
                    <div>
                      <Label htmlFor={`admin-park-${report.id}`}>Park</Label>
                      <select
                        id={`admin-park-${report.id}`}
                        value={draft.parkId}
                        onChange={(event) => setDrafts((current) => ({ ...current, [report.id]: { ...draft, parkId: event.target.value } }))}
                        className="mt-1 min-h-11 w-full rounded-2xl border border-line bg-paper px-3"
                      >
                        {parks.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor={`admin-condition-${report.id}`}>Condition</Label>
                      <select
                        id={`admin-condition-${report.id}`}
                        value={draft.condition}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [report.id]: { ...draft, condition: event.target.value as ReportDraft["condition"] },
                          }))
                        }
                        className="mt-1 min-h-11 w-full rounded-2xl border border-line bg-paper px-3"
                      >
                        {REPORT_CONDITIONS.map((condition) => (
                          <option key={condition} value={condition}>
                            {CONDITION_LABELS[condition]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor={`admin-feature-${report.id}`}>Feature</Label>
                      <select
                        id={`admin-feature-${report.id}`}
                        value={draft.feature}
                        onChange={(event) =>
                          setDrafts((current) => ({
                            ...current,
                            [report.id]: { ...draft, feature: event.target.value as ReportDraft["feature"] },
                          }))
                        }
                        className="mt-1 min-h-11 w-full rounded-2xl border border-line bg-paper px-3"
                      >
                        <option value="general">General / not sure</option>
                        {AMENITIES.map((amenity) => (
                          <option key={amenity.id} value={amenity.id}>
                            {amenity.short}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor={`admin-note-${report.id}`}>Note</Label>
                      <Textarea
                        id={`admin-note-${report.id}`}
                        value={draft.note}
                        onChange={(event) => setDrafts((current) => ({ ...current, [report.id]: { ...draft, note: event.target.value } }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  {report.photoDataUrl ? (
                    <img
                      src={report.photoDataUrl}
                      alt={report.photoName ? `Photo attached to this report: ${report.photoName}` : "Photo attached to this report"}
                      className="mt-3 max-h-64 rounded-2xl object-contain"
                    />
                  ) : report.photoName ? (
                    <p className="mt-3 text-sm text-muted">The file name {report.photoName} was saved, but the image itself was too large and was not stored.</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" onClick={() => void run("admin-update", report.id)}>
                      Save
                    </Button>
                    {report.status === "pending" ? (
                      <Button type="button" onClick={() => void run("admin-approve", report.id)}>
                        Approve
                      </Button>
                    ) : null}
                    <Button type="button" onClick={() => void run("admin-delete", report.id)}>
                      Delete
                    </Button>
                    {park ? (
                      <Link href={`/parks/${park.slug}`} className="inline-flex min-h-11 items-center font-semibold underline">
                        Open park
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )
      ) : null}
    </section>
  );
}
