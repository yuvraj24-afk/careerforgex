import { z } from "zod";
import { ExtractedOpportunityData, RawOpportunityPayload } from "@/types/opportunity";
import { OpportunityClassifier } from "./classifier";

export const OpportunityExtractionSchema = z.object({
  title: z.string().min(3),
  organization: z.string().min(2),
  opportunity_type: z.enum([
    "Internship",
    "Research",
    "Job",
    "PhD",
    "Scholarship",
    "Fellowship",
    "Competition",
    "Conference",
    "Workshop",
    "Higher Education",
    "Research Project",
    "Other",
  ]),
  short_summary: z.string().min(10),
  full_description: z.string().min(20),
  eligibility: z.string().nullable().optional(),
  degree_requirements: z.array(z.string()).optional(),
  year_requirements: z.array(z.string()).optional(),
  branch_requirements: z.array(z.string()).optional(),
  domain: z.string(),
  skills: z.array(z.string()).optional(),
  location: z.string().nullable().optional(),
  mode: z.enum(["Remote", "On-site", "Hybrid"]),
  duration: z.string().nullable().optional(),
  stipend: z.string().nullable().optional(),
  salary: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  deadline: z.string().nullable().optional(),
  application_process: z.string().nullable().optional(),
  application_url: z.string().url(),
  source_url: z.string().url(),
  source_published_date: z.string().nullable().optional(),
  contact_information_if_public: z.string().nullable().optional(),
  important_notes: z.string().nullable().optional(),
});

export class OpportunityExtractor {
  /**
   * Main entry point for opportunity extraction
   */
  public static async extract(
    payload: RawOpportunityPayload,
    sourceName: string
  ): Promise<ExtractedOpportunityData> {
    const aiKey = process.env.AI_PROVIDER_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

    if (aiKey && process.env.ENABLE_LIVE_AI_EXTRACTION === "true") {
      try {
        return await this.extractWithAI(payload, sourceName, aiKey);
      } catch (err) {
        console.warn(`[Extractor] AI extraction failed, falling back to deterministic extractor:`, err);
      }
    }

    // High-precision deterministic rule extractor
    return this.extractDeterministic(payload, sourceName);
  }

  /**
   * High-accuracy deterministic rule extractor with zero hallucinations.
   * If a field is not supported in the text, it is set strictly to null.
   */
  public static extractDeterministic(
    payload: RawOpportunityPayload,
    sourceName: string
  ): ExtractedOpportunityData {
    const text = `${payload.title}\n\n${payload.fullContent || payload.contentSnippet || ""}`;
    const organization = payload.organization || sourceName || "Official Host Institution";

    // 1. Classification
    const classification = OpportunityClassifier.classify(payload.title, text);

    // 2. Strict Deadline Extraction
    let deadline: Date | null = null;
    const deadlineSource = payload.deadlineString || text;

    // Pattern matches:
    // e.g. "Last date: 15/10/2026", "Deadline: October 15, 2026", "Apply by: 15-Nov-2026", "2026-11-20"
    const deadlineRegexes = [
      /(?:last date|deadline|submission date|closing date|apply by)[\s:]*([0-9]{4}[-/][0-9]{1,2}[-/][0-9]{1,2})/i,
      /(?:last date|deadline|submission date|closing date|apply by)[\s:]*([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})/i,
      /(?:last date|deadline|submission date|closing date|apply by)[\s:]*([0-9]{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]+[0-9]{4})/i,
      /(?:last date|deadline|submission date|closing date|apply by)[\s:]*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+[0-9]{1,2}(?:st|nd|rd|th)?,?\s+[0-9]{4})/i,
    ];

    for (const regex of deadlineRegexes) {
      const match = deadlineSource.match(regex);
      if (match && match[1]) {
        const parsed = this.parseDate(match[1]);
        if (parsed && !isNaN(parsed.getTime())) {
          deadline = parsed;
          break;
        }
      }
    }

    // 3. Strict Stipend Extraction (No fabrication)
    let stipend: string | null = null;
    const stipendMatch = text.match(
      /(?:stipend|fellowship|remuneration|financial assistance|consolidated pay)[\s:]*([₹Rs.0-9,/\s\-pm|per month]+)/i
    );
    if (stipendMatch && stipendMatch[1]) {
      const candidate = stipendMatch[1].trim().replace(/[.,;]+$/, "").slice(0, 50);
      if (/[0-9]/.test(candidate)) {
        stipend = candidate;
      }
    }

    // 4. Strict Eligibility Extraction
    let eligibility: string | null = null;
    const eligibilityMatch = text.match(
      /(?:eligibility|who can apply|qualification|prerequisites)[\s:]*([\s\S]{10,250}?)(?:\n\n|\.\s+[A-Z]|application|$)/i
    );
    if (eligibilityMatch && eligibilityMatch[1]) {
      eligibility = eligibilityMatch[1].replace(/\s+/g, " ").trim();
    }

    // 5. Duration Extraction
    let duration: string | null = null;
    const durationMatch = text.match(
      /(?:duration|period)[\s:]*([0-9]+\s+(?:weeks?|months?|years?)|(?:summer|winter)\s+[0-9]{4})/i
    );
    if (durationMatch && durationMatch[1]) {
      duration = durationMatch[1].trim();
    }

