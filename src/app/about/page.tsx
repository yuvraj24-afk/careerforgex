import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Cpu, ShieldCheck, Zap, ArrowRight, CheckCircle2, Workflow, Lock, Terminal } from "lucide-react";

export const metadata = {
  title: "About Us & Engineering Philosophy",
  description: "Learn why CareerForgeX was founded to eliminate human middleware and deploy resilient AI business systems.",
};

export default function AboutPage() {
  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>ABOUT CAREERFORGEX</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          We Believe AI Belongs Inside Real Business Workflows.
        </h1>
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
          {siteConfig.brand.mission}
        </p>
      </div>

      {/* The Story: Problem, Belief, Approach */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <div className="w-10 h-10 rounded-xl bg-rose-950/50 border border-rose-800/40 flex items-center justify-center text-rose-400">
            <span className="font-mono text-sm font-bold">01</span>
          </div>
          <h3 className="text-xl font-bold text-white">The Core Problem</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Over the last decade, businesses accumulated dozens of SaaS tools. Instead of becoming more
            productive, knowledge workers became human middleware—spending hours copying data from emails
            into spreadsheets, updating CRMs, chasing internal approvals, and manually transcribing PDFs.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <div className="w-10 h-10 rounded-xl bg-brand-950/60 border border-brand-800/40 flex items-center justify-center text-brand-400">
            <span className="font-mono text-sm font-bold">02</span>
          </div>
          <h3 className="text-xl font-bold text-white">Our Core Belief</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            AI should not simply be a chat box in a separate browser tab. AI creates lasting enterprise
            value when it operates inside daily business operations—grounded by company knowledge bases,
            governed by human approval gates, and integrated into existing business tools.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/50 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
            <span className="font-mono text-sm font-bold">03</span>
          </div>
          <h3 className="text-xl font-bold text-white">Our Engineering Approach</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            We don't sell generic templates. We follow a rigorous 6-stage engineering cycle:
            <strong> Map → Design → Build → Integrate → Deploy → Optimize.</strong> Every pipeline
            is rigorously evaluated against deterministic schemas and edge cases before production release.
          </p>
        </div>
      </div>

      {/* Technology & Security Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-8">
        <div className="p-8 rounded-2xl bg-dark-card border border-dark-border space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-600/20 text-brand-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Technology Philosophy</h3>
          </div>
          <ul className="space-y-3 text-xs text-gray-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span><strong>Model Agnostic:</strong> We select the optimal foundation model for each specific task (OpenAI, Claude, Gemini, or open-weights) rather than locking clients to one vendor.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span><strong>Deterministic Code + Semantic AI:</strong> Math, encryption, and database writes are strictly executed in deterministic code; LLMs are utilized only where human reasoning is needed.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span><strong>Observability First:</strong> Every agent reasoning step, tool call, and latency spike is logged into an immutable telemetry ledger.</span>
            </li>
          </ul>
        </div>

        <div className="p-8 rounded-2xl bg-dark-card border border-dark-border space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-cyan/20 text-accent-cyan">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Security & Governance</h3>
          </div>
          <ul className="space-y-3 text-xs text-gray-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
              <span><strong>Zero Model Training:</strong> Client documents, customer inquiries, and proprietary databases are never submitted to train public foundation models.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
              <span><strong>Human-in-the-Loop Safeguards:</strong> Autonomous agents cannot perform irreversible external actions (such as contract dispatch or payments) without operator sign-off.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
              <span><strong>Private VPC Deployment:</strong> Available on-premise or inside your isolated AWS/GCP perimeter for enterprise compliance (SOC2 / HIPAA).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Team Architecture Section (No invented people, genuine roles) */}
      <div className="p-8 lg:p-10 rounded-2xl bg-dark-card border border-dark-border space-y-6">
        <div>
          <span className="text-xs font-mono text-brand-400 uppercase">Team & Governance Architecture</span>
          <h3 className="text-2xl font-bold text-white mt-1">Multi-Disciplinary Engineering Studio</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Our systems are architected and deployed by senior engineers specializing in distributed systems,
            natural language evaluation, and enterprise security.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border">
            <div className="text-xs font-bold text-white">Lead AI Systems Architect</div>
            <p className="text-[11px] text-gray-400 mt-1">Directs model evaluation, prompt optimization, vector index design, and schema guardrails.</p>
          </div>
          <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border">
            <div className="text-xs font-bold text-white">Full-Stack Integrations Engineer</div>
            <p className="text-[11px] text-gray-400 mt-1">Builds resilient webhook pipelines, bi-directional CRM synchronizations, and operator dashboards.</p>
          </div>
          <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border">
            <div className="text-xs font-bold text-white">Security & Compliance Lead</div>
            <p className="text-[11px] text-gray-400 mt-1">Conducts penetration tests, audits data boundaries, and configures private VPC deployments.</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          href="/book"
          className="inline-flex items-center gap-2 py-3.5 px-7 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-xl shadow-brand-600/30 transition-all"
        >
          <span>Schedule a Technical Architecture Audit</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
