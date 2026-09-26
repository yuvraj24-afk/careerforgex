import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SmartFetcher } from "@/lib/automation/fetcher";
import { AdapterResolver } from "@/lib/automation/adapters/adapter-resolver";
import { OpportunityExtractor } from "@/lib/automation/extractor";

export async function GET() {
  try {
    const sources = await prisma.source.findMany({
      orderBy: [{ priority: "asc" }, { name: "asc" }],
      include: {
        _count: {
          select: { opportunities: true, ingestionJobs: true },
        },
      },
    });
    return NextResponse.json({ success: true, sources });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...sourceData } = body;

    // Test fetch / test extract preview action
    if (action === "TEST_FETCH") {
      const { url, adapterType } = sourceData;
      if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

      const fetchResult = await SmartFetcher.fetch(url, { maxRetries: 1 });
      const adapter = AdapterResolver.resolve(adapterType, url);
      const parsedItems = await adapter.parse(fetchResult, {
        id: "test",
        name: "Test Source",
        url,
        adapterType: adapter.adapterType,
        adapterVersion: adapter.version,
        parserVersion: "1.0.0",
      });

      let previewExtraction = null;
      if (parsedItems.length > 0) {
        previewExtraction = await OpportunityExtractor.extract(parsedItems[0], "Test Source");
      }

      return NextResponse.json({
        success: true,
        httpStatus: fetchResult.status,
        adapterUsed: adapter.adapterType,
        itemsCount: parsedItems.length,
        items: parsedItems.slice(0, 5),
        sampleExtraction: previewExtraction,
      });
    }

    // Create or Update source
    const { name, url, sourceType, tier, adapterType, checkFrequency, priority } = sourceData;

    if (!name || !url) {
      return NextResponse.json({ error: "Name and URL are required" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const source = await prisma.source.upsert({
      where: { slug },
      update: {
        name,
        url,
        sourceType: sourceType || "university",
        tier: tier ? parseInt(tier, 10) : 1,
        adapterType: adapterType || "html",
        checkFrequency: checkFrequency ? parseInt(checkFrequency, 10) : 360,
        priority: priority ? parseInt(priority, 10) : 1,
      },
      create: {
        name,
        slug,
        url,
        sourceType: sourceType || "university",
        tier: tier ? parseInt(tier, 10) : 1,
        adapterType: adapterType || "html",
        checkFrequency: checkFrequency ? parseInt(checkFrequency, 10) : 360,
        priority: priority ? parseInt(priority, 10) : 1,
        status: "ACTIVE",
        trustStatus: "TRUSTED",
        nextCheckAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, source });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
