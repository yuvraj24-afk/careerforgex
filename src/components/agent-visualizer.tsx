"use client";

import { useState } from "react";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
  Mail,
  UserCheck,
} from "lucide-react";

interface AgentStep {
  id: number;
  label: string;
  type: string;
  tool: string;
  outputPreview: string;
}

const steps: AgentStep[] = [
  { id: 1, label: "Research Target Company", type: "Perception", tool: "Web Crawler / Clearbit API", outputPreview: "Domain crawled: Vanguard Logistics (350 employees, $42M ARR, SAP ERP)" },
  { id: 2, label: "Gather Decision Makers", type: "Intelligence", tool: "LinkedIn / Sales API", outputPreview: "Identified VP Operations & Head of Procurement" },
  { id: 3, label: "Analyze Problem Fit", type: "Reasoning", tool: "LLM Reasoning Engine", outputPreview: "Fit Score: 94/100 (Manual freight invoice transcription bottleneck detected)" },
  { id: 4, label: "Score Lead & Assign Tier", type: "Evaluation", tool: "Zod Schema Evaluator", outputPreview: "Classified as Tier-1 Enterprise target. Routing to AE queue" },
  { id: 5, label: "Generate Personalized Brief", type: "Synthesis", tool: "CareerForgeX Prompt Engine", outputPreview: "Drafted tailored 3-point operational efficiency roadmap" },
  { id: 6, label: "Sync Records to CRM", type: "Action", tool: "HubSpot REST API", outputPreview: "Created Deal #CFX-8910 in stage: 'Inbound Qualified'" },
  { id: 7, label: "Request Human Sign-Off", type: "Guardrail", tool: "Human Review Queue", outputPreview: "Slack alert posted to #enterprise-deals. Sign-off received from Lead Architect" },
  { id: 8, label: "Dispatch Verified Outreach", type: "Execution", tool: "SMTP / Resend API", outputPreview: "Personalized audit invitation dispatched with custom calendar link" },
];

export function AgentVisualizer() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showJson, setShowJson] = useState<boolean>(false);

  const runSimulation = () => {
    setIsRunning(true);
    setCurrentStep(1);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length) {
          clearInterval(stepInterval);
          setIsRunning(false);
          return steps.length;
        }
        return prev + 1;
      });
    }, 1100);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentStep(0);
  };

  return (
    <section className="py-20 lg:py-28 relative bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-mono mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>AGENTIC REASONING & EXECUTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            AI Agents That Don't Just Answer. They Act.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-400 leading-relaxed">
            A traditional chatbot simply returns a block of text. An AI agent understands a goal,
            reasons through sequential steps, queries tools, calls APIs, enforces guardrails, and asks for
            human approval before committing high-impact actions.
          </p>
        </div>

        {/* Visualizer Shell */}
        <div className="rounded-2xl bg-dark-card/90 border border-dark-border p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-border">
            <div>
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                Objective Injected:
              </span>
              <p className="text-sm font-semibold text-white mt-0.5">
                "Qualify enterprise inbound lead, enrich ERP tech stack, and prepare verified outreach."
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowJson(!showJson)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-elevated text-xs font-mono text-gray-300 hover:text-white border border-dark-border transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" />
                {showJson ? "Hide Telemetry" : "View Telemetry"}
              </button>

              {currentStep > 0 && !isRunning && (
                <button
                  onClick={resetSimulation}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-dark-elevated text-xs text-gray-300 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}

              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-xs sm:text-sm font-medium text-white shadow-md shadow-brand-600/30 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? "Executing Steps..." : "Run Agent Simulation"}</span>
              </button>
            </div>
          </div>

          {/* Stepper Grid */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step) => {
              const isDone = currentStep >= step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-xl border transition-all duration-300 relative ${
                    isCurrent
                      ? "bg-dark-elevated border-brand-500 shadow-lg shadow-brand-500/20 scale-[1.02]"
                      : isDone
                      ? "bg-dark-card border-emerald-500/40 text-gray-200"
                      : "bg-dark-card/40 border-dark-border/60 text-gray-500 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-bg border border-dark-border text-gray-400">
                      Step 0{step.id} • {step.type}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-gray-600" />
                    )}
                  </div>

                  <h4 className="text-xs font-semibold text-white mb-1">
                    {step.label}
                  </h4>

                  <div className="text-[11px] font-mono text-brand-400 mb-2 truncate">
                    ⚙️ {step.tool}
                  </div>

                  {isDone && (
                    <div className="p-2 rounded bg-dark-bg/80 border border-dark-border text-[11px] text-gray-300 leading-tight animate-in fade-in duration-200">
                      {step.outputPreview}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* State / JSON Telemetry Drawer */}
          {showJson && (
            <div className="mt-4 p-4 rounded-xl bg-dark-bg border border-dark-border font-mono text-xs text-gray-300 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-gray-500 text-[11px] pb-2 border-b border-dark-border">
                <span>AGENT_STATE_TELEMETRY</span>
                <span>SCHEMA_STRICT_V2</span>
              </div>
              <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">
                {JSON.stringify(
                  {
                    agentId: "agent_sales_evaluator_09",
                    currentStepIndex: currentStep,
                    totalSteps: steps.length,
                    status: isRunning ? "RUNNING" : currentStep === steps.length ? "COMPLETED" : "IDLE",
                    guardrailsActive: ["PII_Filter", "Human_Approval_Gate", "Rate_Limit"],
                    memorySlotsAllocated: 4,
                    model: "gpt-4o",
                    completedTrace: steps.slice(0, currentStep).map((s) => ({
                      step: s.id,
                      tool: s.tool,
                      status: "SUCCESS",
                    })),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
