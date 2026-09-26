import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, hasRequiredRole } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSessionUser(req);
  if (!session || !hasRequiredRole(session.role, ["admin", "staff"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { status, notes, assignedToId } = body;

    const updated = await db.lead.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(assignedToId !== undefined && { assignedToId }),
      },
    });

    // Log audit trail
    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: "lead.update",
        entityType: "lead",
        entityId: params.id,
        metadata: JSON.stringify({ updatedFields: Object.keys(body) }),
      },
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
