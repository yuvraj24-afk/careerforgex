import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const totalSources = await prisma.source.count();
    const activeSources = await prisma.source.count({ where: { status: "ACTIVE" } });
    const degradedSources = await prisma.source.count({ where: { status: "DEGRADED" } });
    const pausedSources = await prisma.source.count({ where: { status: "PAUSED" } });
    const blockedSources = await prisma.source.count({ where: { status: "BLOCKED" } });

    const totalOpportunities = await prisma.opportunity.count();
    const publishedOpportunities = await prisma.opportunity.count({ where: { status: "PUBLISHED" } });
    const pendingReviewCount = await prisma.reviewQueueItem.count({ where: { status: "PENDING" } });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const expiredToday = await prisma.opportunity.count({
      where: {
        deadlineStatus: "EXPIRED",
        deadline: { gte: todayStart },
      },
    });

    const sources = await prisma.source.findMany({
      orderBy: [{ priority: "asc" }, { updatedAt: "desc" }],
      take: 50,
    });

    const recentJobs = await prisma.ingestionJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { source: true },
    });

    const alerts = await prisma.systemAlert.findMany({
      where: { isResolved: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const heartbeatMetric = await prisma.systemMetric.findUnique({
      where: { key: "last_worker_heartbeat" },
    });
    const pauseMetric = await prisma.systemMetric.findUnique({
      where: { key: "pipeline_paused" },
    });

    // Check if worker heartbeat is older than 6 hours
    let workerHealth: "HEALTHY" | "WARNING" | "OFFLINE" = "OFFLINE";
    if (heartbeatMetric?.value) {
      const diffMs = Date.now() - new Date(heartbeatMetric.value).getTime();
      if (diffMs < 5 * 60 * 1000) workerHealth = "HEALTHY";
      else if (diffMs < 6 * 60 * 60 * 1000) workerHealth = "WARNING";
      else workerHealth = "OFFLINE";
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalSources,
        activeSources,
        degradedSources,
        pausedSources,
        blockedSources,
        totalOpportunities,
        publishedOpportunities,
        pendingReviewCount,
        expiredToday,
      },
      system: {
        workerHealth,
        lastHeartbeat: heartbeatMetric?.value || null,
        isPipelinePaused: pauseMetric?.value === "true",
      },
      sources,
      recentJobs,
      alerts,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
