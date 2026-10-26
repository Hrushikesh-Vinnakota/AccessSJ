import { EventHighlights } from "@/components/EventHighlights";
import { Hero } from "@/components/Hero";
import { ParkExplorer } from "@/components/ParkExplorer";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-page px-4 py-8">
      <Hero />
      <div className="mt-12">
        <ParkExplorer />
      </div>
      <EventHighlights />
      <section className="mt-16 rounded-[2rem] border border-line bg-pine px-6 py-8 text-on-pine sm:px-10">
        <h2 className="font-serif text-4xl font-semibold">Saw a gate that sticks?</h2>
        <p className="mt-2 max-w-2xl text-lg">
          A short report helps the next wheelchair, walker, or stroller. Photos of ramps and restroom doors are welcome.
        </p>
        <Link href="/report" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-paper px-5 font-semibold text-ink">
          Add an accessibility report
        </Link>
      </section>
    </div>
  );
}
