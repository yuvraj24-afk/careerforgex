import { notFound } from "next/navigation";
import Link from "next/link";
import { solutionsData } from "@/data/solutions";
import { ArrowRight, CheckCircle2, AlertTriangle, Zap, Activity } from "lucide-react";

export async function generateStaticParams() {
  return solutionsData.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const sol = solutionsData.find((s) => s.slug === params.slug);
  if (!sol) return { title: "Solution Not Found" };
  return {
    title: `${sol.title} — AI Systems & Automation`,
    description: sol.tagline,
  };
}

export default function SolutionDetailPage({ params }: { params: { slug: string } }) {
  const sol = solutionsData.find((s) => s.slug === params.slug);
  if (!sol) notFound();

  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <Activity className="w-3.5 h-3.5" />
          <span>{sol.department.toUpperCase()}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {sol.title}
        </h1>
        <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
          {sol.tagline}
        </p>

        <div className="pt-2">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-brand-600/30 transition-all"
          >
            <span>Book a {sol.title} Audit</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Problems & Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-dark-card border border-dark-border space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Typical Department Challenges
          </h2>
          <ul className="space-y-3 text-xs text-gray-300">
            {sol.commonProblems.map((prob, idx) => (
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
            Automation Opportunities
          </h2>
          <ul className="space-y-3 text-xs text-gray-300">
            {sol.automationOpportunities.map((opp, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Example Workflow */}
      <div className="p-8 rounded-2xl bg-dark-card border border-brand-500/40 space-y-6">
        <div>
          <span className="text-xs font-mono text-brand-400 uppercase">Workflow Blueprint</span>
          <h2 className="text-xl font-bold text-white mt-1">{sol.exampleWorkflow.title}</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sol.exampleWorkflow.steps.map((st, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-dark-elevated border border-dark-border text-center">
              <span className="text-[10px] font-mono text-brand-400 block mb-1">Step 0{idx + 1}</span>
              <span className="text-xs font-medium text-white">{st}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Focus */}
      <div className="p-8 rounded-2xl bg-dark-elevated border border-dark-border space-y-3">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
          Primary Business Metrics We Target
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs text-gray-300">
          {sol.metricsFocus.map((m, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-dark-card border border-dark-border/80 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span>{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          href="/book"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-brand-600/30"
        >
          <span>Schedule Discovery Session</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
