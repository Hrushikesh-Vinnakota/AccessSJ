"use client";

import Link from "next/link";
import { useState } from "react";
import { Contrast, Menu, X } from "lucide-react";
import { usePreferences, type TextScale } from "@/context/Preferences";
import { cn } from "@/lib/utils";

const links = [
  { href: "/parks", label: "Parks" },
  { href: "/events", label: "Playdates" },
  { href: "/report", label: "Report" },
  { href: "/about", label: "About" },
];

const scales: { id: TextScale; label: string; mark: string }[] = [
  { id: "default", label: "Default text size", mark: "A" },
  { id: "large", label: "Large text", mark: "A+" },
  { id: "largest", label: "Largest text", mark: "A++" },
];

export function Navbar() {
  const { text, contrast, setText, setContrast } = usePreferences();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-page flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="mr-auto flex items-center gap-3 rounded-2xl pr-2">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-pine font-serif text-lg font-semibold text-on-pine" aria-hidden="true">
            SJ
          </span>
          <span>
            <span className="block font-serif text-2xl font-semibold leading-none">AccessSJ</span>
            <span className="text-sm font-semibold text-muted">San Joaquin County</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center rounded-full px-3 font-semibold hover:bg-soft">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1" role="group" aria-label="Text size">
          {scales.map((scale) => (
            <button
              key={scale.id}
              type="button"
              aria-pressed={text === scale.id}
              aria-label={scale.label}
              onClick={() => setText(scale.id)}
              className={cn(
                "inline-flex h-11 min-w-11 items-center justify-center rounded-full px-2 text-sm font-semibold",
                text === scale.id ? "bg-pine text-on-pine" : "hover:bg-soft",
              )}
            >
              {scale.mark}
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-pressed={contrast === "high"}
          onClick={() => setContrast(contrast === "high" ? "normal" : "high")}
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold",
            contrast === "high" ? "bg-pine text-on-pine" : "hover:bg-soft",
          )}
        >
          <Contrast aria-hidden="true" className="h-4 w-4" />
          <span className="hidden sm:inline">Contrast</span>
          <span className="sr-only sm:hidden">High contrast</span>
        </button>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-soft lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-line px-4 py-2 lg:hidden" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center rounded-2xl px-2 font-semibold hover:bg-soft"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
