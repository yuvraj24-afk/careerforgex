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
    const { status, progress, name, description } = body;

    const updated = await db.automationProject.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(progress !== undefined && { progress: Number(progress) }),
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
