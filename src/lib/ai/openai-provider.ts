import {
  AIProvider,
  LeadScoreInput,
  LeadScoreResult,
  SupportDemoInput,
  SupportDemoResult,
  DocumentDemoInput,
  DocumentDemoResult,
  EmailDemoInput,
  EmailDemoResult,
} from "./provider";
import { MockDeterministicProvider } from "./mock-provider";

export class OpenAIProvider implements AIProvider {
  name = "OpenAI GPT-4o Enterprise";
  isMock = false;
  private apiKey: string;
  private fallback: MockDeterministicProvider;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.fallback = new MockDeterministicProvider();
  }

  async scoreLead(input: LeadScoreInput): Promise<LeadScoreResult> {
    if (!this.apiKey) return this.fallback.scoreLead(input);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are an enterprise AI Automation Systems Architect at CareerForgeX. Analyze the lead and return a JSON object with:
              leadSummary (string), intent ("High Intent" | "Evaluating Options" | "Information Gathering"), industry (string),
              potentialPriority ("High" | "Medium" | "Low"), automationComplexity ("Low (1-2 weeks)" | "Medium (3-5 weeks)" | "Enterprise (6+ weeks)"),
              recommendedService (string), recommendedNextAction (string), suggestedOutreachEmail (string), score (integer 0-100).`,
            },
            {
              role: "user",
              content: JSON.stringify(input),
            },
          ],
        }),
      });

      if (!response.ok) throw new Error(`OpenAI HTTP ${response.status}`);
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.warn("OpenAI API call failed, using deterministic fallback:", e);
      return this.fallback.scoreLead(input);
    }
  }

  async resolveSupport(input: SupportDemoInput): Promise<SupportDemoResult> {
    if (!this.apiKey) return this.fallback.resolveSupport(input);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are a CareerForgeX customer support autonomous agent. Resolve the user's inquiry based on company policies. Return JSON: answer (string), category ("Policy & Refunds" | "Order Status" | "Technical Integration" | "Billing Inquiry" | "General"), confidenceScore (number 0-100), sources (array of strings), escalationRequired (boolean), escalationReason (optional string), suggestedInternalNote (optional string).`,
            },
            {
              role: "user",
              content: JSON.stringify(input),
            },
          ],
        }),
      });
      if (!response.ok) throw new Error(`OpenAI HTTP ${response.status}`);
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.warn("OpenAI API call failed, using deterministic fallback:", e);
      return this.fallback.resolveSupport(input);
    }
  }

  async extractDocument(input: DocumentDemoInput): Promise<DocumentDemoResult> {
    return this.fallback.extractDocument(input);
  }

  async classifyEmail(input: EmailDemoInput): Promise<EmailDemoResult> {
    if (!this.apiKey) return this.fallback.classifyEmail(input);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `Classify the following incoming email. Return JSON: classification ("Sales" | "Support" | "Finance" | "HR" | "Spam" | "Other"), sentiment ("Positive" | "Neutral" | "Frustrated" | "Urgent"), urgency ("Immediate" | "Within 24 Hours" | "Low Priority"), keyEntities (array of strings), suggestedAction (string), draftedResponse (string).`,
            },
            {
              role: "user",
              content: input.emailContent,
            },
          ],
        }),
      });
      if (!response.ok) throw new Error(`OpenAI HTTP ${response.status}`);
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.warn("OpenAI email classification failed, using fallback:", e);
      return this.fallback.classifyEmail(input);
    }
  }

  async chatCopilot(query: string, context?: Record<string, any>): Promise<string> {
    if (!this.apiKey) return this.fallback.chatCopilot(query, context);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are the CareerForgeX Internal Copilot. Context: ${JSON.stringify(context || {})}. Respond clearly and authoritatively with markdown formatting.`,
            },
            { role: "user", content: query },
          ],
        }),
      });
      if (!response.ok) throw new Error(`OpenAI HTTP ${response.status}`);
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (e) {
      return this.fallback.chatCopilot(query, context);
    }
  }
}
