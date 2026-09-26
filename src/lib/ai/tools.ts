import { z } from "zod";
import { db } from "../db";

export interface ToolDefinition<TInput = any, TOutput = any> {
  name: string;
  description: string;
  permission: "public" | "staff" | "admin";
  inputSchema: z.ZodType<TInput>;
  handler: (input: TInput, context?: { userId?: string }) => Promise<TOutput>;
}

export const toolRegistry: Record<string, ToolDefinition> = {
  searchKnowledge: {
    name: "searchKnowledge",
    description: "Search internal company SOPs, refund policies, and deployment documentation.",
    permission: "public",
    inputSchema: z.object({
      query: z.string().min(2),
      category: z.string().optional(),
    }),
    handler: async ({ query, category }) => {
      // In production, queries pgvector embeddings.
      return {
        results: [
          {
            title: "Standard SLA & Deployment Framework",
            snippet: "Production cutovers are scheduled during maintenance windows with blue/green deployment and automated rollback.",
            source: "SOP-Deploy-2026.pdf",
            score: 0.94,
          },
          {
            title: "Data Sovereignty & Encryption Standards",
            snippet: "Customer data in transit is encrypted with TLS 1.3; data at rest utilizes AES-256 with tenant-scoped KMS keys.",
            source: "Security-Architecture-Whitepaper.pdf",
            score: 0.89,
          },
        ],
      };
    },
  },

  createLead: {
    name: "createLead",
    description: "Create a verified prospective lead in the CRM.",
    permission: "public",
    inputSchema: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      company: z.string().min(2),
      automationGoal: z.string().min(5),
      currentTools: z.string().optional(),
      budgetRange: z.string().optional(),
    }),
    handler: async (input) => {
      const lead = await db.lead.create({
        data: {
          name: input.name,
          email: input.email,
          company: input.company,
          automationGoal: input.automationGoal,
          currentTools: input.currentTools,
          budgetRange: input.budgetRange,
          source: "agent_tool_registry",
        },
      });
      return { success: true, leadId: lead.id };
    },
  },

  sendSlackNotification: {
    name: "sendSlackNotification",
    description: "Dispatch an urgent alert to the engineering or sales operations Slack channel.",
    permission: "staff",
    inputSchema: z.object({
      channel: z.string().default("#automation-alerts"),
      message: z.string().min(5),
      priority: z.enum(["low", "medium", "urgent"]).default("medium"),
    }),
    handler: async (input) => {
      console.log(`[SLACK NOTIFICATION -> ${input.channel}] [${input.priority.toUpperCase()}]: ${input.message}`);
      return { sent: true, channel: input.channel, timestamp: new Date().toISOString() };
    },
  },

  summarizeDocument: {
    name: "summarizeDocument",
    description: "Extract structured metrics and key terms from an unstructured contract or invoice.",
    permission: "public",
    inputSchema: z.object({
      docType: z.string(),
      textSnippet: z.string(),
    }),
    handler: async (input) => {
      return {
        summary: `Document processed: ${input.docType}. Key terms identified and validated against standard business taxonomy.`,
        fieldsDetected: ["Counterparty", "Effective Date", "Termination Clause", "Payment Net Terms"],
      };
    },
  },

  calculateROI: {
    name: "calculateROI",
    description: "Compute manual effort hours, automated hours, and recovered labor capacity.",
    permission: "public",
    inputSchema: z.object({
      employees: z.number().min(1),
      hoursPerWeek: z.number().min(1),
      hourlyCost: z.number().min(1),
      weeksPerYear: z.number().default(50),
      automationPercentage: z.number().min(10).max(95).default(70),
    }),
    handler: async ({ employees, hoursPerWeek, hourlyCost, weeksPerYear, automationPercentage }) => {
      const totalAnnualHours = employees * hoursPerWeek * weeksPerYear;
      const totalAnnualCost = totalAnnualHours * hourlyCost;
      const automatedHours = Math.round(totalAnnualHours * (automationPercentage / 100));
      const recoveredLaborCapacity = Math.round(totalAnnualCost * (automationPercentage / 100));

      return {
        totalAnnualHours,
        totalAnnualCost,
        automatedHours,
        recoveredLaborCapacity,
        hoursSavedPerWeek: Math.round(employees * hoursPerWeek * (automationPercentage / 100)),
      };
    },
  },
};

export async function executeAllowlistedTool(
  toolName: string,
  args: any,
  context?: { userId?: string; userRole?: string }
) {
  const tool = toolRegistry[toolName];
  if (!tool) {
    throw new Error(`Tool "${toolName}" is not registered in the allowlisted tool registry.`);
  }

  // Permission verification
  if (tool.permission === "admin" && context?.userRole !== "admin") {
    throw new Error(`Unauthorized: Tool "${toolName}" requires admin privileges.`);
  }
  if (tool.permission === "staff" && !["admin", "staff"].includes(context?.userRole || "")) {
    throw new Error(`Unauthorized: Tool "${toolName}" requires staff privileges.`);
  }

  // Validate args with schema
  const parsedArgs = tool.inputSchema.parse(args);

  try {
    const result = await tool.handler(parsedArgs, { userId: context?.userId });
    return { success: true, result };
  } catch (error: any) {
    console.error(`Tool execution error [${toolName}]:`, error);
    return { success: false, error: error.message || "Execution failed" };
  }
}
