import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, hasRequiredRole } from "@/lib/auth";
import { getAIProvider } from "@/lib/ai/factory";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session || !hasRequiredRole(session.role, ["admin", "staff"])) {
    return NextResponse.json({ error: "Unauthorized access to Admin Copilot" }, { status: 401 });
  }

  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Retrieve scoped context safely
    const leadCount = await db.lead.count();
    const recentLeads = await db.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { name: true, company: true, status: true, budgetRange: true, fitScore: true },
    });
    const upcomingBookings = await db.booking.count({
      where: { status: "Confirmed" },
    });

    const context = {
      totalLeads: leadCount,
      recentLeads,
      upcomingBookings,
      operator: session.name,
    };

    const provider = getAIProvider();
    const reply = await provider.chatCopilot(message, context);

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (err: any) {
    console.error("Admin copilot error:", err);
    return NextResponse.json({ error: "Copilot error occurred" }, { status: 500 });
  }
}
