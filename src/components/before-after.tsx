"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Clock,
  Zap,
  Shield,
  Layers,
  FileSpreadsheet,
  Mail,
  Database,
  MessageSquare,
  Calendar,
  Cpu,
} from "lucide-react";

export function BeforeAfter() {
  const [mode, setMode] = useState<"after" | "before">("after");

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>OPERATIONAL BOTTLENECK ANALYSIS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Your Team Shouldn't Be the API.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-400 leading-relaxed">
            When employees spend their days transcribing data between email, spreadsheets, and CRMs,
            your operations stall and errors multiply. We replace human middleware with intelligent orchestration.
          </p>

          {/* Toggle pill */}
          <div className="mt-8 inline-flex p-1 rounded-xl bg-dark-card border border-dark-border">
            <button
              onClick={() => setMode("before")}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                mode === "before"
                  ? "bg-rose-950/70 border border-rose-800/60 text-rose-300 shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Manual Legacy Process (Before)
            </button>
            <button
              onClick={() => setMode("after")}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                mode === "after"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Intelligent AI System (After)
            </button>
          </div>
        </div>

        {/* Dynamic Canvas Container */}
        <div className="relative rounded-2xl bg-dark-card/90 border border-dark-border p-6 lg:p-10 shadow-2xl backdrop-blur-xl">
          {mode === "before" ? (
            /* BEFORE STATE */
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-border">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">The Human Middleware Trap</h3>
                    <p className="text-xs text-rose-400/90 font-mono mt-0.5">High friction • 14.5 hours wasted/rep/week • 6-hour delay</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded bg-rose-950/50 border border-rose-800/40 text-rose-400 self-start sm:self-auto">
                  Average Latency: 4.8 Hours
                </span>
              </div>

              {/* Before Workflow Sequence */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                  { step: "01", name: "Inbound Email", tool: "Gmail / Outlook", pain: "Waits in inbox unread" },
                  { step: "02", name: "Manual Copy", tool: "Spreadsheet", pain: "Typing contact & notes" },
                  { step: "03", name: "CRM Re-entry", tool: "Salesforce / HubSpot", pain: "Missing fields, duplicates" },
                  { step: "04", name: "Slack Message", tool: "#general / DMs", pain: "Chasing team for updates" },
                  { step: "05", name: "Back-and-Forth", tool: "Calendar scheduling", pain: "3 emails to pick a time" },
                  { step: "06", name: "End-of-Week", tool: "Manual Report", pain: "Transcribing stale KPIs" },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="p-4 rounded-xl bg-dark-elevated/50 border border-rose-950/40 hover:border-rose-900/60 transition-colors"
                  >
                    <div className="text-[10px] font-mono text-rose-400 font-bold mb-1">{item.step}</div>
                    <div className="text-xs font-semibold text-white">{item.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{item.tool}</div>
                    <div className="text-[10px] text-rose-400/80 mt-2 pt-2 border-t border-dark-border/40 font-mono">
                      ⚠️ {item.pain}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pain Summary */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 text-xs text-rose-300 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>• <strong>Dropped Leads:</strong> 40% of weekend inquiries go cold before Monday morning follow-up.</div>
                <div>• <strong>Transcription Errors:</strong> Misspelled emails, wrong company sizes, and lost context.</div>
                <div>• <strong>High Turnover:</strong> Talented employees burn out doing low-value data entry.</div>
              </div>
            </div>
          ) : (
            /* AFTER STATE */
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-border">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Connected AI Systems Architecture</h3>
                    <p className="text-xs text-emerald-400/90 font-mono mt-0.5">Autonomous execution • Schema-verified • Zero data loss</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 self-start sm:self-auto">
                  Average Latency: 45 Seconds
                </span>
              </div>

              {/* After Workflow Sequence */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                  { step: "01", name: "Inbound Trigger", role: "Webhook Ingestion", feat: "Sub-second event receipt" },
                  { step: "02", name: "AI Reasoning", role: "LLM Orchestration", feat: "Domain crawl & fit scoring" },
                  { step: "03", name: "API / Tool Calls", role: "HubSpot & Slack", feat: "Enriched contact creation" },
                  { step: "04", name: "Approval Gate", role: "Human-in-the-Loop", feat: "1-click Slack sign-off" },
                  { step: "05", name: "Autonomous Action", role: "Custom Outreach", feat: "Tailored booking invite" },
                  { step: "06", name: "Telemetry & Logs", role: "pgvector / Database", feat: "Immutable audit trail" },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="p-4 rounded-xl bg-dark-elevated/70 border border-brand-500/30 hover:border-brand-500 transition-all shadow-sm"
                  >
                    <div className="text-[10px] font-mono text-brand-400 font-bold mb-1">{item.step}</div>
                    <div className="text-xs font-semibold text-white">{item.name}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{item.role}</div>
                    <div className="text-[10px] text-emerald-400 mt-2 pt-2 border-t border-dark-border/40 font-mono flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      <span>{item.feat}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* After Benefits */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-300 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>• <strong>Instant Response:</strong> Inbound leads enriched and contacted in under 60 seconds.</div>
                <div>• <strong>100% Data Integrity:</strong> Zod schema validation prevents invalid CRM fields.</div>
                <div>• <strong>Governed Autonomy:</strong> High-impact communications require operator approval.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