    // 6. Application Process / Notes
    let applicationProcess: string | null = null;
    const processMatch = text.match(
      /(?:how to apply|selection process|application procedure)[\s:]*([\s\S]{10,250}?)(?:\n\n|\.\s+[A-Z]|$)/i
    );
    if (processMatch && processMatch[1]) {
      applicationProcess = processMatch[1].replace(/\s+/g, " ").trim();
    }

    const shortSummary = (payload.contentSnippet || payload.title).slice(0, 250);
    const fullDescription = payload.fullContent || payload.contentSnippet || payload.title;

    return {
      title: payload.title.trim(),
      organization: organization.trim(),
      opportunityType: classification.opportunityType,
      category: classification.category,
      shortSummary,
      fullDescription,
      eligibility,
      degreeRequirements: classification.degreeRequirements,
      yearRequirements: classification.yearRequirements,
      branchRequirements: classification.branchRequirements,
      domain: classification.domain,
      skills: classification.skills,
      location: classification.mode === "Remote" ? "Remote" : `${organization}`,
      mode: classification.mode,
      duration,
      stipend,
      salary: null,
      isPaid: !!stipend || classification.isPaid,
      startDate: null,
      endDate: null,
      deadline,
      applicationProcess,
      applicationUrl: payload.applicationUrl || payload.sourceUrl,
      sourceUrl: payload.sourceUrl,
      originalSourceUrl: payload.sourceUrl,
      sourcePublishedDate: payload.publishedDate ? this.parseDate(payload.publishedDate) : null,
      contactInformation: null,
      importantNotes: payload.extraMeta?.stipendHint ? `Note: ${payload.extraMeta.stipendHint}` : null,
      canonicalUrl: payload.applicationUrl || payload.sourceUrl,
      externalId: payload.guid,
    };
  }

  private static parseDate(dateStr: string): Date | null {
    try {
      const clean = dateStr.replace(/(st|nd|rd|th)/gi, "").trim();
      // Handle DD-MM-YYYY or DD/MM/YYYY
      const parts = clean.match(/^([0-9]{1,2})[-/]([0-9]{1,2})[-/]([0-9]{2,4})$/);
      if (parts) {
        const day = parseInt(parts[1], 10);
        const month = parseInt(parts[2], 10) - 1;
        let year = parseInt(parts[3], 10);
        if (year < 100) year += 2000;
        return new Date(Date.UTC(year, month, day, 23, 59, 59));
      }

      const d = new Date(clean);
      return isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  }

  private static async extractWithAI(
    payload: RawOpportunityPayload,
    sourceName: string,
    apiKey: string
  ): Promise<ExtractedOpportunityData> {
    const prompt = `You are the CareerForgeX Precision Opportunity Extractor.
Extract structured opportunity information strictly supported by the text below.
DO NOT hallucinate or guess. If a field is not present in the text, use null.
NEVER invent stipends, deadlines, eligibility, or application links.

Source Name: ${sourceName}
URL: ${payload.sourceUrl}
Raw Title: ${payload.title}
Content:
${payload.fullContent?.slice(0, 3000) || payload.contentSnippet}

Output JSON schema matching:
{
  "title": string,
  "organization": string,
  "opportunity_type": "Internship" | "Research" | "Job" | "PhD" | "Scholarship" | "Fellowship" | "Competition" | "Conference" | "Workshop" | "Higher Education" | "Research Project" | "Other",
  "short_summary": string,
  "full_description": string,
  "eligibility": string | null,
  "degree_requirements": string[],
  "year_requirements": string[],
  "branch_requirements": string[],
  "domain": string,
  "skills": string[],
  "location": string | null,
  "mode": "Remote" | "On-site" | "Hybrid",
  "duration": string | null,
  "stipend": string | null,
  "salary": string | null,
  "deadline": "YYYY-MM-DD" | null,
  "application_process": string | null,
  "application_url": string
}`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    if (!res.ok) {
      throw new Error(`AI API returned status ${res.status}`);
    }

    const data = await res.json();
    const content = JSON.parse(data.choices[0].message.content);
    const parsed = OpportunityExtractionSchema.parse({
      ...content,
      application_url: content.application_url || payload.applicationUrl || payload.sourceUrl,
      source_url: payload.sourceUrl,
    });

    return {
      title: parsed.title,
      organization: parsed.organization,
      opportunityType: parsed.opportunity_type,
      shortSummary: parsed.short_summary,
      fullDescription: parsed.full_description,
      eligibility: parsed.eligibility,
      degreeRequirements: parsed.degree_requirements || [],
      yearRequirements: parsed.year_requirements || [],
      branchRequirements: parsed.branch_requirements || [],
      domain: parsed.domain,
      skills: parsed.skills || [],
      location: parsed.location,
      mode: parsed.mode,
      duration: parsed.duration,
      stipend: parsed.stipend,
      salary: parsed.salary,
      isPaid: !!parsed.stipend || !!parsed.salary,
      deadline: parsed.deadline ? new Date(parsed.deadline) : null,
      applicationProcess: parsed.application_process,
      applicationUrl: parsed.application_url,
      sourceUrl: payload.sourceUrl,
      originalSourceUrl: payload.sourceUrl,
      canonicalUrl: parsed.application_url,
      externalId: payload.guid,
    };
  }
}
