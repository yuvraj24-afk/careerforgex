import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DeadlineEngine } from "@/lib/automation/deadline-engine";
import { SaveButton } from "@/components/save-button";
import {
  Building,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Layers,
  Award,
  CheckCircle2,
  AlertCircle,
  History,
  Info,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OpportunityDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const opp = await prisma.opportunity.findUnique({
    where: { slug: params.slug },
    include: {
      source: true,
      changeLogs: {
        orderBy: { changedAt: "desc" },
        take: 10,
      },
    },
  });

  if (!opp) {
    notFound();
  }

  // Increment view count asynchronously
  prisma.opportunity
    .update({
      where: { id: opp.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  const deadlineCalc = DeadlineEngine.calculateStatus(opp.deadline);

  // Helper to parse stored JSON array strings
  const parseSafe = (val: string | null) => {
    if (!val) return [];
    try {
      return JSON.parse(val);
    } catch {
      return [val];
    }
  };

  const degrees = parseSafe(opp.degreeRequirements);
  const years = parseSafe(opp.yearRequirements);
  const branches = parseSafe(opp.branchRequirements);
  const skills = parseSafe(opp.skills);

  // Fetch similar opportunities
  const similar = await prisma.opportunity.findMany({
    where: {
      id: { not: opp.id },
      status: "PUBLISHED",
      OR: [{ domain: opp.domain }, { opportunityType: opp.opportunityType }],
    },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-cyan-400">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/opportunities" className="hover:text-cyan-400">Opportunities</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white truncate max-w-sm">{opp.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300">
                {opp.opportunityType}
              </span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                {opp.domain}
              </span>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                {opp.mode}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Official
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {opp.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Building className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="font-medium text-white">{opp.organization}</span>
              {opp.location && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {opp.location}
                  </span>
                </>
              )}
            </div>

            {/* Deadline Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                deadlineCalc.status === "CLOSING_SOON"
                  ? "bg-amber-950/40 border-amber-800/80 text-amber-200"
                  : deadlineCalc.status === "EXPIRED"
                  ? "bg-rose-950/40 border-rose-800/80 text-rose-200"
                  : "bg-cyan-950/30 border-cyan-800/60 text-cyan-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold opacity-80">
                    Application Deadline
                  </span>
                  <p className="font-bold text-base text-white">
                    {opp.deadline ? new Date(opp.deadline).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) : "Rolling Basis / Open"}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700">
                {deadlineCalc.label}
              </span>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={opp.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <SaveButton opportunityId={opp.id} />

              <a
                href={opp.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 ml-auto"
              >
                <span>Source Circular</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-400" />
              About the Opportunity
            </h2>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {opp.fullDescription}
            </div>
          </div>

          {/* Eligibility Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Eligibility Criteria
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {opp.eligibility || "Refer to the official source notification for exhaustive department-specific requirements."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
              <div>
                <span className="text-xs text-slate-400 font-medium">Eligible Degrees</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {degrees.map((deg: string) => (
                    <span key={deg} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200">
                      {deg}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Academic Year</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {years.map((yr: string) => (
                    <span key={yr} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200">
                      {yr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Application Procedure */}
          {opp.applicationProcess && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-400" />
                Application Process
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {opp.applicationProcess}
              </p>
            </div>
          )}

          {/* Change History Audit Trail */}
          {opp.changeLogs && opp.changeLogs.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-4">
              <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                Autonomous Change History (Audit Trail)
              </h2>
              <div className="space-y-3">
                {opp.changeLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-semibold text-cyan-300 uppercase tracking-wide">
                        {log.fieldName.replace(/([A-Z])/g, " $1")}
                      </span>
                      <p className="text-slate-400 mt-0.5">{log.reason || "System updated field from official source"}</p>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px] shrink-0">
                      {new Date(log.changedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Source Transparency & Attribution */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 text-xs text-slate-400 space-y-2">
            <span className="font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Source Transparency Guarantee
            </span>
            <p className="leading-relaxed">
              CareerForgeX indexes opportunities directly from official institutional portals.
              The host institution ({opp.organization}) is the sole authority for official requirements,
              interview schedules, and final selections.
            </p>
            <p className="pt-1 text-[11px] text-slate-500">
              Official Source:{" "}
              <a
                href={opp.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                {opp.source?.name || opp.organization}
              </a>{" "}
              • Last verified: {opp.lastRevalidatedAt ? new Date(opp.lastRevalidatedAt).toLocaleDateString() : "Today"}
            </p>
          </div>
        </div>

        {/* Sidebar (1 Column) */}
        <div className="space-y-6">
          {/* Quick Facts Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="font-bold text-white text-base">Opportunity Summary</h3>

            <div className="space-y-4 text-xs divide-y divide-slate-800/80">
              <div className="pt-3 flex justify-between gap-2">
                <span className="text-slate-400">Host Organization</span>
                <span className="font-medium text-white text-right">{opp.organization}</span>
              </div>

              <div className="pt-3 flex justify-between gap-2">
                <span className="text-slate-400">Category</span>
                <span className="font-medium text-white text-right">{opp.opportunityType}</span>
              </div>

              <div className="pt-3 flex justify-between gap-2">
                <span className="text-slate-400">Remuneration / Stipend</span>
                <span className="font-semibold text-emerald-400 text-right">
                  {opp.stipend || "Not specified / Norms apply"}
                </span>
              </div>

              <div className="pt-3 flex justify-between gap-2">
                <span className="text-slate-400">Duration</span>
                <span className="font-medium text-white text-right">{opp.duration || "Standard term"}</span>
              </div>

              <div className="pt-3 flex justify-between gap-2">
                <span className="text-slate-400">Work Mode</span>
                <span className="font-medium text-white text-right">{opp.mode}</span>
              </div>

              <div className="pt-3 flex justify-between gap-2">
                <span className="text-slate-400">Domain</span>
                <span className="font-medium text-cyan-300 text-right">{opp.domain}</span>
              </div>

              <div className="pt-3 flex justify-between gap-2">
                <span className="text-slate-400">Confidence Score</span>
                <span className="font-bold text-emerald-400 text-right">{opp.confidenceScore}%</span>
              </div>
            </div>

            <a
              href={opp.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all block text-center"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Similar Opportunities */}
          {similar.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm">Similar Openings</h3>
              <div className="space-y-3">
                {similar.map((sim) => (
                  <Link
                    key={sim.id}
                    href={`/opportunities/${sim.slug}`}
                    className="block p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 transition-colors group"
                  >
                    <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wide">
                      {sim.opportunityType}
                    </span>
                    <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mt-0.5">
                      {sim.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {sim.organization}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
