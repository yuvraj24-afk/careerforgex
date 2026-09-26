import { prisma } from "../lib/db";
import { OpportunityAutopilotPipeline } from "../lib/automation/pipeline";
import { DeadlineEngine } from "../lib/automation/deadline-engine";
import { OpportunityRevalidator } from "../lib/automation/revalidator";
import { SourceDiscoveryService } from "../lib/automation/discovery";

export class AutopilotWorkerDaemon {
  private isRunning = false;
  private intervalTimer: NodeJS.Timeout | null = null;
  private readonly loopIntervalMs: number;

  constructor(loopIntervalMs = 60000) {
    this.loopIntervalMs = loopIntervalMs;
  }

  /**
   * Starts the background scheduler loop. Runs completely independent of the browser.
   */
  public async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`[Worker] CareerForgeX Autopilot Daemon started. Polling interval: ${this.loopIntervalMs / 1000}s`);

    // Initial heartbeat
    await this.updateHeartbeat();

    // Run first iteration immediately
    await this.tick();

    // Schedule continuous loop
    this.intervalTimer = setInterval(async () => {
      await this.tick();
    }, this.loopIntervalMs);
  }

  public stop(): void {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
    this.isRunning = false;
    console.log(`[Worker] CareerForgeX Autopilot Daemon stopped.`);
  }

  /**
   * Single scheduler execution tick
   */
  public async tick(): Promise<{
    sourcesDue: number;
    sourcesProcessed: number;
    deadlinesSynced: number;
    revalidated: number;
  }> {
    const now = new Date();
    await this.updateHeartbeat();

    // 1. Check if pipeline is paused
    const pauseFlag = await prisma.systemMetric.findUnique({
      where: { key: "pipeline_paused" },
    });
    if (pauseFlag?.value === "true") {
      console.log(`[Worker] Pipeline is currently paused by admin. Waiting...`);
      return { sourcesDue: 0, sourcesProcessed: 0, deadlinesSynced: 0, revalidated: 0 };
    }

    // 2. Query sources that are due for check (nextCheckAt <= now OR nextCheckAt is null)
    const dueSources = await prisma.source.findMany({
      where: {
        status: { in: ["ACTIVE", "DEGRADED"] },
        isAutonomous: true,
        OR: [
          { nextCheckAt: null },
          { nextCheckAt: { lte: now } },
        ],
      },
      orderBy: [
        { priority: "asc" }, // Process priority 1 first
        { nextCheckAt: "asc" },
      ],
      take: 5, // Process in batches of 5 to avoid CPU thrashing
    });

    console.log(`[Worker Tick] Found ${dueSources.length} due source(s) at ${now.toISOString()}`);

    let processed = 0;
    for (const source of dueSources) {
      try {
        console.log(`[Worker] Processing source: ${source.name} (Tier ${source.tier})`);
        const result = await OpportunityAutopilotPipeline.processSource(source.id);
        console.log(
          `[Worker] Finished ${source.name}: success=${result.success}, scanned=${result.scanned}, created=${result.created}, updated=${result.updated}`
        );
        processed++;
      } catch (err: any) {
        console.error(`[Worker] Unexpected error on source ${source.id}:`, err.message);
      }
    }

    // 3. Sync Deadlines across all active opportunities
    const deadlineResult = await DeadlineEngine.syncAllDeadlines();

    // 4. Periodic Revalidation of 5 active items
    const revalidationStats = await OpportunityRevalidator.revalidateBatch(5);

    // 5. Update system metrics
    await prisma.systemMetric.upsert({
      where: { key: "last_worker_tick" },
      update: { value: new Date().toISOString() },
      create: { key: "last_worker_tick", value: new Date().toISOString() },
    });

    return {
      sourcesDue: dueSources.length,
      sourcesProcessed: processed,
      deadlinesSynced: deadlineResult.updated,
      revalidated: revalidationStats.checked,
    };
  }

  private async updateHeartbeat(): Promise<void> {
    try {
      await prisma.systemMetric.upsert({
        where: { key: "last_worker_heartbeat" },
        update: { value: new Date().toISOString() },
        create: { key: "last_worker_heartbeat", value: new Date().toISOString() },
      });
    } catch (e: any) {
      console.warn(`[Worker] Failed to record heartbeat:`, e.message);
    }
  }
}

// Standalone execution entrypoint when run as `node src/worker/runner.ts` or `tsx src/worker/runner.ts`
if (require.main === module || process.argv[1]?.includes("runner")) {
  const daemon = new AutopilotWorkerDaemon(process.env.WORKER_INTERVAL_MS ? parseInt(process.env.WORKER_INTERVAL_MS, 10) : 60000);

  // Check if run in one-shot mode (for cron)
  if (process.argv.includes("--once")) {
    console.log(`[Worker] Executing single-pass run...`);
    daemon
      .tick()
      .then((res) => {
        console.log(`[Worker] Single-pass completed:`, res);
        process.exit(0);
      })
      .catch((err) => {
        console.error(`[Worker] Fatal error in single-pass:`, err);
        process.exit(1);
      });
  } else {
    daemon.start().catch((err) => {
      console.error(`[Worker] Daemon crashed:`, err);
      process.exit(1);
    });

    // Graceful shutdown
    process.on("SIGINT", () => {
      console.log(`[Worker] Receiving SIGINT. Shutting down...`);
      daemon.stop();
      process.exit(0);
    });
    process.on("SIGTERM", () => {
      console.log(`[Worker] Receiving SIGTERM. Shutting down...`);
      daemon.stop();
      process.exit(0);
    });
  }
}
