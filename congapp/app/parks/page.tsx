import type { Metadata } from "next";
import { ParkExplorer } from "@/components/ParkExplorer";

export const metadata: Metadata = {
  title: "Parks",
  description: "Search San Joaquin County parks by town and accessibility features.",
};

export default function ParksPage() {
  return (
    <div className="mx-auto max-w-page px-4 py-8">
      <ParkExplorer
        heading="Park directory"
        intro="Eight public parks across San Joaquin County. Turn on the features you need. The list and the map show the same results."
      />
    </div>
  );
}
