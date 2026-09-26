import { db } from "@/lib/db";
import { Layers, CheckCircle2, Clock, Calendar, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await db.automationProject.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      lead: true,
      milestones: { orderBy: { order: "asc" } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Active Automation Projects</h1>
        <p className="text-xs text-gray-400 mt-1">
          Client implementation sprints, architectural milestones, and delivery timelines.
        </p>
      </div>

      <div className="space-y-6">
        {projects.map((proj) => (
          <div key={proj.id} className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-border pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-brand-400">{proj.projectType}</span>
                <h2 className="text-lg font-bold text-white">{proj.name}</h2>
                {proj.lead && <p className="text-xs text-gray-400 mt-0.5">Client: {proj.lead.company}</p>}
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-500 uppercase">Progress</span>
                  <div className="text-xs font-bold text-white">{proj.progress}%</div>
                </div>
                <span className="px-2.5 py-0.5 rounded font-mono text-[10px] bg-brand-950/70 border border-brand-800/40 text-brand-300">
                  {proj.status}
                </span>
              </div>
            </div>

            {proj.description && (
              <p className="text-xs text-gray-300 leading-relaxed">{proj.description}</p>
            )}

            {/* Milestones */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono uppercase text-gray-500">Milestones & Sprints:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {proj.milestones.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-dark-elevated border border-dark-border text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-gray-500">M0{m.order}</span>
                      <span className={`text-[10px] font-mono ${
                        m.status === "Completed" ? "text-emerald-400" :
                        m.status === "InProgress" ? "text-brand-400 animate-pulse" : "text-gray-500"
                      }`}>
                        {m.status}
                      </span>
                    </div>
                    <div className="font-medium text-white line-clamp-1">{m.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
