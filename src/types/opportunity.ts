export type OpportunityType =
  | "Internship"
  | "Research"
  | "Job"
  | "PhD"
  | "Scholarship"
  | "Fellowship"
  | "Competition"
  | "Conference"
  | "Workshop"
  | "Higher Education"
  | "Research Project"
  | "Other";

export type OpportunityMode = "Remote" | "On-site" | "Hybrid";

export type DeadlineStatus =
  | "OPEN"
  | "CLOSING_SOON"
  | "EXPIRED"
  | "CLOSED"
  | "NO_DEADLINE"
  | "UNKNOWN";

export type OpportunityStatus =
  | "PUBLISHED"
  | "PENDING_REVIEW"
  | "ARCHIVED"
  | "REJECTED"
  | "SOURCE_NOT_FOUND";

export type SourceTier = 1 | 2 | 3 | 4;

export type AdapterType =
  | "rss"
  | "atom"
  | "json"
  | "api"
  | "sitemap"
  | "html"
  | "pdf"
  | "playwright";

export interface RawOpportunityPayload {
  title: string;
  sourceUrl: string;
  applicationUrl?: string;
  organization?: string;
  contentSnippet?: string;
  fullContent?: string;
  publishedDate?: string;
  deadlineString?: string;
  guid?: string;
  extraMeta?: Record<string, any>;
}

export interface ExtractedOpportunityData {
  title: string;
  organization: string;
  opportunityType: OpportunityType;
  category?: string;
  shortSummary: string;
  fullDescription: string;
  eligibility?: string | null;
  degreeRequirements?: string[];
  yearRequirements?: string[];
  branchRequirements?: string[];
  domain: string;
  skills?: string[];
  location?: string | null;
  mode: OpportunityMode;
  duration?: string | null;
  stipend?: string | null;
  salary?: string | null;
  isPaid: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  deadline?: Date | null;
  applicationProcess?: string | null;
  applicationUrl: string;
  sourceUrl: string;
  originalSourceUrl?: string | null;
  sourcePublishedDate?: Date | null;
  contactInformation?: string | null;
  importantNotes?: string | null;
  canonicalUrl?: string | null;
  externalId?: string | null;
}

export interface DeduplicationResult {
  decision: "EXACT_MATCH" | "LIKELY_DUPLICATE" | "NEW";
  similarityScore: number;
  matchedOpportunityId?: string;
  matchedOpportunityTitle?: string;
  reason: string;
}

export interface ConfidenceBreakdown {
  sourceTierScore: number;
  applicationUrlScore: number;
  organizationScore: number;
  deadlineScore: number;
  eligibilityScore: number;
  schemaScore: number;
  totalScore: number;
  recommendedAction: "AUTO_PUBLISH" | "PENDING_REVIEW" | "REJECT";
}

export interface FetchResult {
  url: string;
  status: number;
  statusText: string;
  etag?: string | null;
  lastModified?: string | null;
  contentHash: string;
  body: string;
  contentType?: string | null;
  isUnchanged?: boolean;
}
