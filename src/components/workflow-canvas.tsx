"use client";

import { useState } from "react";
import {
  Play,
  RotateCcw,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowDown,
  Sparkles,
  GitFork,
  FileText,
  Mail,
  Database,
  MessageSquare,
  UserCheck,
  Calendar,
  Layers,
  HelpCircle,
} from "lucide-react";

interface WorkflowNode {
  id: string;
  name: string;
  type: "trigger" | "agent" | "condition" | "crm" | "email" | "slack" | "calendar" | "approval";
  tool: string;
  icon: any;
  status: "idle" | "running" | "done";
  details: string;
}

const initialWorkflow: WorkflowNode[] = [
  { id: "1", name: "Form Submitted", type: "trigger", tool: "Web Form Webhook", icon: FileText, status: "idle", details: "Payload received with company size & tech stack" },
  { id: "2", name: "AI Qualification", type: "agent", tool: "LLM Reasoning Node", icon: Sparkles, status: "idle", details: "Evaluates ICP rubric & extracts company profile" },
  { id: "3", name: "Score > 70 Check", type: "condition", tool: "Conditional Branch", icon: GitFork, status: "idle", details: "Routes high-tier leads to fast-track sales pipeline" },
  { id: "4", name: "CRM Create Contact", type: "crm", tool: "HubSpot API", icon: Database, status: "idle", details: "Creates verified deal in 'Qualified Opportunity' stage" },
  { id: "5", name: "Generate Email", type: "email", tool: "Prompt Synthesis Engine", icon: Mail, status: "idle", details: "Drafts tailored 3-point operational efficiency plan" },
  { id: "6", name: "Human Review", type: "approval", tool: "Operator Gate", icon: UserCheck, status: "idle", details: "Lead Architect reviews proposal copy in web app" },
  { id: "7", name: "Slack Alert", type: "slack", tool: "Slack Webhooks", icon: MessageSquare, status: "idle", details: "Dispatches instant alert to #sales-pipeline" },
  { id: "8", name: "Booking Link", type: "calendar", tool: "Calendar Dispatch", icon: Calendar, status: "idle", details: "Dispatches custom meeting link in prospect timezone" },
];

export function WorkflowCanvas() {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialWorkflow);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeLogIndex, setActiveLogIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<string[]>([]);

  const handleRunDemo = () => {
    setIsRunning(true);
    setLogs(["[DEMO MODE] Initializing workflow execution pipeline..."]);
    setActiveLogIndex(0);

    // Reset node statuses
    setNodes((prev) => prev.map((n) => ({ ...n, status: "idle" })));

    initialWorkflow.forEach((node, idx) => {
      setTimeout(() => {
        setNodes((current) =>
          current.map((n, i) =>
            i === idx ? { ...n, status: "running" } : i < idx ? { ...n, status: "done" } : n
          )
        );

        setTimeout(() => {
          setNodes((current) =>
            current.map((n, i) => (i === idx ? { ...n, status: "done" } : n))
          );
          setLogs((prevLogs) => [
            ...prevLogs,
            `✓ [${node.tool}] ${node.name}: Completed successfully (${Math.floor(Math.random() * 80 + 30)}ms)`,
          ]);

          if (idx === initialWorkflow.length - 1) {
            setIsRunning(false);
            setLogs((prevLogs) => [
              ...prevLogs,
              `🎉 Pipeline execution finished. All 8 nodes verified and completed in 840ms.`,
            ]);
          }
        }, 350);
      }, idx * 600);
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setNodes(initialWorkflow);
    setLogs([]);
    setActiveLogIndex(-1);
  };

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>VISUAL WORKFLOW ENGINE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Event-Driven Workflows That Connect Every Tool.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-400">
              Build resilient multi-step pipelines. Combine webhooks, AI decision nodes, API calls,
              and human approval gates into unified business backbones.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-lg bg-dark-card border border-dark-border text-xs text-gray-300 hover:text-white transition-colors"
            >
              Reset Canvas
            </button>
            <button
              onClick={handleRunDemo}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-xs sm:text-sm font-medium text-white shadow-lg shadow-brand-600/30 transition-all hover:shadow-brand-500/50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? "Simulating Pipeline..." : "Run Pipeline Demo"}</span>
            </button>
          </div>
        </div>

        {/* Interactive Canvas Board */}
        <div className="rounded-2xl bg-dark-card/90 border border-dark-border p-6 lg:p-8 backdrop-blur-xl shadow-2xl">
          {/* Canvas Sub-header */}
          <div className="flex items-center justify-between pb-6 border-b border-dark-border text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Template:</span>
              <span className="font-mono text-gray-300">Inbound Lead Qualification & Multi-Tool Dispatch</span>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/40 text-amber-300 font-mono text-[10px]">
              DEMO MODE (Simulated Execution)
            </span>
          </div>

          {/* Horizontal scroll container on desktop/tablet, vertical stack on mobile */}
          <div className="py-8 overflow-x-auto no-scrollbar">
            <div className="flex flex-col lg:flex-row items-center gap-3 min-w-full lg:min-w-[1100px] justify-between">
              {nodes.map((node, index) => {
                const Icon = node.icon;
                const isRunningNode = node.status === "running";
                const isDone = node.status === "done";

                return (
                  <div key={node.id} className="flex flex-col lg:flex-row items-center gap-3 w-full lg:w-auto">
                    {/* Node Card */}
                    <div
                      className={`w-full lg:w-36 p-3.5 rounded-xl border transition-all duration-300 relative flex flex-col justify-between ${
                        isRunningNode
                          ? "bg-dark-elevated border-brand-500 shadow-lg shadow-brand-500/25 scale-105"
                          : isDone
                          ? "bg-dark-card border-emerald-500/40 text-gray-200"
                          : "bg-dark-card/60 border-dark-border/80 text-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isRunningNode
                              ? "bg-brand-600 text-white animate-pulse"
                              : isDone
                              ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/40"
                              : "bg-dark-elevated text-gray-400"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        {isDone ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isRunningNode ? (
                          <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                        ) : (
                          <span className="text-[10px] font-mono text-gray-600">0{index + 1}</span>
                        )}
                      </div>

                      <div className="text-xs font-semibold text-white truncate">{node.name}</div>
                      <div className="text-[10px] font-mono text-brand-400 truncate mt-0.5">{node.tool}</div>
                    </div>

                    {/* Arrow Connector (Down on mobile, Right on desktop) */}
                    {index < nodes.length - 1 && (
                      <div className="text-gray-600 flex items-center justify-center my-1 lg:my-0">
                        <ArrowDown className="w-4 h-4 lg:hidden" />
                        <ArrowRight className="w-4 h-4 hidden lg:block" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Execution Console */}
          <div className="mt-4 rounded-xl bg-dark-bg border border-dark-border p-4 font-mono text-xs text-gray-300">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-dark-border/80 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                EXECUTION_TRACE_LOG
              </span>
              <span>{isRunning ? "PROCESSING_EVENT_GRAPH..." : logs.length > 0 ? "IDLE_COMPLETE" : "STANDBY"}</span>
            </div>

            <div className="space-y-1.5 min-h-[80px] max-h-40 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500 italic">Click "Run Pipeline Demo" to simulate real-time execution trace.</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed text-[11px] text-gray-300 flex items-start gap-2">
                    <span className="text-gray-600 select-none">[{idx + 1}]</span>
                    <span className={log.includes("🎉") ? "text-emerald-400 font-semibold" : log.includes("✓") ? "text-emerald-300" : "text-gray-400"}>
                      {log}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
