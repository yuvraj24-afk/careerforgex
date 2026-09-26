import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "operational";

  try {
    // Quick DB connectivity check
    await db.$queryRaw`SELECT 1`;
  } catch (error) {
    dbStatus = "degraded";
  }

  const responseTime = Date.now() - startTime;

  return NextResponse.json(
    {
      status: dbStatus === "operational" ? "healthy" : "degraded",
      environment: process.env.NODE_ENV || "development",
      demoMode: process.env.DEMO_MODE !== "false",
      timestamp: new Date().toISOString(),
      services: {
        database: { status: dbStatus, latencyMs: responseTime },
        aiOrchestrator: { status: "operational", mode: process.env.DEMO_MODE !== "false" ? "demo" : "live" },
        emailService: { status: "operational" },
        webhookDispatcher: { status: "operational" },
      },
    },
    { status: dbStatus === "operational" ? 200 : 503 }
  );
}
