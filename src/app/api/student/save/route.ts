import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    // Default demo user for unauthenticated requests
    let userId = session?.user?.userId;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      userId = defaultUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "User session required" }, { status: 401 });
    }

    const body = await req.json();
    const { opportunityId } = body;

    if (!opportunityId) {
      return NextResponse.json({ error: "Missing opportunityId" }, { status: 400 });
    }

    const existing = await prisma.savedOpportunity.findUnique({
      where: {
        userId_opportunityId: {
          userId,
          opportunityId,
        },
      },
    });

    if (existing) {
      await prisma.savedOpportunity.delete({
        where: { id: existing.id },
      });
      await prisma.opportunity.update({
        where: { id: opportunityId },
        data: { saveCount: { decrement: 1 } },
      });
      return NextResponse.json({ success: true, saved: false, message: "Removed from saved opportunities." });
    } else {
      await prisma.savedOpportunity.create({
        data: {
          userId,
          opportunityId,
        },
      });
      await prisma.opportunity.update({
        where: { id: opportunityId },
        data: { saveCount: { increment: 1 } },
      });
      return NextResponse.json({ success: true, saved: true, message: "Opportunity bookmarked successfully." });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getAuthSession();
    let userId = session?.user?.userId;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      userId = defaultUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ success: true, saved: [] });
    }

    const saved = await prisma.savedOpportunity.findMany({
      where: { userId },
      include: { opportunity: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
