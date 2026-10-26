"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { seedEvents } from "@/data/events";
import { seedReports } from "@/data/reports";
import type { AccessibilityReport, CommunityEvent, EventDraft, ReportDraft, Rsvp } from "@/lib/types";
import { usePreferences } from "@/context/Preferences";

interface CommunityValue {
  events: CommunityEvent[];
  reports: AccessibilityReport[];
  rsvps: Rsvp[];
  ready: boolean;
  addEvent: (draft: EventDraft) => Promise<{ ok: true; id: string } | { ok: false; errors: Record<string, string> }>;
  addReport: (draft: ReportDraft) => Promise<{ ok: true; id: string } | { ok: false; errors: Record<string, string> }>;
  addRsvp: (eventId: string, name: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  removeRsvp: (rsvpId: string) => Promise<void>;
  reload: () => Promise<void>;
  reportsVersion: number;
}

const CommunityContext = createContext<CommunityValue | null>(null);

type SharedPayload = {
  ok?: boolean;
  id?: string;
  events?: CommunityEvent[];
  reports?: AccessibilityReport[];
  rsvps?: Rsvp[];
  errors?: Record<string, string>;
  error?: string;
};

async function postCommunity(
  body: unknown,
): Promise<{ ok: true; id?: string; events: CommunityEvent[]; reports: AccessibilityReport[]; rsvps: Rsvp[] } | { ok: false; errors?: Record<string, string>; error?: string }> {
  const response = await fetch("/api/community", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => null)) as SharedPayload | null;
  if (!response.ok || !payload?.ok || !payload.events || !payload.reports || !payload.rsvps) {
    return {
      ok: false,
      errors: payload?.errors ?? { form: payload?.error ?? "Could not save that." },
      error: payload?.error,
    };
  }
  return { ok: true, id: payload.id, events: payload.events, reports: payload.reports, rsvps: payload.rsvps };
}

export function CommunityProvider({ children }: { children: ReactNode }) {
  const { announce } = usePreferences();
  const [events, setEvents] = useState<CommunityEvent[]>(seedEvents);
  const [reports, setReports] = useState<AccessibilityReport[]>(seedReports);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [ready, setReady] = useState(false);
  const [reportsVersion, setReportsVersion] = useState(0);

  const applyShared = useCallback((nextEvents: CommunityEvent[], nextReports: AccessibilityReport[], nextRsvps: Rsvp[]) => {
    setEvents(nextEvents);
    setReports(nextReports);
    setRsvps(nextRsvps);
  }, []);

  useEffect(() => {
    let cancel = false;
    fetch("/api/community")
      .then((response) => response.json())
      .then((payload: { events?: CommunityEvent[]; reports?: AccessibilityReport[]; rsvps?: Rsvp[] }) => {
        if (cancel || !payload.events || !payload.reports || !payload.rsvps) return;
        applyShared(payload.events, payload.reports, payload.rsvps);
        setReady(true);
      })
      .catch(() => {
        if (!cancel) setReady(true);
      });
    return () => {
      cancel = true;
    };
  }, [applyShared]);

  const addEvent = useCallback(
    async (draft: EventDraft) => {
      if (!ready) return { ok: false as const, errors: { form: "The list is still loading." } };
      const result = await postCommunity({ action: "event", draft });
      if (!result.ok || !result.id) {
        return { ok: false as const, errors: result.ok ? { form: "Could not save that playdate." } : (result.errors ?? { form: "Could not save that playdate." }) };
      }
      applyShared(result.events, result.reports, result.rsvps);
      const created = result.events.find((event) => event.id === result.id);
      announce(`${created?.title ?? "Playdate"} was added.`);
      return { ok: true as const, id: result.id };
    },
    [announce, applyShared, ready],
  );

  const addReport = useCallback(
    async (draft: ReportDraft) => {
      if (!ready) return { ok: false as const, errors: { form: "The list is still loading." } };
      const result = await postCommunity({ action: "report", draft });
      if (!result.ok || !result.id) {
        return { ok: false as const, errors: result.ok ? { form: "Could not save that report." } : (result.errors ?? { form: "Could not save that report." }) };
      }
      applyShared(result.events, result.reports, result.rsvps);
      setReportsVersion((version) => version + 1);
      announce("Report saved. It stays private until an admin approves it.");
      return { ok: true as const, id: result.id };
    },
    [announce, applyShared, ready],
  );

  const addRsvp = useCallback(
    async (eventId: string, name: string) => {
      if (!ready) return { ok: false as const, error: "The list is still loading." };
      const result = await postCommunity({ action: "rsvp", eventId, name });
      if (!result.ok) return { ok: false as const, error: result.error ?? result.errors?.form ?? "Could not save that RSVP." };
      applyShared(result.events, result.reports, result.rsvps);
      announce(`${name.trim()} is on the list.`);
      return { ok: true as const };
    },
    [announce, applyShared, ready],
  );

  const removeRsvp = useCallback(
    async (rsvpId: string) => {
      const result = await postCommunity({ action: "rsvp-remove", rsvpId });
      if (!result.ok) {
        announce(result.error ?? "Could not remove that RSVP.");
        return;
      }
      applyShared(result.events, result.reports, result.rsvps);
      announce("RSVP removed.");
    },
    [announce, applyShared],
  );

  const reload = useCallback(async () => {
    const response = await fetch("/api/community");
    const payload = (await response.json().catch(() => null)) as {
      events?: CommunityEvent[];
      reports?: AccessibilityReport[];
      rsvps?: Rsvp[];
    } | null;
    if (!payload?.events || !payload.reports || !payload.rsvps) return;
    applyShared(payload.events, payload.reports, payload.rsvps);
  }, [applyShared]);

  const value = useMemo(
    () => ({ events, reports, rsvps, ready, addEvent, addReport, addRsvp, removeRsvp, reload, reportsVersion }),
    [events, reports, rsvps, ready, addEvent, addReport, addRsvp, removeRsvp, reload, reportsVersion],
  );

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}

export function useCommunity(): CommunityValue {
  const value = useContext(CommunityContext);
  if (!value) throw new Error("useCommunity must be used within CommunityProvider");
  return value;
}
