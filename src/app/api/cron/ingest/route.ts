import { NextRequest, NextResponse } from "next/server";
import { AutopilotWorkerDaemon } from "@/worker/runner";

function verifyCronSecret(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || process.env.WORKER_SECRET;

  // In development mode or if secret isn't configured, allow localhost calls
  if (!cronSecret) return true;

  if (authHeader === `Bearer ${cronSecret}`) return true;
  return false;
}

export async function POST(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized. Invalid CRON_SECRET." }, { status: 401 });
  }

  try {
    const daemon = new AutopilotWorkerDaemon();
    const result = await daemon.tick();
    return NextResponse.json({
      success: true,
      message: "Ingestion cron job executed successfully.",
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to run ingestion cron." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
