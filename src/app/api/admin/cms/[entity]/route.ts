import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, hasRequiredRole } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { entity: string } }
) {
  const session = await getSessionUser(req);
  if (!session || !hasRequiredRole(session.role, ["admin", "staff", "viewer"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { entity } = params;

  if (entity === "blog") {
    const items = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ items });
  }

  if (entity === "case_studies") {
    const items = await db.caseStudy.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ items });
  }

  if (entity === "faqs") {
    const items = await db.fAQItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ items });
  }

  return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { entity: string } }
) {
  const session = await getSessionUser(req);
  if (!session || !hasRequiredRole(session.role, ["admin", "staff"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { entity } = params;
  const body = await req.json();

  if (entity === "blog") {
    const post = await db.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        excerpt: body.excerpt,
        content: body.content,
        category: body.category || "AI Automation",
        published: body.published ?? false,
      },
    });
    return NextResponse.json({ success: true, item: post });
  }

  if (entity === "case_studies") {
    const item = await db.caseStudy.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        industry: body.industry,
        summary: body.summary,
        problem: body.problem,
        solution: body.solution,
        workflow: body.workflow,
        tools: body.tools,
        results: body.results,
        isExample: body.isExample ?? true,
        published: body.published ?? true,
      },
    });
    return NextResponse.json({ success: true, item });
  }

  if (entity === "faqs") {
    const item = await db.fAQItem.create({
      data: {
        question: body.question,
        answer: body.answer,
        category: body.category || "General",
        order: body.order || 0,
        published: body.published ?? true,
      },
    });
    return NextResponse.json({ success: true, item });
  }

  return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
}
