"use client";

import type { ReactNode } from "react";
import { CommunityProvider } from "@/context/Community";
import { PreferencesProvider } from "@/context/Preferences";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      <CommunityProvider>{children}</CommunityProvider>
    </PreferencesProvider>
  );
}
