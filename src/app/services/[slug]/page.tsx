import { notFound } from "next/navigation";
import Link from "next/link";
import { servicesData } from "@/data/services";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Zap,
  Layers,
  Clock,
  Workflow,
} from "lucide-react";

export async function generateStaticParams() {
  return servicesData.map((srv) => ({
    slug: srv.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = servicesData.find((s) => s.slug === params.slug);
  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} — AI Systems Architecture`,
    description: service.heroTagline,
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = servicesData.find((s) => s.slug === params.slug);
  if (!service) notFound();

  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* 1. Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <Workflow className="w-3.5 h-3.5" />
          <span>PRODUCTION SERVICE ARCHITECTURE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          {service.title}
        </h1>

        <p className="text-base sm:text-xl text-gray-300 leading-relaxed">
          {service.heroTagline}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/book"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-brand-600/30 transition-all"
          >
            <span>Discuss This Automation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-dark-card hover:bg-dark-elevated text-gray-300 hover:text-white border border-dark-border text-xs sm:text-sm font-semibold transition-colors"
          >
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span>Interactive Demos</span>
          </Link>
        </div>
      </div>

      {/* 2. What It Solves & Who It's For Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            What This System Solves
          </h2>
          <ul className="space-y-3 text-xs text-gray-300">
            {service.whatItSolves.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-rose-400 font-mono text-[11px] mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-8 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Who It's For
          </h2>
          <ul className="space-y-3 text-xs text-gray-300">
            {service.whoItsFor.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Workflow Example Box */}
      <div className="rounded-2xl bg-dark-card border border-brand-500/40 p-8 lg:p-10 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono text-brand-400 uppercase tracking-wider">
            SYSTEM ARCHITECTURE BLUEPRINT
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            Example Production Workflow
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Trigger:</span>
            <div className="text-white font-medium mt-1">{service.workflowExample.trigger}</div>
          </div>

          <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Agent Role:</span>
            <div className="text-brand-300 font-medium mt-1">{service.workflowExample.agentRole}</div>
          </div>

          <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Decision Logic:</span>
            <div className="text-white font-medium mt-1">{service.workflowExample.decision}</div>
          </div>

          <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border sm:col-span-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Connected Tools:</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {service.workflowExample.tools.map((t, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-dark-bg border border-dark-border font-mono text-[10px] text-gray-300">
                  ⚡ {t}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Human Approval:</span>
            <div className="text-accent-cyan font-medium mt-1">{service.workflowExample.humanApproval}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-dark-bg border border-dark-border text-xs text-gray-300">
          <span className="font-mono text-[10px] text-emerald-400 uppercase block mb-1">Final Result:</span>
          {service.workflowExample.output}
        </div>
      </div>

      {/* 4. How It Works (Steps) */}
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white">How We Deploy This System</h2>
          <p className="text-xs text-gray-400 mt-1">Our phased implementation methodology ensures stability and security.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {service.howItWorks.map((st) => (
            <div key={st.step} className="p-5 rounded-xl bg-dark-card border border-dark-border">
              <span className="font-mono text-xl font-bold text-brand-500">{st.step}</span>
              <h3 className="text-sm font-bold text-white mt-1">{st.title}</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Features & Technologies & Security */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Features & Capabilities
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            {service.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Integrations & Models
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {service.technologies.map((tech, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded bg-dark-elevated border border-dark-border font-mono text-[11px] text-gray-300">
                {tech}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 pt-2 leading-relaxed">
            Compatible with all standard enterprise APIs, REST webhooks, and private databases.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Security & Compliance
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            {service.securityMeasures.map((sec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-cyan shrink-0 mt-0.5" />
                <span>{sec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 6. Expected Outcomes */}
      <div className="p-8 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          Expected Business Outcomes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-emerald-300">
          {service.expectedOutcomes.map((out, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-dark-card border border-emerald-900/40 leading-relaxed">
              {out}
            </div>
          ))}
        </div>
      </div>

      {/* 7. Bottom CTA */}
      <div className="p-10 rounded-2xl bg-gradient-to-r from-brand-950/50 to-dark-card border border-brand-500/40 text-center space-y-5">
        <h3 className="text-2xl font-bold text-white">
          Ready to deploy {service.title} in your stack?
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
          We start with an operational audit to scope the exact tools, data flows, and human approval checkpoints needed for your team.
        </p>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-brand-600/30 transition-all"
        >
          <span>Schedule an Architecture Scoping Call</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
