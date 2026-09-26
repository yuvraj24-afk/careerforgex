import { NextRequest, NextResponse } from "next/server";
import { SourceDiscoveryService } from "@/lib/automation/discovery";

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
    const discovered = await SourceDiscoveryService.discoverFromSeedDirectories();
    return NextResponse.json({
      success: true,
      message: `Source discovery completed. Registered ${discovered} new institutional candidate(s).`,
      discoveredCount: discovered,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to run source discovery." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
