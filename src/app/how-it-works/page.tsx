import Link from "next/link";
import { processSteps } from "@/data/process";
import { ArrowRight, CheckCircle2, Clock, Activity, Cpu } from "lucide-react";

export const metadata = {
  title: "How It Works — The 8-Step Engineering Process",
  description: "Learn how CareerForgeX takes an operational bottleneck from discovery to production-ready AI automation.",
};

export default function HowItWorksPage() {
  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <Activity className="w-3.5 h-3.5" />
          <span>PRODUCTION METHODOLOGY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          How We Build & Deploy AI Systems.
        </h1>
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
          From first operational inventory to continuous post-deployment telemetry: an 8-stage
          methodology designed to deliver measurable operational capacity without breaking production workflows.
        </p>
      </div>

      {/* 8-Step Process Timeline Cards */}
      <div className="relative border-l-2 border-brand-500/30 ml-4 sm:ml-8 md:ml-32 space-y-12 pl-6 sm:pl-10">
        {processSteps.map((step, idx) => (
          <div key={step.number} className="relative group">
            {/* Step Number Dot */}
            <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-8 h-8 rounded-full bg-dark-bg border-2 border-brand-500 flex items-center justify-center font-mono text-xs font-bold text-brand-400 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all shadow-md shadow-brand-500/20">
              {step.number}
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-500/50 hover:bg-dark-elevated transition-all space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-border/60 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-brand-400 uppercase tracking-wider">
                    Phase {step.number}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    {step.title}
                  </h2>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-elevated border border-dark-border text-xs font-mono text-gray-300 self-start sm:self-auto">
                  <Clock className="w-3.5 h-3.5 text-brand-400" />
                  <span>{step.duration}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
                {step.tagline}
              </p>

              <p className="text-xs text-gray-400 leading-relaxed">
                {step.description}
              </p>

              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase text-gray-500 block mb-2">
                  Concrete Deliverables:
                </span>
                <div className="flex flex-wrap gap-2">
                  {step.deliverables.map((deliv, dIdx) => (
                    <span
                      key={dIdx}
                      className="px-3 py-1 rounded-lg bg-dark-bg border border-dark-border text-xs text-gray-300 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{deliv}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scoping CTA */}
      <div className="p-10 rounded-2xl bg-gradient-to-r from-brand-950/40 via-dark-card to-dark-elevated border border-brand-500/40 text-center space-y-5">
        <h3 className="text-2xl font-bold text-white">Start With Phase 01: Free Discovery Audit</h3>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
          We'll map your repetitive manual workflows and deliver a concrete high-ROI target list for your review.
        </p>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-600/30 transition-all"
        >
          <span>Schedule Phase 01 Discovery Call</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
