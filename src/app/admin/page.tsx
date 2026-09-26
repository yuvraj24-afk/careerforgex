import Link from "next/link";
import { db } from "@/lib/db";
import {
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const totalLeads = await db.lead.count();
  const qualifiedLeads = await db.lead.count({ where: { status: { in: ["Qualified", "Discovery", "Proposal", "Won"] } } });
  const pendingBookings = await db.booking.count({ where: { status: "Confirmed" } });
  const activeProjects = await db.automationProject.count({ where: { status: { not: "Completed" } } });
  const totalDemos = await db.demoRun.count();
  const waitingApprovals = await db.automationExecution.count({ where: { status: "waiting_approval" } });

  const recentLeads = await db.lead.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { bookings: true },
  });

  const recentExecutions = await db.automationExecution.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Operations & Systems Dashboard</h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time pipeline metrics, automated executions, and inbound requirements.
          </p>
        </div>

        {waitingApprovals > 0 && (
          <Link
            href="/admin/executions"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-950/70 border border-rose-800/60 text-rose-300 text-xs font-semibold animate-pulse"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{waitingApprovals} Actions Awaiting Operator Approval</span>
          </Link>
        )}
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Total Leads</span>
            <Users className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{totalLeads}</div>
          <span className="text-[10px] font-mono text-emerald-400 mt-1 block">Inbound Ingested</span>
        </div>

        <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Qualified Pipeline</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{qualifiedLeads}</div>
          <span className="text-[10px] font-mono text-gray-400 mt-1 block">ICP Score &gt; 70</span>
        </div>

        <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Bookings</span>
            <Calendar className="w-4 h-4 text-accent-cyan" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{pendingBookings}</div>
          <span className="text-[10px] font-mono text-accent-cyan mt-1 block">Discovery Calls</span>
        </div>

        <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Active Builds</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{activeProjects}</div>
          <span className="text-[10px] font-mono text-amber-300 mt-1 block">In Sprint Phase</span>
        </div>

        <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Demo Usage</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{totalDemos}</div>
          <span className="text-[10px] font-mono text-purple-300 mt-1 block">Playground Runs</span>
        </div>

        <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Approval Queue</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className={`text-2xl font-bold mt-2 ${waitingApprovals > 0 ? "text-rose-400" : "text-gray-400"}`}>
            {waitingApprovals}
          </div>
          <span className="text-[10px] font-mono text-gray-400 mt-1 block">Human Gate</span>
        </div>
      </div>

      {/* Main Grid: Recent Leads & Recent Executions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Inbound Leads CRM Preview */}
        <div className="lg:col-span-8 rounded-2xl bg-dark-card border border-dark-border p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dark-border">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" />
              <span>Recent Inbound Leads</span>
            </h2>
            <Link href="/admin/leads" className="text-xs text-brand-400 hover:text-brand-300 font-medium">
              View CRM Table &rarr;
            </Link>
          </div>

          <div className="divide-y divide-dark-border/60">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{lead.name}</span>
                    <span className="text-gray-400">• {lead.company}</span>
                    {lead.isDemo && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-dark-elevated text-gray-500">
                        Demo
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mt-1 line-clamp-1">{lead.automationGoal}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] ${
                    lead.status === "Qualified" ? "bg-emerald-950/70 border border-emerald-800/40 text-emerald-400" :
                    lead.status === "Discovery" ? "bg-brand-950/70 border border-brand-800/40 text-brand-300" :
                    "bg-dark-elevated border border-dark-border text-gray-300"
                  }`}>
                    {lead.status}
                  </span>
                  <Link
                    href={`/admin/leads?id=${lead.id}`}
                    className="px-2.5 py-1 rounded bg-dark-elevated hover:bg-dark-border text-gray-300 hover:text-white"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Executions & Human Approval */}
        <div className="lg:col-span-4 rounded-2xl bg-dark-card border border-dark-border p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dark-border">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Live Agent Executions</span>
            </h2>
            <Link href="/admin/executions" className="text-xs text-brand-400 hover:text-brand-300 font-medium">
              Queue &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {recentExecutions.map((exec) => (
              <div key={exec.id} className="p-3.5 rounded-xl bg-dark-elevated border border-dark-border space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white truncate max-w-[180px]">{exec.workflowName}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    exec.status === "waiting_approval" ? "bg-rose-950/70 text-rose-300 border border-rose-800/40" :
                    "bg-emerald-950/70 text-emerald-400 border border-emerald-800/40"
                  }`}>
                    {exec.status}
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 font-mono">
                  Duration: {exec.durationMs}ms • Model: {exec.modelUsed}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
