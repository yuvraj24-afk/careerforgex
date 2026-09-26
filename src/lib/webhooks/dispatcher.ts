import crypto from "crypto";

export interface WebhookEventPayload {
  event: string;
  timestamp: string;
  data: Record<string, any>;
}

export class WebhookDispatcher {
  private n8nUrl: string | undefined;
  private slackUrl: string | undefined;
  private secretKey: string;

  constructor() {
    this.n8nUrl = process.env.N8N_WEBHOOK_URL;
    this.slackUrl = process.env.SLACK_WEBHOOK_URL;
    this.secretKey = process.env.WEBHOOK_SECRET_KEY || "cfx_default_webhook_secret_32_bytes";
  }

  generateSignature(payload: string): string {
    return crypto.createHmac("sha256", this.secretKey).update(payload).digest("hex");
  }

  verifySignature(payload: string, signature: string): boolean {
    const expected = this.generateSignature(payload);
    try {
      return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    } catch {
      return false;
    }
  }

  async dispatch(event: string, data: Record<string, any>) {
    const payload: WebhookEventPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };
    const body = JSON.stringify(payload);
    const signature = this.generateSignature(body);

    const promises: Promise<any>[] = [];

    // Dispatch to n8n if configured
    if (this.n8nUrl) {
      promises.push(
        fetch(this.n8nUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CFX-Signature": signature,
          },
          body,
        }).catch((err) => console.error("n8n webhook dispatch error:", err))
      );
    }

    // Dispatch to Slack if configured
    if (this.slackUrl) {
      const slackText = `*⚡ Event:* \`${event}\`\n*Details:* ${JSON.stringify(data).slice(0, 250)}`;
      promises.push(
        fetch(this.slackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: slackText }),
        }).catch((err) => console.error("Slack webhook dispatch error:", err))
      );
    }

    if (promises.length === 0) {
      console.log(`[OUTBOUND WEBHOOK (LOCAL SIMULATOR)] Event: ${event}`, data);
    }

    await Promise.allSettled(promises);
  }
}

export const webhookDispatcher = new WebhookDispatcher();
