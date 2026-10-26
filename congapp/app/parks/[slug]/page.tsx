import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPark, parks } from "@/data/parks";
import { ParkDetail } from "./ParkDetail";

export function generateStaticParams() {
  return parks.map((park) => ({ slug: park.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const park = getPark(params.slug);
  if (!park) return { title: "Park not found" };
  return { title: park.name, description: park.summary };
}

export default function ParkPage({ params }: { params: { slug: string } }) {
  const park = getPark(params.slug);
  if (!park) notFound();
  return <ParkDetail park={park} />;
}
