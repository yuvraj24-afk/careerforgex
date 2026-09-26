import Link from "next/link";
import { prisma } from "@/lib/db";
import { Bell, CheckCircle2, Sliders, ExternalLink, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { opportunity: true },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Bell className="w-7 h-7 text-cyan-400" />
          Personalized Opportunity Alerts
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Receive notifications automatically whenever new premier opportunities matching your domain or preferences are published.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Notification Feed (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Recent Alert Notifications</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {notifications.length}
            </span>
          </h2>

          {notifications.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
              <Bell className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400">No new alerts right now.</p>
              <p className="text-xs text-slate-500">
                You will be notified here as soon as matching openings are indexed by the autonomous crawler.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-2 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white text-sm">
                        {n.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono shrink-0">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {n.opportunity && (
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{n.opportunity.organization}</span>
                      <Link
                        href={`/opportunities/${n.opportunity.slug}`}
                        className="text-cyan-400 hover:text-cyan-300 font-medium"
                      >
                        View & Apply &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preferences Form (1 col) */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 h-fit shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Alert Subscriptions
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1.5">
                Target Opportunity Types
              </label>
              <div className="space-y-1.5 text-slate-400">
                {["Research Internships", "Summer Fellowships", "PhD Positions", "Scholarships"].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950 text-cyan-500" />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1.5">
                Target Domains
              </label>
              <div className="space-y-1.5 text-slate-400">
                {["Computer Science / AI", "Data Science", "Electronics & VLSI", "Mechanical & Aerospace", "Biotechnology"].map((dom) => (
                  <label key={dom} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950 text-cyan-500" />
                    <span>{dom}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="text-slate-300 font-medium block mb-1.5">
                Notification Channel
              </label>
              <div className="space-y-1.5 text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950 text-cyan-500" />
                  <span>In-App Notifications</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-700 bg-slate-950 text-cyan-500" />
                  <span>Daily Digest Email</span>
                </label>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-xs shadow-md transition-all mt-2"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
