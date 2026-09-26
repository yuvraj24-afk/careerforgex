import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@/lib/ai/factory";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  question: z.string().min(3),
  channel: z.string().optional(),
  customerTier: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limiter = rateLimit(`demo_support:${ip}`, { limit: 20, windowMs: 60000 });
  if (!limiter.success) {
    return NextResponse.json({ error: "Demo limit reached. Please wait a moment." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const validated = schema.parse(body);

    const provider = getAIProvider();
    const result = await provider.resolveSupport(validated);

    await db.demoRun.create({
      data: {
        demoType: "customer_support",
        mode: provider.isMock ? "demo" : "live",
        inputPayload: JSON.stringify(validated),
        resultSummary: result.answer.slice(0, 100),
        resultPayload: JSON.stringify(result),
      },
    });

    return NextResponse.json({
      success: true,
      mode: provider.isMock ? "Interactive Demo" : "Live Model",
      data: result,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to evaluate query" }, { status: 500 });
  }
}
