import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DeadlineEngine } from "@/lib/automation/deadline-engine";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    const opp = await prisma.opportunity.findUnique({
      where: { slug },
      include: {
        source: {
          select: {
            id: true,
            name: true,
            url: true,
            tier: true,
            sourceType: true,
            lastCheckedAt: true,
          },
        },
        changeLogs: {
          orderBy: { changedAt: "desc" },
          take: 10,
        },
      },
    });

    if (!opp) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    // Increment view count asynchronously
    prisma.opportunity
      .update({
        where: { id: opp.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch(() => {});

    const deadlineCalc = DeadlineEngine.calculateStatus(opp.deadline);

    // Parse JSON array strings safely
    const parseSafe = (val: string | null) => {
      if (!val) return [];
      try {
        return JSON.parse(val);
      } catch {
        return [val];
      }
    };

    // Find similar opportunities
    const similar = await prisma.opportunity.findMany({
      where: {
        id: { not: opp.id },
        status: "PUBLISHED",
        OR: [{ domain: opp.domain }, { opportunityType: opp.opportunityType }],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        organization: true,
        opportunityType: true,
        domain: true,
        deadline: true,
        mode: true,
        stipend: true,
      },
      take: 4,
    });

    return NextResponse.json({
      success: true,
      opportunity: {
        ...opp,
        degreeRequirements: parseSafe(opp.degreeRequirements),
        yearRequirements: parseSafe(opp.yearRequirements),
        branchRequirements: parseSafe(opp.branchRequirements),
        skills: parseSafe(opp.skills),
        deadlineStatus: deadlineCalc.status,
        daysRemaining: deadlineCalc.daysRemaining,
        deadlineLabel: deadlineCalc.label,
        deadlineBadgeVariant: deadlineCalc.badgeVariant,
      },
      similar,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
