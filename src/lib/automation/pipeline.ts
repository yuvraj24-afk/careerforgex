import { prisma } from "@/lib/db";
import { SmartFetcher } from "./fetcher";
import { AdapterResolver } from "./adapters/adapter-resolver";
import { OpportunityExtractor } from "./extractor";
import { OpportunityDeduplicator } from "./deduplicator";
import { OpportunityUpdater } from "./updater";
import { OpportunityPublisher } from "./publisher";
import { DeadlineEngine } from "./deadline-engine";
import { SourceDiscoveryService } from "./discovery";
import { SourceTier } from "@/types/opportunity";

export interface PipelineRunResult {
  runId: string;
  sourceId: string;
  sourceName: string;
  success: boolean;
  isUnchanged: boolean;
  scanned: number;
  created: number;
  updated: number;
  duplicated: number;
  error?: string;
  logs: string[];
}

export class OpportunityAutopilotPipeline {
  /**
   * Processes a single source end-to-end
   */
  public static async processSource(sourceId: string, runId?: string): Promise<PipelineRunResult> {
    const activeRunId = runId || `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const logs: string[] = [];
    const log = (msg: string) => {
      const entry = `[${new Date().toISOString()}] ${msg}`;
      logs.push(entry);
    };

    // Check emergency pause flag
    const pauseMetric = await prisma.systemMetric.findUnique({
      where: { key: "pipeline_paused" },
    });
    if (pauseMetric && pauseMetric.value === "true") {
      log("PIPELINE PAUSED: Ingestion skipped due to emergency pause control.");
      return {
        runId: activeRunId,
        sourceId,
        sourceName: "Unknown",
        success: false,
        isUnchanged: false,
        scanned: 0,
        created: 0,
        updated: 0,
        duplicated: 0,
        error: "Pipeline is paused by administrator.",
        logs,
      };
    }

    const source = await prisma.source.findUnique({
      where: { id: sourceId },
    });

    if (!source) {
      throw new Error(`Source with ID ${sourceId} does not exist`);
    }

    if (source.status === "PAUSED" || source.status === "BLOCKED") {
      log(`Source ${source.name} is ${source.status}. Skipping.`);
      return {
        runId: activeRunId,
        sourceId,
        sourceName: source.name,
        success: true,
        isUnchanged: false,
        scanned: 0,
        created: 0,
        updated: 0,
        duplicated: 0,
        logs,
      };
    }

    // Create Ingestion Job record
    const job = await prisma.ingestionJob.create({
      data: {
        runId: activeRunId,
        jobType: "check_source",
        sourceId: source.id,
        status: "RUNNING",
        startedAt: new Date(),
      },
    });

    const startTime = Date.now();
    let scannedCount = 0;
    let createdCount = 0;
    let updatedCount = 0;
    let duplicatedCount = 0;

    try {
      log(`Starting ingestion for source: "${source.name}" (${source.url})`);

      // 1. Smart Fetch with ETag, Last-Modified, and SHA-256 Content Hash
      const fetchResult = await SmartFetcher.fetch(source.url, {
        etag: source.etag,
        lastModified: source.lastModified,
        previousHash: source.contentHash,
      });

      if (fetchResult.isUnchanged) {
        log(`Content unchanged (ETag/Hash matched). Skipping expensive AI/extraction pipeline.`);
        const nextCheck = new Date(Date.now() + source.checkFrequency * 60 * 1000);

        await prisma.source.update({
          where: { id: source.id },
          data: {
            lastCheckedAt: new Date(),
            nextCheckAt: nextCheck,
            lastSuccessAt: new Date(),
            consecutiveFailures: 0,
          },
        });

        await prisma.ingestionJob.update({
          where: { id: job.id },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
            durationMs: Date.now() - startTime,
            executionLogs: logs.join("\n"),
          },
        });

        return {
          runId: activeRunId,
          sourceId: source.id,
          sourceName: source.name,
          success: true,
          isUnchanged: true,
          scanned: 0,
          created: 0,
          updated: 0,
          duplicated: 0,
          logs,
        };
      }

      // 2. Resolve Adapter
      const adapter = AdapterResolver.resolve(source.adapterType, source.url);
      log(`Using adapter: ${adapter.adapterType} (v${adapter.version})`);

      // 3. Parse Raw Items
      const rawItems = await adapter.parse(fetchResult, {
        id: source.id,
        name: source.name,
        url: source.url,
        adapterType: source.adapterType,
        adapterVersion: source.adapterVersion,
        parserVersion: source.parserVersion,
        configJson: source.configJson,
        headersJson: source.headersJson,
        etag: source.etag,
        lastModified: source.lastModified,
      });

      scannedCount = rawItems.length;
      log(`Adapter extracted ${scannedCount} raw opportunity item(s).`);

      // 4. Process Each Item
      for (const rawItem of rawItems) {
        try {
          // AI / Rule extraction
          const extracted = await OpportunityExtractor.extract(rawItem, source.name);

          // Deduplication Check
          const dedup = await OpportunityDeduplicator.checkDuplicate(extracted, source.id);

          if (dedup.decision === "EXACT_MATCH" && dedup.matchedOpportunityId) {
            duplicatedCount++;
            log(`Exact duplicate found for "${extracted.title}". Checking for updates...`);
            const updateResult = await OpportunityUpdater.updateExisting(
              dedup.matchedOpportunityId,
              extracted,
              source.name
            );
            if (updateResult.updated) {
              updatedCount++;
              log(`Updated existing opportunity (${updateResult.changedFields.join(", ")})`);
            }
            continue;
          }

          // Evaluate Confidence & Auto-Publishing Rules
          const confidence = OpportunityPublisher.evaluateConfidence(
            extracted,
            source.tier as SourceTier,
            source.trustStatus
          );

          const finalStatus = OpportunityPublisher.resolveStatus(confidence, dedup.decision);

          // Calculate Deadline Status
          const deadlineStatus = DeadlineEngine.calculateStatus(extracted.deadline);

          // Generate Unique Slug
          const baseSlug = extracted.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          const slug = `${baseSlug.slice(0, 80)}-${Math.random().toString(36).substring(2, 6)}`;

          // Create Opportunity Record
          const createdOpp = await prisma.opportunity.create({
            data: {
              title: extracted.title,
              slug,
              organization: extracted.organization,
              opportunityType: extracted.opportunityType,
              category: extracted.category || extracted.opportunityType,
              shortSummary: extracted.shortSummary,
              fullDescription: extracted.fullDescription,
              eligibility: extracted.eligibility,
              degreeRequirements: JSON.stringify(extracted.degreeRequirements || []),
              yearRequirements: JSON.stringify(extracted.yearRequirements || []),
              branchRequirements: JSON.stringify(extracted.branchRequirements || []),
              domain: extracted.domain,
              skills: JSON.stringify(extracted.skills || []),
              location: extracted.location,
              mode: extracted.mode,
              duration: extracted.duration,
              stipend: extracted.stipend,
              salary: extracted.salary,
              isPaid: extracted.isPaid,
              startDate: extracted.startDate,
              endDate: extracted.endDate,
              deadline: extracted.deadline,
              deadlineStatus: deadlineStatus.status,
              daysRemaining: deadlineStatus.daysRemaining,
              applicationProcess: extracted.applicationProcess,
              applicationUrl: extracted.applicationUrl,
              sourceUrl: extracted.sourceUrl,
              originalSourceUrl: extracted.originalSourceUrl || source.url,
              sourcePublishedDate: extracted.sourcePublishedDate,
              contactInformation: extracted.contactInformation,
              importantNotes: extracted.importantNotes,
              canonicalUrl: extracted.canonicalUrl || extracted.applicationUrl,
              externalId: extracted.externalId,
              contentHash: fetchResult.contentHash,
              confidenceScore: confidence.totalScore,
              confidenceBreakdown: JSON.stringify(confidence),
              status: finalStatus,
              isVerified: source.tier <= 2,
              sourceId: source.id,
              actorType: "SYSTEM",
            },
          });

          createdCount++;
          log(`Created opportunity: "${createdOpp.title}" [Status: ${finalStatus}, Confidence: ${confidence.totalScore}]`);

          // If Pending Review, add to ReviewQueueItem
          if (finalStatus === "PENDING_REVIEW") {
            await prisma.reviewQueueItem.create({
              data: {
                opportunityId: createdOpp.id,
                sourceId: source.id,
                rawPayload: JSON.stringify(rawItem),
                extractedData: JSON.stringify(extracted),
                reviewReason: dedup.decision === "LIKELY_DUPLICATE" ? "LIKELY_DUPLICATE" : "LOW_CONFIDENCE",
                duplicateOfId: dedup.matchedOpportunityId,
                status: "PENDING",
              },
            });
            log(`Added opportunity to Admin Review Queue.`);
          }

          // If Published, dispatch student notification events
          if (finalStatus === "PUBLISHED") {
            await this.dispatchUserAlerts(createdOpp);
          }

          // Link Discovery Service check
          if (extracted.applicationUrl) {
            await SourceDiscoveryService.evaluateAndRegisterUrl(
              extracted.applicationUrl,
              source.url,
              "opportunity_extractor"
            );
          }
        } catch (itemError: any) {
          log(`Error processing individual opportunity item: ${itemError.message}`);
        }
      }

      // 5. Update Source Health & Scheduling State
      const nextCheck = new Date(Date.now() + source.checkFrequency * 60 * 1000);

      await prisma.source.update({
        where: { id: source.id },
        data: {
          lastCheckedAt: new Date(),
          nextCheckAt: nextCheck,
          lastSuccessAt: new Date(),
          etag: fetchResult.etag,
          lastModified: fetchResult.lastModified,
          contentHash: fetchResult.contentHash,
          consecutiveFailures: 0,
          recordsFound: { increment: scannedCount },
          recordsCreated: { increment: createdCount },
          recordsUpdated: { increment: updatedCount },
        },
      });

      // 6. Complete Job
      await prisma.ingestionJob.update({
        where: { id: job.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          durationMs: Date.now() - startTime,
          itemsScanned: scannedCount,
          itemsCreated: createdCount,
          itemsUpdated: updatedCount,
          itemsDuplicated: duplicatedCount,
          executionLogs: logs.join("\n"),
        },
      });

      log(`Completed ingestion successfully. (Scanned: ${scannedCount}, Created: ${createdCount}, Updated: ${updatedCount})`);

      return {
        runId: activeRunId,
        sourceId: source.id,
        sourceName: source.name,
        success: true,
        isUnchanged: false,
        scanned: scannedCount,
        created: createdCount,
        updated: updatedCount,
        duplicated: duplicatedCount,
        logs,
      };
    } catch (err: any) {
      const errorMsg = err.message || String(err);
      log(`CRITICAL PIPELINE ERROR on source "${source.name}": ${errorMsg}`);

      const newConsecutive = source.consecutiveFailures + 1;
      const isDegraded = newConsecutive >= 3;

      await prisma.source.update({
        where: { id: source.id },
        data: {
          lastCheckedAt: new Date(),
          nextCheckAt: new Date(Date.now() + 30 * 60 * 1000), // Retry in 30 mins
          lastErrorAt: new Date(),
          lastErrorMessage: errorMsg,
          failureCount: { increment: 1 },
          consecutiveFailures: newConsecutive,
          status: isDegraded ? "DEGRADED" : source.status,
        },
      });

      // Raise system alert if degraded
      if (isDegraded) {
        await prisma.systemAlert.create({
          data: {
            severity: "CRITICAL",
            title: `Source Degraded: ${source.name}`,
            message: `Source "${source.name}" has failed ${newConsecutive} consecutive times. Last error: ${errorMsg}`,
            sourceId: source.id,
          },
        });
      }

      await prisma.ingestionJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          durationMs: Date.now() - startTime,
          errorMessage: errorMsg,
          executionLogs: logs.join("\n"),
        },
      });

      return {
        runId: activeRunId,
        sourceId: source.id,
        sourceName: source.name,
        success: false,
        isUnchanged: false,
        scanned: 0,
        created: 0,
        updated: 0,
        duplicated: 0,
        error: errorMsg,
        logs,
      };
    }
  }

  /**
   * Matches freshly published opportunity with student alert preferences and creates notification events
   */
  private static async dispatchUserAlerts(opportunity: any): Promise<void> {
    try {
      const preferences = await prisma.userAlertPreference.findMany({
        where: { inAppAlerts: true },
      });

      for (const pref of preferences) {
        let isMatch = false;

        if (pref.opportunityTypes) {
          const types = JSON.parse(pref.opportunityTypes);
          if (types.includes(opportunity.opportunityType)) isMatch = true;
        }

        if (pref.domains) {
          const domains = JSON.parse(pref.domains);
          if (domains.includes(opportunity.domain)) isMatch = true;
        }

        if (pref.keywords && !isMatch) {
          const kwList = pref.keywords.split(",").map((k: string) => k.trim().toLowerCase());
          const text = `${opportunity.title} ${opportunity.organization}`.toLowerCase();
          if (kwList.some((k: string) => text.includes(k))) isMatch = true;
        }

        if (isMatch) {
          await prisma.notification.create({
            data: {
              userId: pref.userId,
              opportunityId: opportunity.id,
              title: `New Matching Opportunity: ${opportunity.title}`,
              message: `${opportunity.organization} published a new ${opportunity.opportunityType} in ${opportunity.domain}.`,
              channel: "IN_APP",
            },
          });
        }
      }
    } catch {
      // Do not block pipeline on notification failures
    }
  }
}
