import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { agentOrchestrator } from "@/lib/ai/agent-orchestrator";

const schema = z.object({
  workflowName: z.string().default("Inbound Lead Automation Agent"),
  goal: z.string().min(5),
  inputPayload: z.record(z.any()).default({}),
  requireHumanApproval: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = schema.parse(body);

    const result = await agentOrchestrator.runWorkflow({
      workflowName: validated.workflowName,
      goal: validated.goal,
      inputPayload: validated.inputPayload,
      requireHumanApproval: validated.requireHumanApproval,
    });

    return NextResponse.json({
      success: true,
      executionId: result.executionId,
      status: result.status,
      steps: result.steps,
      durationMs: result.durationMs,
    });
  } catch (err: any) {
    console.error("Agent workflow execution error:", err);
    return NextResponse.json({ error: "Failed to execute agent workflow" }, { status: 500 });
  }
}
