import { prisma } from "@/lib/db";
import { AutomationDashboardClient } from "./automation-client";

export const dynamic = "force-dynamic";

export default async function AdminAutomationPage() {
  const [
    totalSources,
    activeSources,
    degradedSources,
    pausedSources,
    blockedSources,
    totalOpportunities,
    publishedOpportunities,
    pendingReviewCount,
    sources,
    recentJobs,
    alerts,
    heartbeatMetric,
    pauseMetric,
  ] = await Promise.all([
    prisma.source.count(),
    prisma.source.count({ where: { status: "ACTIVE" } }),
    prisma.source.count({ where: { status: "DEGRADED" } }),
    prisma.source.count({ where: { status: "PAUSED" } }),
    prisma.source.count({ where: { status: "BLOCKED" } }),
    prisma.opportunity.count(),
    prisma.opportunity.count({ where: { status: "PUBLISHED" } }),
    prisma.reviewQueueItem.count({ where: { status: "PENDING" } }),
    prisma.source.findMany({
      orderBy: [{ priority: "asc" }, { updatedAt: "desc" }],
      take: 50,
    }),
    prisma.ingestionJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { source: true },
    }),
    prisma.systemAlert.findMany({
      where: { isResolved: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.systemMetric.findUnique({ where: { key: "last_worker_heartbeat" } }),
    prisma.systemMetric.findUnique({ where: { key: "pipeline_paused" } }),
  ]);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const expiredToday = await prisma.opportunity.count({
    where: {
      deadlineStatus: "EXPIRED",
      deadline: { gte: todayStart },
    },
  });

  let workerHealth: "HEALTHY" | "WARNING" | "OFFLINE" = "OFFLINE";
  if (heartbeatMetric?.value) {
    const diffMs = Date.now() - new Date(heartbeatMetric.value).getTime();
    if (diffMs < 5 * 60 * 1000) workerHealth = "HEALTHY";
    else if (diffMs < 6 * 60 * 60 * 1000) workerHealth = "WARNING";
    else workerHealth = "OFFLINE";
  }

  const initialData = {
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
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">
          Admin Autopilot & Ingestion Engine
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor source health, review autonomous ingestion throughput, and operate emergency system controls.
        </p>
      </div>

      <AutomationDashboardClient initialData={initialData} />
    </div>
  );
}
