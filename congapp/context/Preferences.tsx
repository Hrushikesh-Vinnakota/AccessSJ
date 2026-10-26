"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type TextScale = "default" | "large" | "largest";
export type ContrastMode = "normal" | "high";

const TEXT_KEY = "accesssj-text";
const CONTRAST_KEY = "accesssj-contrast";

interface PreferencesValue {
  text: TextScale;
  contrast: ContrastMode;
  setText: (value: TextScale) => void;
  setContrast: (value: ContrastMode) => void;
  announce: (message: string) => void;
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [text, setTextState] = useState<TextScale>("default");
  const [contrast, setContrastState] = useState<ContrastMode>("normal");
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const storedText = window.localStorage.getItem(TEXT_KEY);
    const storedContrast = window.localStorage.getItem(CONTRAST_KEY);
    if (storedText === "large" || storedText === "largest") setTextState(storedText);
    if (storedContrast === "high") setContrastState("high");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute("data-text", text);
    document.documentElement.setAttribute("data-contrast", contrast);
    window.localStorage.setItem(TEXT_KEY, text);
    window.localStorage.setItem(CONTRAST_KEY, contrast);
  }, [text, contrast, ready]);

  const announce = useCallback((message: string) => {
    setStatus("");
    window.setTimeout(() => setStatus(message), 40);
  }, []);

  const setText = useCallback(
    (value: TextScale) => {
      setTextState(value);
      const label = value === "default" ? "default" : value;
      announce(`Text size set to ${label}.`);
    },
    [announce],
  );

  const setContrast = useCallback(
    (value: ContrastMode) => {
      setContrastState(value);
      announce(value === "high" ? "High contrast on." : "High contrast off.");
    },
    [announce],
  );

  return (
    <PreferencesContext.Provider value={{ text, contrast, setText, setContrast, announce }}>
      {children}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {status}
      </div>
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesValue {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error("usePreferences must be used within PreferencesProvider");
  return value;
}
