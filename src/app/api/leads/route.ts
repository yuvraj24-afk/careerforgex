import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getAIProvider } from "@/lib/ai/factory";
import { mailer } from "@/lib/email/mailer";
import { webhookDispatcher } from "@/lib/webhooks/dispatcher";
import { getSessionUser, hasRequiredRole } from "@/lib/auth";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid work email is required"),
  company: z.string().min(2, "Company name is required"),
  website: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  automationGoal: z.string().min(10, "Please provide a brief description of what you want to automate"),
  currentTools: z.string().optional(),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  notes: z.string().optional(),
  source: z.string().optional().default("website_audit_form"),
  // Honeypot field for bot/spam prevention
  _gotcha: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limiter = rateLimit(`leads:${ip}`, { limit: 5, windowMs: 60000 });

  if (!limiter.success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute before submitting again." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // Honeypot verification: if _gotcha is filled, quietly reject bot
    if (body._gotcha && body._gotcha.trim() !== "") {
      console.warn("Spam honeypot triggered by IP:", ip);
      return NextResponse.json({ success: true, message: "Request received" });
    }

    const validated = leadSchema.parse(body);

    // AI automated lead scoring
    const aiProvider = getAIProvider();
    const scoringResult = await aiProvider.scoreLead({
      name: validated.name,
      company: validated.company,
      email: validated.email,
      website: validated.website,
      message: validated.automationGoal,
      currentTools: validated.currentTools,
    });

    // Save lead in database
    const lead = await db.lead.create({
      data: {
        name: validated.name,
        email: validated.email,
        company: validated.company,
        website: validated.website,
        industry: validated.industry || scoringResult.industry,
        companySize: validated.companySize,
        automationGoal: validated.automationGoal,
        currentTools: validated.currentTools,
        budgetRange: validated.budgetRange,
        timeline: validated.timeline,
        notes: validated.notes,
        source: validated.source,
        score: scoringResult.score,
        fitScore: scoringResult.potentialPriority,
        aiSummary: scoringResult.leadSummary,
        status: "New",
      },
    });

    // Asynchronously dispatch emails and webhooks
    Promise.allSettled([
      mailer.sendLeadConfirmation({
        name: lead.name,
        email: lead.email,
        company: lead.company,
        id: lead.id,
      }),
      mailer.sendAdminLeadNotification({
        name: lead.name,
        email: lead.email,
        company: lead.company,
        goal: lead.automationGoal,
        id: lead.id,
      }),
      webhookDispatcher.dispatch("lead.created", {
        leadId: lead.id,
        name: lead.name,
        company: lead.company,
        email: lead.email,
        score: lead.score,
        priority: lead.fitScore,
        service: scoringResult.recommendedService,
      }),
    ]);

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      leadSummary: scoringResult.leadSummary,
      recommendedService: scoringResult.recommendedService,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.errors }, { status: 400 });
    }
    console.error("Error creating lead:", err);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Protect GET route: Admin or Staff only
  const session = await getSessionUser(req);
  if (!session || !hasRequiredRole(session.role, ["admin", "staff", "viewer"])) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const industry = searchParams.get("industry");
  const search = searchParams.get("search");

  const where: any = {};
  if (status && status !== "All") where.status = status;
  if (industry && industry !== "All") where.industry = industry;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { company: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const leads = await db.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      bookings: true,
      projects: true,
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({ leads });
}
