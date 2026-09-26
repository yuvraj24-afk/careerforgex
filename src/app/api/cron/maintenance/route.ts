import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DeadlineEngine } from "@/lib/automation/deadline-engine";

function verifyCronSecret(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || process.env.WORKER_SECRET;
  if (!cronSecret) return true;
  return authHeader === `Bearer ${cronSecret}`;
}

export async function POST(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    // 1. Sync Deadlines
    const deadlineStats = await DeadlineEngine.syncAllDeadlines();

    // 2. Archive Expired (30 days)
    const archivedCount = await DeadlineEngine.archiveExpiredOpportunities(30);

    // 3. Clean old ingestion logs older than 30 days
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const deletedLogs = await prisma.ingestionJob.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Maintenance cleanup finished.",
      deadlines: deadlineStats,
      archivedOpportunities: archivedCount,
      cleanedLogs: deletedLogs.count,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to run maintenance job." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
