import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, hasRequiredRole } from "@/lib/auth";
import { agentOrchestrator } from "@/lib/ai/agent-orchestrator";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionUser(req);
  if (!session || !hasRequiredRole(session.role, ["admin", "staff"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action } = await req.json(); // "approve" or "reject"

    if (action === "approve") {
      const updated = await agentOrchestrator.approveExecution(params.id, session.name);
      return NextResponse.json({ success: true, status: "completed", execution: updated });
    } else {
      const updated = await db.automationExecution.update({
        where: { id: params.id },
        data: {
          status: "cancelled",
          approvedBy: `Rejected by ${session.name}`,
        },
      });
      return NextResponse.json({ success: true, status: "cancelled", execution: updated });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process approval" }, { status: 500 });
  }
}
