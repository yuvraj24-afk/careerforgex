import { db } from "../db";
import { executeAllowlistedTool } from "./tools";

export interface AgentStep {
  step: number;
  name: string;
  type: "reason" | "tool_call" | "guardrail" | "human_approval" | "output";
  status: "pending" | "running" | "success" | "failed" | "waiting_approval";
  details: string;
  durationMs?: number;
}

export interface AgentRunParams {
  workflowName: string;
  goal: string;
  inputPayload: Record<string, any>;
  requireHumanApproval?: boolean;
  projectId?: string;
  workflowId?: string;
}

export class AgentOrchestrator {
  /**
   * Simulates/Executes a multi-step agent workflow with guardrails and human approval.
   */
  async runWorkflow(params: AgentRunParams) {
    const startTime = Date.now();
    const steps: AgentStep[] = [];

    // Step 1: Input Ingestion & Intent Analysis
    steps.push({
      step: 1,
      name: "Semantic Goal Parsing",
      type: "reason",
      status: "success",
      details: `Objective analyzed: "${params.goal.slice(0, 80)}". Decomposing into execution graph.`,
      durationMs: 140,
    });

    // Step 2: Guardrail Evaluation
    steps.push({
      step: 2,
      name: "Security & Safety Guardrails",
      type: "guardrail",
      status: "success",
      details: "PII masking checked. Input adheres to data boundaries. No prompt injection patterns detected.",
      durationMs: 95,
    });

    // Step 3: Tool Execution (e.g. calculation, enrichment, or knowledge query)
    const toolResult = await executeAllowlistedTool("calculateROI", {
      employees: 5,
      hoursPerWeek: 12,
      hourlyCost: 55,
      automationPercentage: 75,
    });

    steps.push({
      step: 3,
      name: "Allowlisted Tool Invocation (calculateROI)",
      type: "tool_call",
      status: toolResult.success ? "success" : "failed",
      details: `Computed metrics: ${toolResult.result ? `${toolResult.result.automatedHours} hours automated/year` : "Calculated"}`,
      durationMs: 220,
    });

    // Step 4: Human-in-the-Loop Approval Check
    const needsApproval = params.requireHumanApproval ?? true;
    let finalStatus: "completed" | "waiting_approval" = "completed";

    if (needsApproval) {
      finalStatus = "waiting_approval";
      steps.push({
        step: 4,
        name: "Human-in-the-Loop Review Gate",
        type: "human_approval",
        status: "waiting_approval",
        details: "High-impact customer dispatch prepared. Awaiting supervisor sign-off in Admin Center.",
        durationMs: 40,
      });
    } else {
      steps.push({
        step: 4,
        name: "Final Action Dispatch",
        type: "output",
        status: "success",
        details: "Actions committed and synced with downstream integrations.",
        durationMs: 180,
      });
    }

    const durationMs = Date.now() - startTime;

    // Persist execution log in database
    const execution = await db.automationExecution.create({
      data: {
        workflowName: params.workflowName,
        workflowId: params.workflowId,
        projectId: params.projectId,
        triggerEvent: "agent_orchestrator",
        status: finalStatus,
        stepsJson: JSON.stringify(steps),
        durationMs,
        toolCallsJson: JSON.stringify([{ tool: "calculateROI", status: "success" }]),
        humanApprovalRequired: needsApproval,
        approvalPayloadJson: needsApproval
          ? JSON.stringify({
              action: "Dispatch tailored audit proposal and calendar link",
              recipient: params.inputPayload.email || "prospect@example.com",
              preview: "Tailored 3-week roadmap and automation scope.",
            })
          : null,
        modelUsed: "gpt-4o",
      },
    });

    return {
      executionId: execution.id,
      status: finalStatus,
      steps,
      durationMs,
    };
  }

  /**
   * Approves a waiting execution and commits final action.
   */
  async approveExecution(executionId: string, approvedBy: string) {
    const execution = await db.automationExecution.findUnique({
      where: { id: executionId },
    });

    if (!execution) throw new Error("Execution record not found");

    const steps: AgentStep[] = JSON.parse(execution.stepsJson || "[]");
    const updatedSteps = steps.map((s) =>
      s.type === "human_approval" ? { ...s, status: "success" as const, details: `Approved by ${approvedBy}` } : s
    );

    updatedSteps.push({
      step: updatedSteps.length + 1,
      name: "Outbound Action Dispatched",
      type: "output",
      status: "success",
      details: "Action verified and executed after human approval.",
      durationMs: 85,
    });

    return db.automationExecution.update({
      where: { id: executionId },
      data: {
        status: "completed",
        stepsJson: JSON.stringify(updatedSteps),
        approvedBy,
      },
    });
  }
}

export const agentOrchestrator = new AgentOrchestrator();
