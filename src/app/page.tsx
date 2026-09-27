import Link from "next/link";
import { prisma } from "@/lib/db";
import { DeadlineEngine } from "@/lib/automation/deadline-engine";
import {
  Compass,
  Search,
  Sparkles,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building,
  GraduationCap,
  Calendar,
  Layers,
  CheckCircle2,
  RefreshCw,
  Award,
  Microscope,
  Briefcase,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const now = new Date();

  // 1. Fetch live metrics & opportunities from database safely
  let totalOpportunities = 0;
  let totalSources = 0;
  let closingSoonCount = 0;
  let closingSoonOpps: any[] = [];
  let latestOpps: any[] = [];
  let researchOpps: any[] = [];

  try {
    const [oppCount, srcCount, soonCount] = await Promise.all([
      prisma.opportunity.count({ where: { status: "PUBLISHED" } }),
      prisma.source.count({ where: { status: "ACTIVE" } }),
      prisma.opportunity.count({
        where: {
          status: "PUBLISHED",
          deadlineStatus: "CLOSING_SOON",
        },
      }),
    ]);
    totalOpportunities = oppCount;
    totalSources = srcCount;
    closingSoonCount = soonCount;

    const [closing, latest, research] = await Promise.all([
      prisma.opportunity.findMany({
        where: {
          status: "PUBLISHED",
          deadline: { gte: now },
        },
        orderBy: { deadline: "asc" },
        take: 3,
        include: { source: true },
      }),
      prisma.opportunity.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { source: true },
      }),
      prisma.opportunity.findMany({
        where: {
          status: "PUBLISHED",
          OR: [{ opportunityType: "Research" }, { opportunityType: "Fellowship" }],
        },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { source: true },
      }),
    ]);

    closingSoonOpps = closing;
    latestOpps = latest;
    researchOpps = research;
  } catch (error) {
    console.error("Database query fallback in HomePage:", error);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Background Glow Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-cyan-900/20 via-indigo-900/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-900/15 blur-3xl rounded-full" />
        <div className="absolute top-2/3 -right-40 w-96 h-96 bg-cyan-900/15 blur-3xl rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Autopilot Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-800/50 text-cyan-300 text-xs font-medium shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Autonomous Intelligence Engine Active</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">
              {totalSources} Official Portals Monitored
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover Premier Opportunities on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
              Full Autopilot
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            CareerForgeX continuously discovers, extracts, verifies, and updates
            research internships, summer fellowships, PhD openings, and scholarships
            directly from official institutional sources.
          </p>

          {/* Interactive Search Bar Form */}
          <form
            action="/opportunities"
            method="GET"
            className="pt-4 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 p-2 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 px-3 flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                name="q"
                placeholder="Search by topic, institute, e.g. 'IIT Bombay', 'AI', 'Quantum'..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-3xl mx-auto border-t border-slate-900 text-left">
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
              <span className="text-2xl font-bold text-white">{totalOpportunities}</span>
              <p className="text-xs text-slate-400 mt-0.5">Live Opportunities</p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
              <span className="text-2xl font-bold text-cyan-400">{totalSources}</span>
              <p className="text-xs text-slate-400 mt-0.5">Official Portals</p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
              <span className="text-2xl font-bold text-amber-400">{closingSoonCount}</span>
              <p className="text-xs text-slate-400 mt-0.5">Closing Soon</p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
              <span className="text-2xl font-bold text-emerald-400">100%</span>
              <p className="text-xs text-slate-400 mt-0.5">Official & Verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Soon Section */}
      {closingSoonOpps.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  Closing Soon
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 font-normal">
                    Apply Immediately
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Opportunities expiring in the next few days. Tracked automatically by the deadline engine.
                </p>
              </div>
            </div>
            <Link
              href="/opportunities?status=CLOSING_SOON"
              className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              View all closing soon &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {closingSoonOpps.map((opp) => {
              const deadlineCalc = DeadlineEngine.calculateStatus(opp.deadline);
              return (
                <div
                  key={opp.id}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-amber-900/30 hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-950 border border-amber-800 text-amber-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {deadlineCalc.label}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {opp.opportunityType}
                      </span>
                    </div>

                    <Link
                      href={`/opportunities/${opp.slug}`}
                      className="block group-hover:text-cyan-300 transition-colors"
                    >
                      <h3 className="font-semibold text-white text-base line-clamp-2 leading-snug">
                        {opp.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-400 line-clamp-1 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      {opp.organization}
                    </p>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {opp.shortSummary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">
                      {opp.stipend || "Stipend as per institute"}
                    </span>
                    <Link
                      href={`/opportunities/${opp.slug}`}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      Details & Apply &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Latest Verified Opportunities Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              Latest Verified Opportunities
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Freshly discovered openings from IITs, IISc, IISERs, and global research institutions.
            </p>
          </div>
          <Link
            href="/opportunities"
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Explore all {totalOpportunities} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestOpps.map((opp) => {
            const deadlineCalc = DeadlineEngine.calculateStatus(opp.deadline);
            return (
              <div
                key={opp.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-cyan-300">
                      {opp.opportunityType}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      deadlineCalc.status === "CLOSING_SOON"
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : "bg-slate-800 text-slate-300"
                    }`}>
                      {deadlineCalc.label}
                    </span>
                  </div>

                  <Link href={`/opportunities/${opp.slug}`}>
                    <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 text-base leading-snug">
                      {opp.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{opp.organization}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {opp.shortSummary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800/70 text-slate-300">
                      {opp.domain}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800/70 text-slate-300">
                      {opp.mode}
                    </span>
                    {opp.isPaid && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
                        Paid / Stipend
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Official Portal</span>
                  </div>

                  <Link
                    href={`/opportunities/${opp.slug}`}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Autopilot System Architecture & Transparency Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Autonomous Verification Guarantee
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Zero Daily Manual Updates. 100% System-Driven.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              CareerForgeX was engineered so students never have to rely on manual blog aggregators.
              Our modular adapters poll official portals, detect updates, extract criteria via AI,
              eliminate duplicates, and track deadlines around the clock.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/opportunities"
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition-all"
              >
                Browse All Openings
              </Link>
              <Link
                href="/opportunities?type=Research"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <span>Explore Research Fellowships</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
