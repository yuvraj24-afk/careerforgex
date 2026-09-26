import { prisma } from "@/lib/db";
import { DeduplicationResult, ExtractedOpportunityData } from "@/types/opportunity";

export class OpportunityDeduplicator {
  /**
   * Compares incoming extracted opportunity against existing database records.
   */
  public static async checkDuplicate(
    candidate: ExtractedOpportunityData,
    sourceId?: string
  ): Promise<DeduplicationResult> {
    // 1. Signal A: Exact Canonical URL or Application URL
    const urlMatches = await prisma.opportunity.findMany({
      where: {
        OR: [
          { canonicalUrl: candidate.applicationUrl },
          { applicationUrl: candidate.applicationUrl },
          ...(candidate.sourceUrl ? [{ sourceUrl: candidate.sourceUrl }] : []),
          ...(candidate.externalId ? [{ externalId: candidate.externalId }] : []),
        ],
      },
      take: 3,
    });

    if (urlMatches.length > 0) {
      const match = urlMatches[0];
      return {
        decision: "EXACT_MATCH",
        similarityScore: 1.0,
        matchedOpportunityId: match.id,
        matchedOpportunityTitle: match.title,
        reason: "Exact match on application URL, source URL, or external ID",
      };
    }

    // 2. Signal B: Title and Organization Similarity
    // Query opportunities from the same organization or same domain
    const orgCandidates = await prisma.opportunity.findMany({
      where: {
        organization: {
          contains: candidate.organization.split(" ")[0] || candidate.organization,
        },
      },
      take: 20,
    });

    for (const existing of orgCandidates) {
      const titleSim = this.computeTitleSimilarity(candidate.title, existing.title);

      // Same organization + Very high title similarity (>= 0.85) => EXACT_MATCH
      if (titleSim >= 0.85) {
        return {
          decision: "EXACT_MATCH",
          similarityScore: titleSim,
          matchedOpportunityId: existing.id,
          matchedOpportunityTitle: existing.title,
          reason: `High title similarity (${Math.round(titleSim * 100)}%) with identical host organization`,
        };
      }

      // Same deadline + Moderate title similarity (>= 0.70) => LIKELY_DUPLICATE
      const sameDeadline =
        candidate.deadline &&
        existing.deadline &&
        Math.abs(candidate.deadline.getTime() - existing.deadline.getTime()) < 1000 * 60 * 60 * 24 * 2; // within 2 days

      if (sameDeadline && titleSim >= 0.65) {
        return {
          decision: "LIKELY_DUPLICATE",
          similarityScore: titleSim,
          matchedOpportunityId: existing.id,
          matchedOpportunityTitle: existing.title,
          reason: `Matching deadline with high title similarity (${Math.round(titleSim * 100)}%)`,
        };
      }

      // Title similarity between 0.70 and 0.84 => LIKELY_DUPLICATE
      if (titleSim >= 0.70) {
        return {
          decision: "LIKELY_DUPLICATE",
          similarityScore: titleSim,
          matchedOpportunityId: existing.id,
          matchedOpportunityTitle: existing.title,
          reason: `Potentially related opportunity or updated notice (${Math.round(titleSim * 100)}% title match)`,
        };
      }
    }

    // 3. Signal C: Global check across all active opportunities for extremely close title match
    const activeCandidates = await prisma.opportunity.findMany({
      where: {
        status: { in: ["PUBLISHED", "PENDING_REVIEW"] },
      },
      select: { id: true, title: true, organization: true, deadline: true },
      take: 50,
      orderBy: { createdAt: "desc" },
    });

    for (const existing of activeCandidates) {
      const titleSim = this.computeTitleSimilarity(candidate.title, existing.title);
      if (titleSim >= 0.88) {
        return {
          decision: "LIKELY_DUPLICATE",
          similarityScore: titleSim,
          matchedOpportunityId: existing.id,
          matchedOpportunityTitle: existing.title,
          reason: `Cross-source high title similarity (${Math.round(titleSim * 100)}%)`,
        };
      }
    }

    // No duplicate detected -> NEW
    return {
      decision: "NEW",
      similarityScore: 0,
      reason: "No duplicate signals matched",
    };
  }

  /**
   * Computes Jaccard word-token similarity on normalized lowercase strings
   */
  public static computeTitleSimilarity(str1: string, str2: string): number {
    const cleanTokens = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2);

    const tokens1 = new Set(cleanTokens(str1));
    const tokens2 = new Set(cleanTokens(str2));

    if (tokens1.size === 0 || tokens2.size === 0) return 0;

    let intersection = 0;
    for (const token of tokens1) {
      if (tokens2.has(token)) intersection++;
    }

    const union = new Set([...tokens1, ...tokens2]).size;
    return intersection / union;
  }
}
