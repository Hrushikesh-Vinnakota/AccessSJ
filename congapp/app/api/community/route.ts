import { cookies } from "next/headers";
import { parks } from "@/data/parks";
import { ADMIN_COOKIE, adminConfigured, adminCookieValid, adminCookieValue, checkAdminPassword } from "@/lib/admin-auth";
import {
  loadCommunity,
  storeAddRsvp,
  storeApproveReport,
  storeDeleteReport,
  storeEvent,
  storeRemoveRsvp,
  storeReport,
  storeUpdateReport,
  type CommunitySnapshot,
} from "@/lib/community-store";
import type { AccessibilityReport, EventDraft, ReportDraft } from "@/lib/types";
import { NextResponse } from "next/server";

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function parkIds(): string[] {
  return parks.map((park) => park.id);
}

function isAdmin(): boolean {
  return adminCookieValid(cookies().get(ADMIN_COOKIE)?.value);
}

function approvedOnly(reports: AccessibilityReport[]): AccessibilityReport[] {
  return reports.filter((report) => report.status === "approved");
}

function payload(snapshot: CommunitySnapshot, extra: Record<string, unknown> = {}) {
  const admin = isAdmin();
  return {
    ok: true,
    events: snapshot.events,
    reports: approvedOnly(snapshot.reports),
    rsvps: snapshot.rsvps,
    ...(admin ? { adminReports: snapshot.reports } : {}),
    ...extra,
  };
}

function adminDenied() {
  return NextResponse.json({ ok: false, error: "Sign in as admin first." }, { status: 401 });
}

export async function GET() {
  const snapshot = await loadCommunity();
  return NextResponse.json(payload(snapshot));
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    action?: string;
    draft?: unknown;
    eventId?: unknown;
    name?: unknown;
    rsvpId?: unknown;
    reportId?: unknown;
    username?: unknown;
    password?: unknown;
  } | null;
  if (!body || typeof body.action !== "string") {
    return NextResponse.json({ ok: false, errors: { form: "Could not read that request." } }, { status: 400 });
  }

  if (body.action === "admin-login") {
    if (!adminConfigured()) {
      return NextResponse.json({ ok: false, error: "Admin login is not set up on this server." }, { status: 500 });
    }
    if (typeof body.username !== "string" || typeof body.password !== "string" || !checkAdminPassword(body.username, body.password)) {
      return NextResponse.json({ ok: false, error: "That username or password is wrong." }, { status: 401 });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, adminCookieValue(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  }

  if (body.action === "admin-logout") {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
    return response;
  }

  if (body.action === "admin-update" || body.action === "admin-approve" || body.action === "admin-delete") {
    if (!isAdmin()) return adminDenied();
    if (typeof body.reportId !== "string") {
      return NextResponse.json({ ok: false, error: "That report is not on the list." }, { status: 400 });
    }
    if (body.action === "admin-update") {
      if (!body.draft || typeof body.draft !== "object") {
        return NextResponse.json({ ok: false, errors: { form: "Could not read that report." } }, { status: 400 });
      }
      const result = await storeUpdateReport(body.reportId, body.draft as ReportDraft, parkIds());
      if (!result.ok) return NextResponse.json(result, { status: 400 });
      return NextResponse.json(payload(result.snapshot));
    }
    if (body.action === "admin-approve") {
      const result = await storeApproveReport(body.reportId);
      if (!result.ok) return NextResponse.json(result, { status: 400 });
      return NextResponse.json(payload(result.snapshot));
    }
    const result = await storeDeleteReport(body.reportId);
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(payload(result.snapshot));
  }

  if (body.action === "report") {
    if (!body.draft || typeof body.draft !== "object") {
      return NextResponse.json({ ok: false, errors: { form: "Could not read that report." } }, { status: 400 });
    }
    const result = await storeReport(body.draft as ReportDraft, newId("rpt"), new Date().toISOString(), parkIds());
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(payload(result.snapshot, { id: result.id }));
  }

  if (body.action === "event") {
    if (!body.draft || typeof body.draft !== "object") {
      return NextResponse.json({ ok: false, errors: { form: "Could not read that playdate." } }, { status: 400 });
    }
    const createdAt = new Date().toISOString();
    const result = await storeEvent(body.draft as EventDraft, newId("evt"), parkIds(), newId("rsvp"), createdAt);
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(payload(result.snapshot, { id: result.id }));
  }

  if (body.action === "rsvp") {
    if (typeof body.eventId !== "string" || typeof body.name !== "string") {
      return NextResponse.json({ ok: false, error: "Add your name to RSVP." }, { status: 400 });
    }
    const result = await storeAddRsvp(body.eventId, body.name, newId("rsvp"), new Date().toISOString());
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(payload(result.snapshot));
  }

  if (body.action === "rsvp-remove") {
    if (typeof body.rsvpId !== "string") {
      return NextResponse.json({ ok: false, error: "Could not find that RSVP." }, { status: 400 });
    }
    const snapshot = await storeRemoveRsvp(body.rsvpId);
    return NextResponse.json(payload(snapshot));
  }

  return NextResponse.json({ ok: false, errors: { form: "Unknown action." } }, { status: 400 });
}
