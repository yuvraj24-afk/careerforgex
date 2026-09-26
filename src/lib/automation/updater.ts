import { prisma } from "@/lib/db";
import { ExtractedOpportunityData } from "@/types/opportunity";
import { DeadlineEngine } from "./deadline-engine";

export interface UpdateResult {
  updated: boolean;
  opportunityId: string;
  changedFields: string[];
}

export class OpportunityUpdater {
  /**
   * Compares existing opportunity in database with fresh extraction,
   * logs any changed fields to OpportunityChangeLog, updates the record, and bumps version.
   */
  public static async updateExisting(
    existingId: string,
    fresh: ExtractedOpportunityData,
    sourceName?: string
  ): Promise<UpdateResult> {
    const existing = await prisma.opportunity.findUnique({
      where: { id: existingId },
    });

    if (!existing) {
      throw new Error(`Opportunity with ID ${existingId} not found`);
    }

    const changedFields: string[] = [];
    const changeLogs: Array<{
      fieldName: string;
      oldValue: string | null;
      newValue: string | null;
      reason: string;
    }> = [];

    // 1. Check Deadline Change
    if (fresh.deadline) {
      const oldDeadlineIso = existing.deadline ? existing.deadline.toISOString() : null;
      const newDeadlineIso = fresh.deadline.toISOString();

      if (oldDeadlineIso !== newDeadlineIso) {
        changedFields.push("deadline");
        changeLogs.push({
          fieldName: "deadline",
          oldValue: oldDeadlineIso,
          newValue: newDeadlineIso,
          reason: "Source extended or modified opportunity application deadline",
        });
      }
    }

    // 2. Check Stipend Change
    if (fresh.stipend && fresh.stipend !== existing.stipend) {
      changedFields.push("stipend");
      changeLogs.push({
        fieldName: "stipend",
        oldValue: existing.stipend,
        newValue: fresh.stipend,
        reason: "Source updated stipend/financial assistance terms",
      });
    }

    // 3. Check Eligibility Change
    if (fresh.eligibility && fresh.eligibility !== existing.eligibility) {
      changedFields.push("eligibility");
      changeLogs.push({
        fieldName: "eligibility",
        oldValue: existing.eligibility,
        newValue: fresh.eligibility,
        reason: "Updated applicant eligibility criteria",
      });
    }

    // 4. Check Application URL Change
    if (fresh.applicationUrl && fresh.applicationUrl !== existing.applicationUrl) {
      changedFields.push("applicationUrl");
      changeLogs.push({
        fieldName: "applicationUrl",
        oldValue: existing.applicationUrl,
        newValue: fresh.applicationUrl,
        reason: "Source redirected or updated primary application link",
      });
    }

    // 5. Check Duration Change
    if (fresh.duration && fresh.duration !== existing.duration) {
      changedFields.push("duration");
      changeLogs.push({
        fieldName: "duration",
        oldValue: existing.duration,
        newValue: fresh.duration,
        reason: "Program duration modified by source",
      });
    }

    // 6. Check Full Description Enhancement
    if (
      fresh.fullDescription &&
      fresh.fullDescription.length > (existing.fullDescription?.length || 0) + 50
    ) {
      changedFields.push("fullDescription");
      changeLogs.push({
        fieldName: "fullDescription",
        oldValue: existing.fullDescription?.slice(0, 100),
        newValue: fresh.fullDescription?.slice(0, 100),
        reason: "Enhanced description content parsed from source update",
      });
    }

    // If changes occurred, execute update and insert audit change logs
    if (changedFields.length > 0) {
      const calculatedDeadline = fresh.deadline || existing.deadline;
      const deadlineMetrics = DeadlineEngine.calculateStatus(calculatedDeadline);

      await prisma.$transaction(async (tx) => {
        // Record change logs
        for (const log of changeLogs) {
          await tx.opportunityChangeLog.create({
            data: {
              opportunityId: existingId,
              fieldName: log.fieldName,
              oldValue: log.oldValue,
              newValue: log.newValue,
              reason: log.reason,
              actorType: "SYSTEM",
              source: sourceName || "AUTONOMOUS_PIPELINE",
            },
          });
        }

        // Update opportunity record
        await tx.opportunity.update({
          where: { id: existingId },
          data: {
            deadline: calculatedDeadline,
            deadlineStatus: deadlineMetrics.status,
            daysRemaining: deadlineMetrics.daysRemaining,
            stipend: fresh.stipend || existing.stipend,
            eligibility: fresh.eligibility || existing.eligibility,
            applicationUrl: fresh.applicationUrl || existing.applicationUrl,
            duration: fresh.duration || existing.duration,
            fullDescription: fresh.fullDescription || existing.fullDescription,
            shortSummary: fresh.shortSummary || existing.shortSummary,
            version: { increment: 1 },
            lastRevalidatedAt: new Date(),
            revalidationStatus: "OK",
            actorType: "SYSTEM",
          },
        });
      });

      return {
        updated: true,
        opportunityId: existingId,
        changedFields,
      };
    }

    // If no changes, just update revalidation timestamp
    await prisma.opportunity.update({
      where: { id: existingId },
      data: {
        lastRevalidatedAt: new Date(),
        revalidationStatus: "OK",
      },
    });

    return {
      updated: false,
      opportunityId: existingId,
      changedFields: [],
    };
  }
}
