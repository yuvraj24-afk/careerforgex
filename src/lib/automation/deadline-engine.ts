import { prisma } from "@/lib/db";
import { DeadlineStatus } from "@/types/opportunity";

export interface DeadlineCalculation {
  status: DeadlineStatus;
  daysRemaining: number | null;
  label: string;
  badgeVariant: "success" | "warning" | "danger" | "neutral";
}

export class DeadlineEngine {
  /**
   * Calculates dynamic deadline status and label relative to a reference time (default: now)
   */
  public static calculateStatus(deadline?: Date | null, now: Date = new Date()): DeadlineCalculation {
    if (!deadline || isNaN(deadline.getTime())) {
      return {
        status: "NO_DEADLINE",
        daysRemaining: null,
        label: "Rolling / Open",
        badgeVariant: "neutral",
      };
    }

    const diffMs = deadline.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      return {
        status: "EXPIRED",
        daysRemaining,
        label: "Deadline passed",
        badgeVariant: "danger",
      };
    }

    if (daysRemaining === 0) {
      return {
        status: "CLOSING_SOON",
        daysRemaining: 0,
        label: "Closing today",
        badgeVariant: "danger",
      };
    }

    if (daysRemaining <= 3) {
      return {
        status: "CLOSING_SOON",
        daysRemaining,
        label: daysRemaining === 1 ? "Closing in 1 day" : `Closing in ${daysRemaining} days`,
        badgeVariant: "warning",
      };
    }

    if (daysRemaining <= 7) {
      return {
        status: "OPEN",
        daysRemaining,
        label: `Closing in ${daysRemaining} days`,
        badgeVariant: "warning",
      };
    }

    return {
      status: "OPEN",
      daysRemaining,
      label: `${daysRemaining} days remaining`,
      badgeVariant: "success",
    };
  }

  /**
   * Batch recalculates and synchronizes deadline statuses across all active opportunities
   */
  public static async syncAllDeadlines(): Promise<{ checked: number; updated: number; expired: number }> {
    const opportunities = await prisma.opportunity.findMany({
      where: {
        status: { in: ["PUBLISHED", "PENDING_REVIEW"] },
      },
      select: {
        id: true,
        deadline: true,
        deadlineStatus: true,
        daysRemaining: true,
      },
    });

    let updated = 0;
    let expired = 0;
    const now = new Date();

    for (const opp of opportunities) {
      const calc = this.calculateStatus(opp.deadline, now);

      if (calc.status !== opp.deadlineStatus || calc.daysRemaining !== opp.daysRemaining) {
        await prisma.opportunity.update({
          where: { id: opp.id },
          data: {
            deadlineStatus: calc.status,
            daysRemaining: calc.daysRemaining,
          },
        });
        updated++;
        if (calc.status === "EXPIRED") {
          expired++;
        }
      }
    }

    return {
      checked: opportunities.length,
      updated,
      expired,
    };
  }

  /**
   * Automatically archives opportunities that have been expired for more than retentionDays (default: 30)
   */
  public static async archiveExpiredOpportunities(retentionDays = 30): Promise<number> {
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    const result = await prisma.opportunity.updateMany({
      where: {
        status: "PUBLISHED",
        deadlineStatus: "EXPIRED",
        deadline: {
          lt: cutoff,
        },
      },
      data: {
        status: "ARCHIVED",
      },
    });

    return result.count;
  }
}
