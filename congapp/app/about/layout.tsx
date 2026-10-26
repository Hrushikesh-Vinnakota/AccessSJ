import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "What AccessSJ is, and what the park notes are and are not.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
