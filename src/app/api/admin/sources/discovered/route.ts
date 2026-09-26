import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const discovered = await prisma.discoveredSource.findMany({
      orderBy: [{ trustTier: "asc" }, { createdAt: "desc" }],
      take: 100,
    });
    return NextResponse.json({ success: true, discovered });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { discoveredId, action } = body;

    if (!discoveredId) {
      return NextResponse.json({ error: "Missing discoveredId" }, { status: 400 });
    }

    const item = await prisma.discoveredSource.findUnique({
      where: { id: discoveredId },
    });

    if (!item) {
      return NextResponse.json({ error: "Discovered source not found" }, { status: 404 });
    }

    if (action === "PROMOTE_TO_ACTIVE") {
      const slug = (item.name || item.domain)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const created = await prisma.source.upsert({
        where: { slug },
        update: { status: "ACTIVE" },
        create: {
          name: item.name || `${item.domain} Opportunity Portal`,
          slug,
          url: item.url,
          sourceType: item.institutionType || "university",
          tier: item.trustTier,
          adapterType: item.testedAdapter || "html",
          checkFrequency: 720,
          status: "ACTIVE",
          trustStatus: "TRUSTED",
          nextCheckAt: new Date(),
        },
      });

      await prisma.discoveredSource.update({
        where: { id: discoveredId },
        data: {
          status: "APPROVED",
          sourceId: created.id,
        },
      });

      return NextResponse.json({ success: true, message: "Promoted to active monitoring source.", source: created });
    }

    if (action === "BLOCK") {
      await prisma.discoveredSource.update({
        where: { id: discoveredId },
        data: { status: "BLOCKED" },
      });
      return NextResponse.json({ success: true, message: "Discovered source blocked." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
