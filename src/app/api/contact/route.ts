import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { webhookDispatcher } from "@/lib/webhooks/dispatcher";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  _gotcha: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limiter = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60000 });

  if (!limiter.success) {
    return NextResponse.json({ error: "Too many messages. Please try again shortly." }, { status: 429 });
  }

  try {
    const body = await req.json();

    if (body._gotcha && body._gotcha.trim() !== "") {
      return NextResponse.json({ success: true, message: "Message received" });
    }

    const validated = contactSchema.parse(body);

    const submission = await db.contactSubmission.create({
      data: {
        name: validated.name,
        email: validated.email,
        company: validated.company,
        message: validated.message,
        ipHash: ip,
      },
    });

    webhookDispatcher.dispatch("contact.submitted", {
      id: submission.id,
      name: submission.name,
      email: submission.email,
      company: submission.company,
      messageSnippet: submission.message.slice(0, 100),
    });

    return NextResponse.json({ success: true, message: "Thank you. Your message has been received." });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form input", details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to process message right now." }, { status: 500 });
  }
}
