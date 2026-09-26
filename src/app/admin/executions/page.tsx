import { db } from "@/lib/db";
import { ExecutionsClient } from "./executions-client";

export const dynamic = "force-dynamic";

export default async function AdminExecutionsPage() {
  const executions = await db.automationExecution.findMany({
    orderBy: { createdAt: "desc" },
    include: { project: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Approvals Queue & Execution Traces</h1>
        <p className="text-xs text-gray-400 mt-1">
          Review autonomous agent operations requiring human sign-off before downstream dispatch.
        </p>
      </div>

      <ExecutionsClient initialExecutions={executions} />
    </div>
  );
}
