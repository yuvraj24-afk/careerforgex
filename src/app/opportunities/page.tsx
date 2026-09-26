import Link from "next/link";
import { prisma } from "@/lib/db";
import { DeadlineEngine } from "@/lib/automation/deadline-engine";
import {
  Search,
  Filter,
  Clock,
  Building,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Briefcase,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const q = searchParams.q || "";
  const selectedType = searchParams.type || "All";
  const selectedDomain = searchParams.domain || "All";
  const selectedMode = searchParams.mode || "All";
  const statusFilter = searchParams.status || "All";
  const paidOnly = searchParams.paid === "true";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const limit = 12;
  const skip = (page - 1) * limit;

  // Build Prisma Where Clause
  const where: any = {
    status: "PUBLISHED",
  };

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { organization: { contains: q } },
      { shortSummary: { contains: q } },
      { domain: { contains: q } },
      { fullDescription: { contains: q } },
    ];
  }

  if (selectedType !== "All") {
    where.opportunityType = selectedType;
  }

  if (selectedDomain !== "All") {
    where.domain = selectedDomain;
  }

  if (selectedMode !== "All") {
    where.mode = selectedMode;
  }

  if (paidOnly) {
    where.isPaid = true;
  }

  if (statusFilter === "CLOSING_SOON") {
    where.deadlineStatus = "CLOSING_SOON";
  }

  const [total, opportunities, allDomains] = await Promise.all([
    prisma.opportunity.count({ where }),
    prisma.opportunity.findMany({
      where,
      orderBy: statusFilter === "CLOSING_SOON" ? [{ deadline: "asc" }] : [{ createdAt: "desc" }],
      skip,
      take: limit,
      include: { source: true },
    }),
    prisma.opportunity.findMany({
      where: { status: "PUBLISHED" },
      select: { domain: true },
      distinct: ["domain"],
    }),
  ]);

  const domainList = ["All", ...allDomains.map((d) => d.domain).filter(Boolean)];

  const typesList = [
    "All",
    "Research",
    "Internship",
    "Fellowship",
    "PhD",
    "Scholarship",
    "Competition",
    "Research Project",
    "Job",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header & Search */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">Explore Opportunities</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Explore Verified Opportunities
              <span className="text-sm font-normal px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300">
                {total} Found
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Direct official applications indexed and verified by the CareerForgeX autonomous engine.
            </p>
          </div>
        </div>

        {/* Filter Bar Form */}
        <form
          action="/opportunities"
          method="GET"
          className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search title, institute, skills..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Type Filter */}
            <div className="w-full sm:w-48">
              <select
                name="type"
                defaultValue={selectedType}
                className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none"
              >
                {typesList.map((t) => (
                  <option key={t} value={t}>
                    {t === "All" ? "All Categories" : t}
                  </option>
                ))}
              </select>
            </div>

            {/* Domain Filter */}
            <div className="w-full sm:w-56">
              <select
                name="domain"
                defaultValue={selectedDomain}
                className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none"
              >
                {domainList.map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All Domains" : d}
                  </option>
                ))}
              </select>
            </div>

            {/* Apply Filters Button */}
            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-cyan-600/20"
            >
              Filter
            </button>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs border-t border-slate-800/60">
            <span className="text-slate-400 font-medium">Quick Filters:</span>
            <Link
              href="/opportunities?status=CLOSING_SOON"
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                statusFilter === "CLOSING_SOON"
                  ? "bg-amber-950 border-amber-700 text-amber-300 font-medium"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Closing Soon
            </Link>
            <Link
              href="/opportunities?type=Research"
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                selectedType === "Research"
                  ? "bg-cyan-950 border-cyan-700 text-cyan-300 font-medium"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Research Only
            </Link>
            <Link
              href="/opportunities?paid=true"
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                paidOnly
                  ? "bg-emerald-950 border-emerald-700 text-emerald-300 font-medium"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Paid / Stipend Only
            </Link>
            {(q || selectedType !== "All" || selectedDomain !== "All" || statusFilter !== "All" || paidOnly) && (
              <Link
                href="/opportunities"
                className="text-xs text-rose-400 hover:text-rose-300 ml-auto underline"
              >
                Clear Filters
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Opportunities List */}
      {opportunities.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-semibold text-white">No opportunities matched your criteria</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Try resetting your search query or filters. The autonomous crawler indexes new official sources regularly.
          </p>
          <Link
            href="/opportunities"
            className="inline-block mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium"
          >
            Reset All Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => {
            const deadlineCalc = DeadlineEngine.calculateStatus(opp.deadline);
            return (
              <div
                key={opp.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
                      {opp.opportunityType}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        deadlineCalc.status === "CLOSING_SOON"
                          ? "bg-amber-950 text-amber-300 border border-amber-800/80"
                          : "bg-slate-800/80 text-slate-300 border border-slate-700/60"
                      }`}
                    >
                      {deadlineCalc.label}
                    </span>
                  </div>

                  <Link href={`/opportunities/${opp.slug}`}>
                    <h2 className="font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 text-base leading-snug">
                      {opp.title}
                    </h2>
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
                    {opp.stipend && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
                        {opp.stipend.slice(0, 30)}
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
      )}

      {/* Pagination Bar */}
      {total > limit && (
        <div className="flex items-center justify-center gap-3 pt-12">
          {page > 1 && (
            <Link
              href={`/opportunities?page=${page - 1}&q=${q}&type=${selectedType}&domain=${selectedDomain}`}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white"
            >
              Previous Page
            </Link>
          )}
          <span className="text-xs text-slate-500">
            Page {page} of {Math.ceil(total / limit)}
          </span>
          {page * limit < total && (
            <Link
              href={`/opportunities?page=${page + 1}&q=${q}&type=${selectedType}&domain=${selectedDomain}`}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white"
            >
              Next Page
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
