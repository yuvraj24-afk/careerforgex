"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  Database,
  Mail,
  Calendar,
  UserCheck,
  BarChart3,
  Sparkles,
  Zap,
} from "lucide-react";

interface NodeData {
  id: string;
  label: string;
  role: string;
  icon: any;
  color: string;
  desc: string;
}

const nodes: NodeData[] = [
  { id: "lead", label: "Inbound Lead", role: "Trigger", icon: Users, color: "from-blue-500 to-indigo-500", desc: "Form, webhook, or portal inquiry received" },
  { id: "research", label: "AI Research Agent", role: "Enrichment", icon: Search, color: "from-indigo-500 to-purple-500", desc: "Crawls domain & tech stack profile" },
  { id: "qual", label: "Qualification", role: "Decision", icon: CheckCircle2, color: "from-purple-500 to-pink-500", desc: "Scores ICP fit & complexity tier" },
  { id: "crm", label: "CRM Sync", role: "Database", icon: Database, color: "from-pink-500 to-rose-500", desc: "Creates deal & contact in HubSpot/Salesforce" },
  { id: "email", label: "Personalized Outreach", role: "Action", icon: Mail, color: "from-amber-500 to-orange-500", desc: "Drafts context-aware message" },
  { id: "calendar", label: "Calendar Booking", role: "Scheduling", icon: Calendar, color: "from-emerald-500 to-teal-500", desc: "Reserves AE slot in prospect timezone" },
  { id: "approval", label: "Human Approval", role: "Guardrail", icon: UserCheck, color: "from-cyan-500 to-blue-500", desc: "Operator sign-off on enterprise accounts" },
  { id: "analytics", label: "Analytics & Logging", role: "Observability", icon: BarChart3, color: "from-emerald-400 to-green-600", desc: "Traced in real-time execution ledger" },
];

export function HeroNetwork() {
  const [activeNode, setActiveNode] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % nodes.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div
      className="relative w-full rounded-2xl bg-dark-card/90 border border-dark-border p-5 lg:p-8 backdrop-blur-xl shadow-2xl overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background glow orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header bar */}
      <div className="flex items-center justify-between pb-6 border-b border-dark-border/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-medium text-gray-300">
            LIVE AGENTIC NETWORK SIMULATION
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
          <span className="px-2 py-0.5 rounded bg-dark-elevated border border-dark-border">
            State: Active
          </span>
          <span className="px-2 py-0.5 rounded bg-brand-950/60 border border-brand-800/40 text-brand-400">
            Latency: 42ms
          </span>
        </div>
      </div>

      {/* Network Nodes Grid */}
      <div className="py-6 grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 relative">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const isActive = activeNode === index;
          const isPassed = activeNode > index;

          return (
            <button
              key={node.id}
              onClick={() => {
                setActiveNode(index);
                setIsAutoPlaying(false);
              }}
              className={`text-left p-3.5 rounded-xl border transition-all duration-300 relative group ${
                isActive
                  ? "bg-dark-elevated border-brand-500 shadow-lg shadow-brand-500/15 scale-[1.03]"
                  : isPassed
                  ? "bg-dark-card/60 border-emerald-500/30 text-gray-300"
                  : "bg-dark-card/40 border-dark-border/70 hover:border-gray-600 text-gray-400"
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute top-0 left-3 right-3 h-[2px] bg-gradient-to-r from-brand-500 to-accent-cyan rounded-full animate-pulse" />
              )}

              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-brand-600 text-white"
                      : isPassed
                      ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/40"
                      : "bg-dark-elevated text-gray-400 group-hover:text-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase text-gray-500">
                  {node.role}
                </span>
              </div>

              <div className="text-xs font-semibold text-white truncate">
                {node.label}
              </div>
              <div className="text-[11px] text-gray-400 truncate mt-0.5">
                {node.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active node detail panel */}
      <div className="mt-2 p-4 rounded-xl bg-dark-elevated/70 border border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-white font-medium flex items-center gap-2">
              <span>Step 0{activeNode + 1}: {nodes[activeNode].label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-bg border border-dark-border text-brand-300">
                {nodes[activeNode].role}
              </span>
            </div>
            <p className="text-gray-400 mt-0.5">{nodes[activeNode].desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveNode((prev) => (prev === 0 ? nodes.length - 1 : prev - 1))}
            className="px-2.5 py-1 rounded bg-dark-card hover:bg-dark-border text-gray-300 transition-colors font-mono"
          >
            Prev
          </button>
          <button
            onClick={() => setActiveNode((prev) => (prev + 1) % nodes.length)}
            className="px-3 py-1 rounded bg-brand-600 hover:bg-brand-500 text-white transition-colors font-mono"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
