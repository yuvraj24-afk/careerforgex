import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@/lib/ai/factory";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  email: z.string().email(),
  website: z.string().optional(),
  message: z.string().min(5),
  currentTools: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limiter = rateLimit(`demo_lead:${ip}`, { limit: 15, windowMs: 60000 });
  if (!limiter.success) {
    return NextResponse.json({ error: "Demo rate limit reached. Please wait a moment." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const validated = schema.parse(body);

    const provider = getAIProvider();
    const result = await provider.scoreLead(validated);

    // Record demo run in database
    await db.demoRun.create({
      data: {
        demoType: "lead_scoring",
        mode: provider.isMock ? "demo" : "live",
        inputPayload: JSON.stringify(validated),
        resultSummary: result.leadSummary,
        resultPayload: JSON.stringify(result),
      },
    });

    return NextResponse.json({
      success: true,
      mode: provider.isMock ? "Interactive Demo" : "Live Model",
      data: result,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid demo input", details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Demo evaluation failed" }, { status: 500 });
  }
}
