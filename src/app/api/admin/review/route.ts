import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "PENDING";

    const items = await prisma.reviewQueueItem.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      include: {
        opportunity: true,
      },
      take: 50,
    });

    return NextResponse.json({ success: true, items });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reviewItemId, action, updatedData, reviewNotes } = body;

    if (!reviewItemId || !action) {
      return NextResponse.json({ error: "Missing reviewItemId or action" }, { status: 400 });
    }

    const reviewItem = await prisma.reviewQueueItem.findUnique({
      where: { id: reviewItemId },
      include: { opportunity: true },
    });

    if (!reviewItem) {
      return NextResponse.json({ error: "Review item not found" }, { status: 404 });
    }

    const oppId = reviewItem.opportunityId;

    switch (action) {
      case "APPROVE": {
        if (oppId) {
          await prisma.opportunity.update({
            where: { id: oppId },
            data: { status: "PUBLISHED", isVerified: true },
          });
        }
        await prisma.reviewQueueItem.update({
          where: { id: reviewItemId },
          data: {
            status: "APPROVED",
            reviewedAt: new Date(),
            reviewNotes: reviewNotes || "Approved by admin",
          },
        });
        return NextResponse.json({ success: true, message: "Opportunity approved and published." });
      }

      case "EDIT_AND_PUBLISH": {
        if (oppId && updatedData) {
          await prisma.opportunity.update({
            where: { id: oppId },
            data: {
              ...updatedData,
              status: "PUBLISHED",
              isVerified: true,
            },
          });
        }
        await prisma.reviewQueueItem.update({
          where: { id: reviewItemId },
          data: {
            status: "APPROVED",
            reviewedAt: new Date(),
            reviewNotes: reviewNotes || "Edited and approved by admin",
          },
        });
        return NextResponse.json({ success: true, message: "Opportunity edited and published." });
      }

      case "MERGE_DUPLICATE": {
        if (oppId) {
          await prisma.opportunity.update({
            where: { id: oppId },
            data: { status: "ARCHIVED" },
          });
        }
        await prisma.reviewQueueItem.update({
          where: { id: reviewItemId },
          data: {
            status: "MERGED",
            reviewedAt: new Date(),
            reviewNotes: reviewNotes || `Merged with target ID: ${reviewItem.duplicateOfId}`,
          },
        });
        return NextResponse.json({ success: true, message: "Marked as duplicate and merged." });
      }

      case "REJECT": {
        if (oppId) {
          await prisma.opportunity.update({
            where: { id: oppId },
            data: { status: "REJECTED" },
          });
        }
        await prisma.reviewQueueItem.update({
          where: { id: reviewItemId },
          data: {
            status: "REJECTED",
            reviewedAt: new Date(),
            reviewNotes: reviewNotes || "Rejected by admin",
          },
        });
        return NextResponse.json({ success: true, message: "Opportunity rejected." });
      }

      default:
        return NextResponse.json({ error: `Unsupported review action: ${action}` }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
