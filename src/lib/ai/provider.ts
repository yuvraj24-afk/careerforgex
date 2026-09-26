import { z } from "zod";

export interface LeadScoreInput {
  name: string;
  company: string;
  email: string;
  website?: string;
  message: string;
  currentTools?: string;
}

export interface LeadScoreResult {
  leadSummary: string;
  intent: "High Intent" | "Evaluating Options" | "Information Gathering";
  industry: string;
  potentialPriority: "High" | "Medium" | "Low";
  automationComplexity: "Low (1-2 weeks)" | "Medium (3-5 weeks)" | "Enterprise (6+ weeks)";
  recommendedService: string;
  recommendedNextAction: string;
  suggestedOutreachEmail: string;
  score: number;
}

export interface SupportDemoInput {
  question: string;
  channel?: string;
  customerTier?: string;
}

export interface SupportDemoResult {
  answer: string;
  category: "Policy & Refunds" | "Order Status" | "Technical Integration" | "Billing Inquiry" | "General";
  confidenceScore: number;
  sources: string[];
  escalationRequired: boolean;
  escalationReason?: string;
  suggestedInternalNote?: string;
}

export interface DocumentDemoInput {
  fileName: string;
  fileSize: number;
  mimeType: string;
  textSnippet?: string;
}

export interface DocumentDemoResult {
  documentType: "Invoice" | "Purchase Order" | "Contract / NDA" | "Receipt" | "Identity Form";
  date: string;
  company: string;
  amount?: string;
  referenceNumber: string;
  extractedFields: Record<string, string | number>;
  summary: string;
  confidenceScore: number;
}

export interface EmailDemoInput {
  emailContent: string;
  sender?: string;
}

export interface EmailDemoResult {
  classification: "Sales" | "Support" | "Finance" | "HR" | "Spam" | "Other";
  sentiment: "Positive" | "Neutral" | "Frustrated" | "Urgent";
  urgency: "Immediate" | "Within 24 Hours" | "Low Priority";
  keyEntities: string[];
  suggestedAction: string;
  draftedResponse: string;
}

export interface AIProvider {
  name: string;
  isMock: boolean;
  scoreLead(input: LeadScoreInput): Promise<LeadScoreResult>;
  resolveSupport(input: SupportDemoInput): Promise<SupportDemoResult>;
  extractDocument(input: DocumentDemoInput): Promise<DocumentDemoResult>;
  classifyEmail(input: EmailDemoInput): Promise<EmailDemoResult>;
  chatCopilot(query: string, context?: Record<string, any>): Promise<string>;
}
