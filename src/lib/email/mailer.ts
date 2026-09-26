export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class TransactionalMailer {
  private resendApiKey: string | undefined;
  private fromEmail: string;

  constructor() {
    this.resendApiKey = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.EMAIL_FROM || "CareerForgeX <notifications@careerforgex.com>";
  }

  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; id?: string }> {
    // In development or when no Resend key is set, log email cleanly
    if (!this.resendApiKey || process.env.NODE_ENV === "development") {
      console.log("\n==================================================");
      console.log(`📨 [TRANSACTIONAL EMAIL DISPATCH - DEV SIMULATOR]`);
      console.log(`From:    ${this.fromEmail}`);
      console.log(`To:      ${payload.to}`);
      console.log(`Subject: ${payload.subject}`);
      console.log(`--------------------------------------------------`);
      console.log(payload.text || payload.html.replace(/<[^>]*>?/gm, "").slice(0, 300) + "...");
      console.log("==================================================\n");
      return { success: true, id: `dev_sim_${Date.now()}` };
    }

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.resendApiKey}`,
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
        }),
      });

      if (!res.ok) {
        throw new Error(`Resend API returned status ${res.status}`);
      }

      const data = await res.json();
      return { success: true, id: data.id };
    } catch (err) {
      console.error("Failed to dispatch live email:", err);
      return { success: false };
    }
  }

  async sendLeadConfirmation(lead: { name: string; email: string; company: string; id: string }) {
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0A0D14; color: #F9FAFB; padding: 40px; border-radius: 8px;">
        <h2 style="color: #6366F1; margin-bottom: 8px;">CareerForgeX</h2>
        <p style="color: #9CA3AF; font-size: 14px; margin-top: 0;">AI Automation & Intelligent Business Systems</p>
        <hr style="border: 0; border-top: 1px solid #1E293B; margin: 24px 0;" />
        <h3 style="font-size: 20px;">We've received your Automation Audit request, ${lead.name}.</h3>
        <p style="color: #D1D5DB; line-height: 1.6;">Our systems architecture team is reviewing the operational details for <strong>${lead.company}</strong>. We analyze current tooling, bottlenecks, and high-ROI agent deployment opportunities.</p>
        <div style="background-color: #101522; border: 1px solid #1E293B; padding: 16px; border-radius: 6px; margin: 24px 0;">
          <p style="margin: 0; font-size: 13px; color: #9CA3AF;">Lead Reference: <code>${lead.id}</code></p>
        </div>
        <p style="color: #D1D5DB;">Next step: If you'd like to fast-track your architecture review, you can book a direct time with our Lead Engineer:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/book" style="display: inline-block; background-color: #4F46E5; color: #FFFFFF; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 12px;">Schedule Systems Discovery Call</a>
        <p style="color: #6B7280; font-size: 12px; margin-top: 40px;">CareerForgeX • Secure Business Systems Engineering</p>
      </div>
    `;

    return this.sendEmail({
      to: lead.email,
      subject: `[Received] Your AI Automation Audit Request — CareerForgeX`,
      html,
    });
  }

  async sendAdminLeadNotification(lead: { name: string; email: string; company: string; goal: string; id: string }) {
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@careerforgex.com";
    const html = `
      <div style="font-family: -apple-system, sans-serif; padding: 24px; background: #111827; color: #F9FAFB;">
        <h3 style="color: #10B981; margin-top: 0;">⚡ New Inbound Automation Lead</h3>
        <p><strong>Contact:</strong> ${lead.name} (${lead.email})</p>
        <p><strong>Company:</strong> ${lead.company}</p>
        <p><strong>Requirement:</strong></p>
        <blockquote style="background: #1F2937; padding: 12px; border-left: 4px solid #6366F1; margin: 12px 0;">
          ${lead.goal}
        </blockquote>
        <p style="margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/leads" style="background: #6366F1; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Open in CRM Dashboard</a>
        </p>
      </div>
    `;

    return this.sendEmail({
      to: adminEmail,
      subject: `[New Lead Alert] ${lead.company} — ${lead.name}`,
      html,
    });
  }

  async sendBookingConfirmation(booking: { name: string; email: string; company: string; date: string; time: string; timezone: string }) {
    const html = `
      <div style="font-family: -apple-system, sans-serif; background-color: #0A0D14; color: #F9FAFB; padding: 32px; border-radius: 8px;">
        <h2 style="color: #6366F1; margin-bottom: 4px;">CareerForgeX Discovery Call Confirmed</h2>
        <p style="color: #9CA3AF; margin-top: 0;">We look forward to meeting with ${booking.name} from ${booking.company}.</p>
        <div style="background: #161D2E; border: 1px solid #1E293B; padding: 20px; border-radius: 6px; margin: 24px 0;">
          <p style="margin: 4px 0; color: #E5E7EB;"><strong>Date:</strong> ${booking.date}</p>
          <p style="margin: 4px 0; color: #E5E7EB;"><strong>Time:</strong> ${booking.time} (${booking.timezone})</p>
          <p style="margin: 4px 0; color: #E5E7EB;"><strong>Location:</strong> Video Conference (Link will be dispatched 15m prior)</p>
        </div>
        <p style="color: #9CA3AF; font-size: 14px;">Ahead of the call, feel free to gather details about your current software stack and team workflows.</p>
      </div>
    `;

    return this.sendEmail({
      to: booking.email,
      subject: `Confirmed: CareerForgeX Systems Discovery Call (${booking.date})`,
      html,
    });
  }
}

export const mailer = new TransactionalMailer();
