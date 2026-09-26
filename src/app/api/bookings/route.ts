import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { mailer } from "@/lib/email/mailer";
import { webhookDispatcher } from "@/lib/webhooks/dispatcher";
import { getSessionUser, hasRequiredRole } from "@/lib/auth";

const bookingSchema = z.object({
  leadId: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  company: z.string().min(2, "Company is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  time: z.string().min(4, "Time slot is required"),
  timezone: z.string().default("UTC"),
  notes: z.string().optional(),
  _gotcha: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limiter = rateLimit(`bookings:${ip}`, { limit: 5, windowMs: 60000 });

  if (!limiter.success) {
    return NextResponse.json({ error: "Too many booking requests. Please wait a minute." }, { status: 429 });
  }

  try {
    const body = await req.json();

    if (body._gotcha && body._gotcha.trim() !== "") {
      return NextResponse.json({ success: true, message: "Booking requested" });
    }

    const validated = bookingSchema.parse(body);

    const booking = await db.booking.create({
      data: {
        leadId: validated.leadId,
        name: validated.name,
        email: validated.email,
        company: validated.company,
        date: validated.date,
        time: validated.time,
        timezone: validated.timezone,
        notes: validated.notes,
        status: "Confirmed",
        meetingLink: `https://meet.careerforgex.com/audit-${Math.random().toString(36).substring(2, 9)}`,
      },
    });

    // Send confirmation email
    Promise.allSettled([
      mailer.sendBookingConfirmation({
        name: booking.name,
        email: booking.email,
        company: booking.company,
        date: booking.date,
        time: booking.time,
        timezone: booking.timezone,
      }),
      webhookDispatcher.dispatch("booking.created", {
        bookingId: booking.id,
        name: booking.name,
        company: booking.company,
        date: booking.date,
        time: booking.time,
      }),
    ]);

    return NextResponse.json({ success: true, bookingId: booking.id, meetingLink: booking.meetingLink });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    console.error("Error creating booking:", err);
    return NextResponse.json({ error: "Failed to reserve booking slot." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session || !hasRequiredRole(session.role, ["admin", "staff", "viewer"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { lead: true },
  });

  return NextResponse.json({ bookings });
}
