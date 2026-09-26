import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAuthSession();
    let userId = session?.user?.userId;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      userId = defaultUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ success: true, preference: null, notifications: [] });
    }

    const [preference, notifications] = await Promise.all([
      prisma.userAlertPreference.findUnique({ where: { userId } }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { opportunity: true },
      }),
    ]);

    return NextResponse.json({ success: true, preference, notifications });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();
    let userId = session?.user?.userId;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      userId = defaultUser?.id;
    }

    if (!userId) {
      return NextResponse.json({ error: "User session required" }, { status: 401 });
    }

    const body = await req.json();
    const { opportunityTypes, domains, keywords, locations, degreeLevel, inAppAlerts, emailAlerts } = body;

    const pref = await prisma.userAlertPreference.upsert({
      where: { userId },
      update: {
        opportunityTypes: opportunityTypes ? JSON.stringify(opportunityTypes) : null,
        domains: domains ? JSON.stringify(domains) : null,
        keywords: keywords || null,
        locations: locations || null,
        degreeLevel: degreeLevel || null,
        inAppAlerts: inAppAlerts !== undefined ? inAppAlerts : true,
        emailAlerts: emailAlerts !== undefined ? emailAlerts : false,
      },
      create: {
        userId,
        opportunityTypes: opportunityTypes ? JSON.stringify(opportunityTypes) : null,
        domains: domains ? JSON.stringify(domains) : null,
        keywords: keywords || null,
        locations: locations || null,
        degreeLevel: degreeLevel || null,
        inAppAlerts: inAppAlerts !== undefined ? inAppAlerts : true,
        emailAlerts: emailAlerts !== undefined ? emailAlerts : false,
      },
    });

    return NextResponse.json({ success: true, preference: pref, message: "Alert preferences updated." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
