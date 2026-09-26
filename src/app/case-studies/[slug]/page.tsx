import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { ArrowRight, CheckCircle2, AlertTriangle, Workflow, ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const cs = await db.caseStudy.findUnique({ where: { slug: params.slug } });
  if (!cs) return { title: "Case Study Not Found" };
  return {
    title: `${cs.title} — Workflow Blueprint`,
    description: cs.summary,
  };
}

export default async function CaseStudyDetailPage({ params }: { params: { slug: string } }) {
  const cs = await db.caseStudy.findUnique({ where: { slug: params.slug } });
  if (!cs) notFound();

  return (
    <div className="py-16 lg:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <Link
        href="/case-studies"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Case Studies</span>
      </Link>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-950/80 border border-brand-800/40 text-brand-400 uppercase">
            {cs.industry}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-elevated border border-dark-border text-gray-400">
            Example Production Blueprint
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {cs.title}
        </h1>

        <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
          {cs.summary}
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-dark-card border border-rose-950/40 space-y-2">
          <h2 className="text-xs font-mono text-rose-400 uppercase tracking-wider">The Operational Challenge</h2>
          <p className="text-sm text-gray-200 leading-relaxed">{cs.problem}</p>
        </div>

        <div className="p-6 rounded-2xl bg-dark-card border border-brand-500/40 space-y-2">
          <h2 className="text-xs font-mono text-brand-400 uppercase tracking-wider">The Engineered Architecture</h2>
          <p className="text-sm text-gray-200 leading-relaxed">{cs.solution}</p>
        </div>

        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-3 font-mono text-xs">
          <h2 className="text-xs text-gray-400 uppercase">Sequential Pipeline Flow</h2>
          <div className="p-3.5 rounded-lg bg-dark-bg border border-dark-border text-brand-300 leading-relaxed">
            {cs.workflow}
          </div>
          <div className="text-gray-400">
            <strong>Connected Integrations:</strong> {cs.tools}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-2 text-emerald-300">
          <h2 className="text-xs font-mono uppercase tracking-wider text-emerald-400">Verified Business Impact</h2>
          <p className="text-sm leading-relaxed">{cs.results}</p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-dark-card border border-dark-border text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Have a similar bottleneck in your company?</h3>
        <p className="text-xs text-gray-400">
          We can evaluate your documents, tools, and processes during a 30-minute systems discovery call.
        </p>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-600/30"
        >
          <span>Schedule Systems Discovery Call</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
