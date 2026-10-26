import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playdates",
  description: "Inclusive community playdates and meetups at San Joaquin County parks.",
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
