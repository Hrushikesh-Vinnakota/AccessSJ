import type { Metadata } from "next";
import { AdminReports } from "@/components/AdminReports";
import { ReportForm } from "@/components/ReportForm";

export const metadata: Metadata = {
  title: "Report access",
  description: "Tell other families what a San Joaquin County park’s access is like right now.",
};

export default function ReportPage() {
  return (
    <div className="mx-auto max-w-page px-4 py-8">
      <h1 className="font-serif text-5xl font-semibold">Report what you found</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Reports stay private until an admin approves them. An approved report that a known feature works adds a visitor badge. An approved problem stays on this list, with a link to the park.
      </p>
      <div className="mt-6">
        <ReportForm heading="New report" />
        <AdminReports />
      </div>
    </div>
  );
}
