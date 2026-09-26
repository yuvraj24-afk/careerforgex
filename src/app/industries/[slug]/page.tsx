import { notFound } from "next/navigation";
import Link from "next/link";
import { industriesData } from "@/data/industries";
import { ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Zap, Building2 } from "lucide-react";

export async function generateStaticParams() {
  return industriesData.map((ind) => ({ slug: ind.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const ind = industriesData.find((i) => i.slug === params.slug);
  if (!ind) return { title: "Industry Not Found" };
  return {
    title: `${ind.name} AI Automation Systems`,
    description: ind.tagline,
  };
}

export default function IndustryDetailPage({ params }: { params: { slug: string } }) {
  const ind = industriesData.find((i) => i.slug === params.slug);
  if (!ind) notFound();

  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <Building2 className="w-3.5 h-3.5" />
          <span>INDUSTRY ARCHITECTURE SPECIFICATION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          AI Systems for {ind.name}
        </h1>
        <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
          {ind.tagline}
        </p>
        <p className="text-xs sm:text-sm text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {ind.overview}
        </p>

        <div className="pt-2">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-brand-600/30 transition-all"
          >
            <span>Book an Audit for {ind.name}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Problems & Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Specific Operational Challenges
          </h2>
          <ul className="space-y-3 text-xs text-gray-300">
            {ind.industryProblems.map((prob, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-rose-400 font-mono text-[11px] mt-0.5">•</span>
                <span>{prob}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-8 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            High-Impact Automation Opportunities
          </h2>
          <ul className="space-y-3 text-xs text-gray-300">
            {ind.automationOpportunities.map((opp, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Example Workflows & AI Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Workflow */}
        <div className="p-8 rounded-2xl bg-dark-card border border-brand-500/40 space-y-5">
          <span className="text-xs font-mono text-brand-400 uppercase">Production Workflow Example</span>
          <h3 className="text-lg font-bold text-white">{ind.exampleWorkflows[0]?.title}</h3>
          <div className="space-y-2">
            {ind.exampleWorkflows[0]?.steps.map((st, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-dark-elevated border border-dark-border flex items-center gap-3 text-xs text-gray-200">
                <span className="text-brand-400 font-mono font-bold">0{idx + 1}</span>
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent Profiles */}
        <div className="p-8 rounded-2xl bg-dark-card border border-dark-border space-y-5">
          <span className="text-xs font-mono text-accent-cyan uppercase">Specialized Digital Workers</span>
          <h3 className="text-lg font-bold text-white">Autonomous Agent Roles</h3>
          <div className="space-y-3">
            {ind.aiAgentExamples.map((ag, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-dark-elevated border border-dark-border space-y-1">
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-cyan" />
                  {ag.role}
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">{ag.task}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integrations & Security Considerations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-dark-elevated border border-dark-border space-y-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Connected Industry Software
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {ind.keyIntegrations.map((tool, idx) => (
              <span key={idx} className="px-3 py-1 rounded bg-dark-card border border-dark-border font-mono text-xs text-brand-300">
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-dark-elevated border border-dark-border space-y-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Security & Regulatory Considerations
          </h3>
          <ul className="space-y-1.5 text-xs text-gray-300">
            {ind.securityConsiderations.map((sec, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{sec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Scoping Banner */}
      <div className="p-10 rounded-2xl bg-gradient-to-r from-brand-950/40 to-dark-card border border-brand-500/40 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">
          Discuss an Automation Project for {ind.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
          We provide clear system blueprints and fixed-sprint delivery. Schedule a systems review with our engineering leads.
        </p>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-600/30"
        >
          <span>Schedule Systems Review</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
