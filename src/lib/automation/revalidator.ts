import { prisma } from "@/lib/db";

export interface RevalidationStats {
  checked: number;
  healthy: number;
  warnings: number;
  markedNotFound: number;
  archived: number;
}

export class OpportunityRevalidator {
  /**
   * Revalidates a batch of active published opportunities by testing URL availability and detecting removals.
   */
  public static async revalidateBatch(limit = 25): Promise<RevalidationStats> {
    const opportunities = await prisma.opportunity.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: [
        { lastRevalidatedAt: "asc" },
        { createdAt: "desc" },
      ],
      take: limit,
      include: { source: true },
    });

    const stats: RevalidationStats = {
      checked: opportunities.length,
      healthy: 0,
      warnings: 0,
      markedNotFound: 0,
      archived: 0,
    };

    for (const opp of opportunities) {
      const targetUrl = opp.applicationUrl || opp.sourceUrl;
      let isAvailable = false;
      let is404 = false;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(targetUrl, {
          method: "HEAD",
          headers: {
            "User-Agent": "CareerForgeX-Revalidator/1.0 (+https://careerforgex.com/bot)",
          },
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (response.ok || [301, 302, 307, 308].includes(response.status)) {
          isAvailable = true;
        } else if (response.status === 404 || response.status === 410) {
          is404 = true;
        }
      } catch (err) {
        // Network timeout or temporary connection error
        isAvailable = false;
      }

      if (isAvailable) {
        await prisma.opportunity.update({
          where: { id: opp.id },
          data: {
            lastRevalidatedAt: new Date(),
            revalidationStatus: "OK",
            consecutive404s: 0,
            revalidationCount: { increment: 1 },
          },
        });
        stats.healthy++;
      } else if (is404) {
        const newConsecutive = opp.consecutive404s + 1;
        // If 404 persists 3 times consecutively, mark SOURCE_NOT_FOUND
        if (newConsecutive >= 3) {
          await prisma.opportunity.update({
            where: { id: opp.id },
            data: {
              lastRevalidatedAt: new Date(),
              revalidationStatus: "SOURCE_NOT_FOUND",
              status: "SOURCE_NOT_FOUND",
              consecutive404s: newConsecutive,
              revalidationCount: { increment: 1 },
            },
          });
          stats.markedNotFound++;
        } else {
          await prisma.opportunity.update({
            where: { id: opp.id },
            data: {
              lastRevalidatedAt: new Date(),
              revalidationStatus: "404_WARNING",
              consecutive404s: newConsecutive,
              revalidationCount: { increment: 1 },
            },
          });
          stats.warnings++;
        }
      } else {
        // Transient connection failure
        await prisma.opportunity.update({
          where: { id: opp.id },
          data: {
            lastRevalidatedAt: new Date(),
            revalidationCount: { increment: 1 },
          },
        });
        stats.warnings++;
      }
    }

    return stats;
  }
}
