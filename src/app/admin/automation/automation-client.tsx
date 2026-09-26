"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  ShieldCheck,
  Ban,
  Clock,
  CheckCircle,
  Database,
  Layers,
  ArrowUpRight,
  Zap,
} from "lucide-react";

export function AutomationDashboardClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const refreshStats = async () => {
    try {
      const res = await fetch("/api/admin/automation/stats");
      const json = await res.json();
      if (json.success) setData(json);
    } catch {
      // Ignore in background
    }
  };

  const handleControlAction = async (action: string, sourceId?: string) => {
    setLoadingAction(sourceId ? `${action}_${sourceId}` : action);
    setActionMessage(null);

    try {
      const res = await fetch("/api/admin/automation/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, sourceId }),
      });
      const result = await res.json();
      if (result.success) {
        setActionMessage(result.message || "Action executed successfully.");
        await refreshStats();
      } else {
        setActionMessage(`Error: ${result.error}`);
      }
    } catch (err: any) {
      setActionMessage(`Network error: ${err.message}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const stats = data.stats || {};
  const system = data.system || {};
  const sources = data.sources || [];
  const alerts = data.alerts || [];

  return (
    <div className="space-y-8">
      {/* Global Health & Heartbeat Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-950/80 border border-cyan-800 text-cyan-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">CareerForgeX Autopilot Core</h2>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  system.isPipelinePaused
                    ? "bg-rose-950 text-rose-300 border border-rose-800"
                    : system.workerHealth === "HEALTHY"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : "bg-amber-950 text-amber-300 border border-amber-800"
                }`}
              >
                {system.isPipelinePaused
                  ? "PIPELINE PAUSED"
                  : system.workerHealth === "HEALTHY"
                  ? "AUTOPILOT HEALTHY"
                  : "WORKER IDLE / STANDBY"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Last Worker Heartbeat:{" "}
              {system.lastHeartbeat
                ? new Date(system.lastHeartbeat).toLocaleString()
                : "No heartbeat yet (worker standby)"}
            </p>
          </div>
        </div>

        {/* Emergency System Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {system.isPipelinePaused ? (
            <button
              onClick={() => handleControlAction("RESUME_ALL")}
              disabled={!!loadingAction}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume All Ingestion</span>
            </button>
          ) : (
            <button
              onClick={() => handleControlAction("PAUSE_ALL")}
              disabled={!!loadingAction}
              className="px-4 py-2 bg-rose-600/90 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause All Ingestion</span>
            </button>
          )}

          <button
            onClick={() => handleControlAction("REPROCESS_FAILED")}
            disabled={!!loadingAction}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reprocess Degraded</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-800 text-cyan-200 text-xs font-medium flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* System Alerts Banner (if any) */}
      {alerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Active Infrastructure Alerts ({alerts.length})</span>
          </div>
          {alerts.map((a: any) => (
            <div key={a.id} className="text-xs text-rose-200/90 pl-6">
              <span className="font-semibold">{a.title}:</span> {a.message}
            </div>
          ))}
        </div>
      )}

      {/* Key Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Sources</span>
          <p className="text-2xl font-bold text-white mt-1">{stats.totalSources || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Active Sources</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.activeSources || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Degraded Sources</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{stats.degradedSources || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Auto-Published</span>
          <p className="text-2xl font-bold text-cyan-400 mt-1">{stats.publishedOpportunities || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">In Review Queue</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{stats.pendingReviewCount || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Expired Today</span>
          <p className="text-2xl font-bold text-slate-400 mt-1">{stats.expiredToday || 0}</p>
        </div>
      </div>

      {/* Per-Source Health & Control Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              Source Registry & Monitoring Health
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status, autonomous check schedule, and emergency controls for each registered source.
            </p>
          </div>
          <button
            onClick={refreshStats}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Source Name</th>
                <th className="py-3 px-3">Tier</th>
                <th className="py-3 px-3">Adapter</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Freq</th>
                <th className="py-3 px-3">Last Checked</th>
                <th className="py-3 px-3">Next Due</th>
                <th className="py-3 px-3">Created / Updated</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sources.map((s: any) => {
                const isActionRunning = loadingAction?.includes(s.id);
                return (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white">
                      <div className="truncate max-w-xs">{s.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate max-w-xs">{s.url}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        Tier {s.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 uppercase text-[11px] font-mono text-cyan-400">
                      {s.adapterType}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === "ACTIVE"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : s.status === "DEGRADED"
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-400">
                      {s.checkFrequency}m
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">
                      {s.lastCheckedAt ? new Date(s.lastCheckedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Never"}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">
                      {s.nextCheckAt ? new Date(s.nextCheckAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Immediate"}
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      <span className="text-emerald-400 font-semibold">{s.recordsCreated}</span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-cyan-400">{s.recordsUpdated}</span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleControlAction("RUN_SOURCE_NOW", s.id)}
                          disabled={isActionRunning}
                          title="Run Source Now"
                          className="p-1.5 rounded-lg bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800"
                        >
                          <Play className="w-3 h-3" />
                        </button>

                        {s.status === "PAUSED" ? (
                          <button
                            onClick={() => handleControlAction("RESUME_SOURCE", s.id)}
                            disabled={isActionRunning}
                            title="Resume Source"
                            className="p-1.5 rounded-lg bg-slate-800 text-emerald-400 hover:bg-slate-700"
                          >
                            <Play className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleControlAction("PAUSE_SOURCE", s.id)}
                            disabled={isActionRunning}
                            title="Pause Source"
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700"
                          >
                            <Pause className="w-3 h-3" />
                          </button>
                        )}

                        <button
                          onClick={() => handleControlAction("MARK_TRUSTED", s.id)}
                          disabled={isActionRunning}
                          title="Mark Official Trusted (Tier 1)"
                          className="p-1.5 rounded-lg bg-slate-800 text-emerald-400 hover:bg-slate-700"
                        >
                          <ShieldCheck className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
