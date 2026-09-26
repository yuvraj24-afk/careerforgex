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
    const { status, meetingLink, notes } = body;

    const updated = await db.booking.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(meetingLink !== undefined && { meetingLink }),
        ...(notes !== undefined && { notes }),
      },
    });

    await db.auditLog.create({
      data: {
        userId: session.userId,
        action: "booking.update",
        entityType: "booking",
        entityId: params.id,
        metadata: JSON.stringify({ status, meetingLink }),
      },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
