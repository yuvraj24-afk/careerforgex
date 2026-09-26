import Link from "next/link";
import { prisma } from "@/lib/db";
import { DeadlineEngine } from "@/lib/automation/deadline-engine";
import { Bookmark, Clock, Building, ExternalLink, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const savedItems = await prisma.savedOpportunity.findMany({
    include: {
      opportunity: {
        include: { source: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Bookmark className="w-7 h-7 text-cyan-400" />
          Saved Opportunities
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Keep track of deadlines and easily apply on official institutional portals.
        </p>
      </div>

      {savedItems.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
          <h2 className="text-lg font-semibold text-white">No saved opportunities yet</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Browse verified openings and click &quot;Save Opportunity&quot; to bookmark them for easy reference.
          </p>
          <Link
            href="/opportunities"
            className="inline-block mt-3 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-md"
          >
            Explore Opportunities
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map(({ opportunity: opp }) => {
            const deadlineCalc = DeadlineEngine.calculateStatus(opp.deadline);
            return (
              <div
                key={opp.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex flex-col justify-between group shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
                      {opp.opportunityType}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        deadlineCalc.status === "CLOSING_SOON"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-slate-800 text-slate-300"
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

                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {opp.organization}
                  </p>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {opp.shortSummary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <a
                    href={opp.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Apply Official</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    href={`/opportunities/${opp.slug}`}
                    className="text-slate-400 hover:text-white"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
