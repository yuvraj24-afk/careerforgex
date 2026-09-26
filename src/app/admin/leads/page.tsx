import { db } from "@/lib/db";
import { LeadsManagerClient } from "./leads-client";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      bookings: true,
      projects: true,
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Leads & Inbound Ingestion CRM</h1>
        <p className="text-xs text-gray-400 mt-1">
          Review prospect requirements, evaluate automated AI scores, assign owners, and manage pipeline stages.
        </p>
      </div>

      <LeadsManagerClient initialLeads={leads} />
    </div>
  );
}
