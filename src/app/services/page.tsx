import Link from "next/link";
import { servicesData } from "@/data/services";
import { ArrowRight, Sparkles, CheckCircle2, Cpu, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "AI Automation Services Catalog",
  description: "Explore our 9 production AI automation services: AI Agents, Workflows, Customer Support, Sales, RAG, and Document Intelligence.",
};

export default function ServicesPage() {
  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5" />
          <span>FULL-STACK IMPLEMENTATION SERVICES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Our AI Automation Services.
        </h1>
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
          We do not just give you access to an API. We map your operational processes, build custom
          agent pipelines, integrate your software tools, and manage production telemetry.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesData.map((srv) => (
          <div
            key={srv.slug}
            className="rounded-2xl bg-dark-card border border-dark-border p-7 hover:border-brand-500/60 hover:bg-dark-elevated transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-dark-elevated group-hover:bg-brand-600/20 border border-dark-border flex items-center justify-center text-brand-400 mb-5 transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">
                {srv.title}
              </h2>

              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                {srv.shortDescription}
              </p>

              <div className="mt-6 pt-4 border-t border-dark-border space-y-2">
                <span className="text-[10px] font-mono uppercase text-gray-500 tracking-wider">
                  Key Capabilities:
                </span>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {srv.features.slice(0, 3).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-dark-border flex items-center justify-between">
              <Link
                href={`/services/${srv.slug}`}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <span>Deep Dive Architecture</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/book"
                className="text-xs font-mono text-gray-400 hover:text-white"
              >
                Discuss Scope &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Scoping Callout */}
      <div className="p-8 rounded-2xl bg-dark-card border border-dark-border text-center max-w-3xl mx-auto space-y-4">
        <h3 className="text-xl font-bold text-white">Need a combination of these services?</h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          Most client systems combine multiple capabilities—such as Document Intelligence connected to
          Workflow Pipelines and human approval in Slack. We design connected architectures.
        </p>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 transition-all"
        >
          <span>Schedule an Architecture Audit</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
