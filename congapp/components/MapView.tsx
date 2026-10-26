"use client";

import dynamic from "next/dynamic";
import type { Park } from "@/lib/types";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div role="status" className="grid h-[32rem] place-items-center rounded-3xl border border-line bg-soft text-base font-semibold">
      Loading the map…
    </div>
  ),
});

export function MapView({ parks }: { parks: Park[] }) {
  return <LeafletMap parks={parks} />;
}
