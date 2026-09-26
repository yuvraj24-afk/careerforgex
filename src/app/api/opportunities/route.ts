import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DeadlineEngine } from "@/lib/automation/deadline-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const type = searchParams.get("type");
    const domain = searchParams.get("domain");
    const mode = searchParams.get("mode");
    const isPaid = searchParams.get("isPaid");
    const status = searchParams.get("status"); // OPEN, CLOSING_SOON, etc.
    const sort = searchParams.get("sort") || "latest"; // latest, closing_soon, views
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const skip = (page - 1) * limit;

    const where: any = {
      status: "PUBLISHED",
    };

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { organization: { contains: q } },
        { shortSummary: { contains: q } },
        { fullDescription: { contains: q } },
        { domain: { contains: q } },
        { skills: { contains: q } },
      ];
    }

    if (type && type !== "All") {
      where.opportunityType = type;
    }

    if (domain && domain !== "All") {
      where.domain = domain;
    }

    if (mode && mode !== "All") {
      where.mode = mode;
    }

    if (isPaid === "true") {
      where.isPaid = true;
    }

    if (status === "CLOSING_SOON") {
      where.deadlineStatus = "CLOSING_SOON";
    } else if (status === "OPEN") {
      where.deadlineStatus = { in: ["OPEN", "CLOSING_SOON", "NO_DEADLINE"] };
    }

    let orderBy: any = [{ createdAt: "desc" }];
    if (sort === "closing_soon") {
      orderBy = [{ deadline: "asc" }, { createdAt: "desc" }];
    } else if (sort === "views") {
      orderBy = [{ viewCount: "desc" }, { createdAt: "desc" }];
    }

    const [total, opportunities] = await Promise.all([
      prisma.opportunity.count({ where }),
      prisma.opportunity.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          source: {
            select: {
              name: true,
              tier: true,
              sourceType: true,
            },
          },
        },
      }),
    ]);

    // Format output with live deadline labels
    const formatted = opportunities.map((opp) => {
      const deadlineCalc = DeadlineEngine.calculateStatus(opp.deadline);
      return {
        id: opp.id,
        title: opp.title,
        slug: opp.slug,
        organization: opp.organization,
        opportunityType: opp.opportunityType,
        shortSummary: opp.shortSummary,
        domain: opp.domain,
        location: opp.location,
        mode: opp.mode,
        duration: opp.duration,
        stipend: opp.stipend,
        isPaid: opp.isPaid,
        deadline: opp.deadline,
        deadlineStatus: deadlineCalc.status,
        daysRemaining: deadlineCalc.daysRemaining,
        deadlineLabel: deadlineCalc.label,
        deadlineBadgeVariant: deadlineCalc.badgeVariant,
        applicationUrl: opp.applicationUrl,
        sourceUrl: opp.sourceUrl,
        isVerified: opp.isVerified,
        confidenceScore: opp.confidenceScore,
        createdAt: opp.createdAt,
        updatedAt: opp.updatedAt,
        source: opp.source,
      };
    });

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      opportunities: formatted,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
