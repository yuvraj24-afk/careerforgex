import Link from "next/link";
import { db } from "@/lib/db";
import { ArrowRight, Workflow, CheckCircle2, AlertTriangle, Cpu } from "lucide-react";

export const metadata = {
  title: "Case Studies & System Blueprints",
  description: "Explore concrete example workflows and system architectures implemented across logistics, real estate, and healthcare.",
};

export default async function CaseStudiesPage() {
  let caseStudies: any[] = [];
  try {
    caseStudies = await db.caseStudy.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // database fallback
  }

  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <Workflow className="w-3.5 h-3.5" />
          <span>PRODUCTION SYSTEM BLUEPRINTS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Case Studies & Example Workflows.
        </h1>
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
          We believe in complete transparency. We do not invent fake client logos or fabricate customer reviews.
          Below are real system architectures and operational workflows engineered for target vertical challenges.
        </p>
      </div>

      {/* Case Studies Grid */}
      <div className="space-y-10">
        {caseStudies.map((cs) => (
          <div
            key={cs.slug}
            className="rounded-2xl bg-dark-card border border-dark-border p-8 lg:p-10 shadow-xl space-y-6 hover:border-brand-500/40 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-border pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-950/80 border border-brand-800/40 text-brand-400 uppercase">
                    {cs.industry}
                  </span>
                  {cs.isExample && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-elevated border border-dark-border text-gray-400">
                      Example Workflow
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white mt-1">{cs.title}</h2>
              </div>

              <Link
                href={`/case-studies/${cs.slug}`}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Read Full Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">{cs.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-xl bg-dark-elevated border border-rose-950/40 space-y-1">
                <span className="text-[10px] font-mono text-rose-400 uppercase">The Operational Problem:</span>
                <p className="text-gray-300 leading-relaxed">{cs.problem}</p>
              </div>

              <div className="p-4 rounded-xl bg-dark-elevated border border-emerald-950/40 space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase">Engineered Solution:</span>
                <p className="text-gray-300 leading-relaxed">{cs.solution}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-bg border border-dark-border space-y-2 text-xs">
              <span className="text-[10px] font-mono text-brand-400 uppercase">Pipeline Architecture:</span>
              <div className="font-mono text-[11px] text-gray-300">{cs.workflow}</div>
              <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-dark-border/40">
                <span className="text-[10px] text-gray-500 font-mono">Tools:</span>
                <span className="text-[11px] text-gray-400 font-mono">{cs.tools}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Operational Result:</strong> {cs.results}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center pt-8">
        <Link
          href="/book"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-brand-600/30"
        >
          <span>Map Your Team's Workflow</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
