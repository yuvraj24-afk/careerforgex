import { ConfidenceBreakdown, ExtractedOpportunityData, OpportunityStatus, SourceTier } from "@/types/opportunity";

export class OpportunityPublisher {
  /**
   * Computes a multi-signal confidence score (0 - 100) and decides publishing route.
   */
  public static evaluateConfidence(
    data: ExtractedOpportunityData,
    sourceTier: SourceTier = 1,
    sourceTrustStatus = "TRUSTED"
  ): ConfidenceBreakdown {
    let sourceTierScore = 0;
    if (sourceTier === 1) sourceTierScore = 30; // Official IIT, IISc, Govt, Company portal
    else if (sourceTier === 2) sourceTierScore = 20; // Recognized academic institution
    else if (sourceTier === 3) sourceTierScore = 10; // Secondary aggregator
    else sourceTierScore = 5;

    let applicationUrlScore = 0;
    if (data.applicationUrl && (data.applicationUrl.startsWith("http://") || data.applicationUrl.startsWith("https://"))) {
      applicationUrlScore = 20;
    }

    let organizationScore = 0;
    if (data.organization && data.organization.length >= 3 && data.organization !== "Unknown") {
      organizationScore = 15;
    }

    let deadlineScore = 0;
    if (data.deadline && !isNaN(data.deadline.getTime())) {
      deadlineScore = 15;
    } else {
      deadlineScore = 5; // Rolling / open opportunities still hold partial value
    }

    let eligibilityScore = 0;
    if (data.eligibility && data.eligibility.length > 10) {
      eligibilityScore = 10;
    } else if (data.degreeRequirements && data.degreeRequirements.length > 0) {
      eligibilityScore = 5;
    }

    let schemaScore = 0;
    if (data.title && data.fullDescription && data.domain && data.opportunityType) {
      schemaScore = 10;
    }

    const totalScore = Math.min(
      100,
      sourceTierScore + applicationUrlScore + organizationScore + deadlineScore + eligibilityScore + schemaScore
    );

    let recommendedAction: "AUTO_PUBLISH" | "PENDING_REVIEW" | "REJECT" = "PENDING_REVIEW";

    // Autonomous Auto-Publish Rule:
    // Requires totalScore >= 80, source trust = TRUSTED, and valid application URL
    if (totalScore >= 80 && sourceTrustStatus === "TRUSTED" && applicationUrlScore === 20) {
      recommendedAction = "AUTO_PUBLISH";
    } else if (totalScore < 50 || sourceTrustStatus === "BLOCKED") {
      recommendedAction = "REJECT";
    } else {
      recommendedAction = "PENDING_REVIEW";
    }

    return {
      sourceTierScore,
      applicationUrlScore,
      organizationScore,
      deadlineScore,
      eligibilityScore,
      schemaScore,
      totalScore,
      recommendedAction,
    };
  }

  /**
   * Resolves the OpportunityStatus string based on confidence assessment and deduplication decision
   */
  public static resolveStatus(
    confidence: ConfidenceBreakdown,
    dedupDecision: "EXACT_MATCH" | "LIKELY_DUPLICATE" | "NEW"
  ): OpportunityStatus {
    if (dedupDecision === "LIKELY_DUPLICATE") {
      return "PENDING_REVIEW";
    }

    if (confidence.recommendedAction === "AUTO_PUBLISH") {
      return "PUBLISHED";
    }

    if (confidence.recommendedAction === "REJECT") {
      return "REJECTED";
    }

    return "PENDING_REVIEW";
  }
}
