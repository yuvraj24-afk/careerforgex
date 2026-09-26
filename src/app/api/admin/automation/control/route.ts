import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { OpportunityAutopilotPipeline } from "@/lib/automation/pipeline";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sourceId, jobId } = body;

    switch (action) {
      case "PAUSE_ALL": {
        await prisma.systemMetric.upsert({
          where: { key: "pipeline_paused" },
          update: { value: "true" },
          create: { key: "pipeline_paused", value: "true" },
        });
        return NextResponse.json({ success: true, message: "Global ingestion pipeline paused." });
      }

      case "RESUME_ALL": {
        await prisma.systemMetric.upsert({
          where: { key: "pipeline_paused" },
          update: { value: "false" },
          create: { key: "pipeline_paused", value: "false" },
        });
        return NextResponse.json({ success: true, message: "Global ingestion pipeline resumed." });
      }

      case "RUN_SOURCE_NOW": {
        if (!sourceId) return NextResponse.json({ error: "Missing sourceId" }, { status: 400 });
        const result = await OpportunityAutopilotPipeline.processSource(sourceId);
        return NextResponse.json({
          success: result.success,
          message: `Source processed immediately. Scanned: ${result.scanned}, Created: ${result.created}, Updated: ${result.updated}`,
          result,
        });
      }

      case "PAUSE_SOURCE": {
        if (!sourceId) return NextResponse.json({ error: "Missing sourceId" }, { status: 400 });
        await prisma.source.update({
          where: { id: sourceId },
          data: { status: "PAUSED" },
        });
        return NextResponse.json({ success: true, message: "Source paused." });
      }

      case "RESUME_SOURCE": {
        if (!sourceId) return NextResponse.json({ error: "Missing sourceId" }, { status: 400 });
        await prisma.source.update({
          where: { id: sourceId },
          data: { status: "ACTIVE", consecutiveFailures: 0 },
        });
        return NextResponse.json({ success: true, message: "Source resumed." });
      }

      case "MARK_TRUSTED": {
        if (!sourceId) return NextResponse.json({ error: "Missing sourceId" }, { status: 400 });
        await prisma.source.update({
          where: { id: sourceId },
          data: { trustStatus: "TRUSTED", tier: 1 },
        });
        return NextResponse.json({ success: true, message: "Source marked as TRUSTED Official Tier 1." });
      }

      case "BLOCK_SOURCE": {
        if (!sourceId) return NextResponse.json({ error: "Missing sourceId" }, { status: 400 });
        await prisma.source.update({
          where: { id: sourceId },
          data: { status: "BLOCKED", trustStatus: "BLOCKED" },
        });
        return NextResponse.json({ success: true, message: "Source blocked from autonomous indexing." });
      }

      case "REPROCESS_FAILED": {
        const failedSources = await prisma.source.findMany({
          where: { status: "DEGRADED" },
        });
        let reprocessed = 0;
        for (const s of failedSources) {
          await OpportunityAutopilotPipeline.processSource(s.id);
          reprocessed++;
        }
        return NextResponse.json({
          success: true,
          message: `Reprocessed ${reprocessed} degraded source(s).`,
        });
      }

      default:
        return NextResponse.json({ error: `Unknown action "${action}"` }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Control action failed" }, { status: 500 });
  }
}
