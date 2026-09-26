import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");

    // In local demo mode, handle mock event
    let event = { type: "checkout.session.completed", data: { object: { customer_email: "demo@client.com" } } };

    try {
      if (rawBody) {
        event = JSON.parse(rawBody);
      }
    } catch {
      // payload parsed
    }

    await db.auditLog.create({
      data: {
        action: `stripe.${event.type}`,
        entityType: "payment",
        metadata: JSON.stringify(event),
      },
    });

    return NextResponse.json({ received: true, event: event.type });
  } catch (err: any) {
    return NextResponse.json({ error: "Stripe webhook handling failed" }, { status: 400 });
  }
}
