import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@/lib/ai/factory";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  emailContent: z.string().min(10, "Please provide realistic email content"),
  sender: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limiter = rateLimit(`demo_email:${ip}`, { limit: 20, windowMs: 60000 });
  if (!limiter.success) {
    return NextResponse.json({ error: "Demo limit reached. Please wait a moment." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const validated = schema.parse(body);

    const provider = getAIProvider();
    const result = await provider.classifyEmail(validated);

    await db.demoRun.create({
      data: {
        demoType: "email_automation",
        mode: provider.isMock ? "demo" : "live",
        inputPayload: JSON.stringify(validated),
        resultSummary: `${result.classification} (${result.urgency}) - ${result.suggestedAction.slice(0, 60)}`,
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
      return NextResponse.json({ error: "Invalid email input", details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to classify email." }, { status: 500 });
  }
}
