import Link from "next/link";
import { Layers, Workflow, BarChart3, FileText, Settings, ArrowRight, ShieldCheck, Lock } from "lucide-react";

export const metadata = {
  title: "Client Portal — Systems & Telemetry",
  description: "Client dashboard for monitoring deployed workflows, project milestones, and token usage.",
};

export default function ClientPortalPage() {
  const modules = [
    { name: "Automation Projects", href: "/client/projects", icon: Layers, desc: "Track implementation sprints, milestones, and deployment status.", ready: true },
    { name: "Active Workflows", href: "/client/workflows", icon: Workflow, desc: "Monitor live agent triggers, latency metrics, and error rates.", ready: true },
    { name: "Token & Run Usage", href: "/client/usage", icon: BarChart3, desc: "Inspect monthly token consumption and execution counts.", ready: false },
    { name: "Document Vault", href: "/client/documents", icon: FileText, desc: "Uploaded SOPs, parsed contracts, and vector embeddings.", ready: false },
    { name: "Workspace Settings", href: "/client/settings", icon: Settings, desc: "Configure webhooks, Slack channels, and member RBAC.", ready: false },
  ];

  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-6">
        <div>
          <span className="text-[10px] font-mono text-brand-400 uppercase tracking-wider">ENTERPRISE CLIENT PORTAL</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">Acme Global Logistics</h1>
          <p className="text-xs text-gray-400 mt-0.5">Workspace ID: org_acme_8910 • Dedicated Node Cluster</p>
        </div>

        <Link
          href="/"
          className="text-xs text-gray-400 hover:text-white"
        >
          &larr; Back to Website
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.name}
              className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-500/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-dark-elevated border border-dark-border flex items-center justify-center text-brand-400 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{m.name}</h3>
                  {!m.ready && (
                    <span className="px-2 py-0.5 rounded bg-dark-elevated text-[10px] font-mono text-gray-500">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{m.desc}</p>
              </div>

              <div className="pt-4 border-t border-dark-border/60 text-xs">
                {m.ready ? (
                  <span className="text-brand-400 font-medium flex items-center gap-1">
                    <span>Manage Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-gray-500 font-mono text-[11px]">SaaS Module Extensible</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
