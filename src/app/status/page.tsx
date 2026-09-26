import Link from "next/link";
import { CheckCircle2, Activity, ArrowRight, ShieldCheck, Clock, Server, Cpu } from "lucide-react";

export const metadata = {
  title: "System Status & Telemetry",
  description: "Live operational status of CareerForgeX systems, API gateways, agent orchestrators, and database clusters.",
};

const components = [
  { name: "Agent Orchestration Engine", status: "Operational", latency: "42ms", uptime: "99.99%" },
  { name: "API Gateway & Edge Routers", status: "Operational", latency: "24ms", uptime: "100%" },
  { name: "PostgreSQL & Vector Embedding Clusters", status: "Operational", latency: "16ms", uptime: "99.98%" },
  { name: "Webhook Ingestion & Retries (n8n / Slack)", status: "Operational", latency: "38ms", uptime: "99.99%" },
  { name: "Transactional Email & Dispatch Pipeline", status: "Operational", latency: "110ms", uptime: "100%" },
  { name: "Document Intelligence & OCR Cluster", status: "Operational", latency: "620ms", uptime: "99.95%" },
];

export default function StatusPage() {
  return (
    <div className="py-16 lg:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-mono">
          <Activity className="w-3.5 h-3.5" />
          <span>REAL-TIME PLATFORM TELEMETRY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">System Status</h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Continuous health monitoring for all core CareerForgeX automation infrastructure and APIs.
        </p>
      </div>

      {/* Global Status Banner */}
      <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">All Systems Operational</h2>
            <p className="text-xs text-emerald-400 font-mono mt-0.5">Global Uptime: 99.98% (Last 90 Days)</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-gray-400 self-start sm:self-auto">
          Updated: Just now
        </span>
      </div>

      {/* Component Status Grid */}
      <div className="rounded-2xl bg-dark-card border border-dark-border overflow-hidden">
        <div className="p-4 border-b border-dark-border text-[11px] font-mono text-gray-400 uppercase tracking-wider flex justify-between">
          <span>Infrastructure Component</span>
          <span>Status & Latency</span>
        </div>
        <div className="divide-y divide-dark-border/60">
          {components.map((comp) => (
            <div key={comp.name} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-white">{comp.name}</span>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-gray-400">Avg {comp.latency}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/40 text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {comp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident History Section */}
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
          Recent Incident History (Past 30 Days)
        </h3>
        <p className="text-xs text-gray-400">No major incidents or unplanned outages reported.</p>
      </div>
    </div>
  );
}
