import { NextRequest, NextResponse } from "next/server";
import { webhookDispatcher } from "@/lib/webhooks/dispatcher";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-cfx-signature") || "";

    // Verify HMAC signature if secret configured
    if (process.env.WEBHOOK_SECRET_KEY && signature) {
      const isValid = webhookDispatcher.verifySignature(rawBody, signature);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);

    // Audit log inbound webhook event
    await db.auditLog.create({
      data: {
        action: `webhook.inbound.${payload.event || "unknown"}`,
        entityType: "webhook",
        metadata: JSON.stringify(payload),
      },
    });

    console.log(`[INBOUND WEBHOOK RECEIVED] Event: ${payload.event}`, payload.data);

    return NextResponse.json({
      success: true,
      receivedAt: new Date().toISOString(),
      event: payload.event,
    });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 400 });
  }
}
