"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Clock, AlertTriangle, Play, Check, Shield } from "lucide-react";

export function ExecutionsClient({ initialExecutions }: { initialExecutions: any[] }) {
  const [executions, setExecutions] = useState<any[]>(initialExecutions);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/executions/${id}/approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        setExecutions((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: data.status, approvedBy: data.execution.approvedBy } : e))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const pending = executions.filter((e) => e.status === "waiting_approval");
  const history = executions.filter((e) => e.status !== "waiting_approval");

  return (
    <div className="space-y-8">
      {/* Pending Approvals */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Awaiting Human Sign-Off ({pending.length})</span>
        </h2>

        {pending.length === 0 ? (
          <div className="p-8 rounded-2xl bg-dark-card border border-dark-border text-center text-xs text-gray-500">
            All human approval queues are currently clear. No actions blocked.
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((item) => {
              const payload = item.approvalPayloadJson ? JSON.parse(item.approvalPayloadJson) : {};
              return (
                <div key={item.id} className="p-6 rounded-2xl bg-dark-card border border-rose-800/40 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-border pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-brand-400">Trigger: {item.triggerEvent}</span>
                      <h3 className="text-base font-bold text-white mt-0.5">{item.workflowName}</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded font-mono text-[10px] bg-rose-950/70 border border-rose-800/50 text-rose-300 self-start sm:self-auto animate-pulse">
                      Status: waiting_approval
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Action Payload Prepared for Sign-Off:</span>
                    <pre className="p-3.5 rounded-xl bg-dark-bg border border-dark-border font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed">
                      {JSON.stringify(payload, null, 2)}
                    </pre>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleAction(item.id, "reject")}
                      disabled={processingId === item.id}
                      className="px-4 py-2 rounded-lg bg-dark-elevated hover:bg-rose-950/40 text-rose-300 text-xs font-semibold border border-dark-border transition-colors"
                    >
                      Reject Action
                    </button>
                    <button
                      onClick={() => handleAction(item.id, "approve")}
                      disabled={processingId === item.id}
                      className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{processingId === item.id ? "Authorizing..." : "Approve & Dispatch"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Execution History */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Execution History & Traces</h2>
        <div className="rounded-2xl bg-dark-card border border-dark-border overflow-hidden">
          <div className="p-4 border-b border-dark-border text-[11px] font-mono text-gray-400 uppercase tracking-wider flex justify-between">
            <span>Workflow Trace</span>
            <span>Duration / Status</span>
          </div>

          <div className="divide-y divide-dark-border/60">
            {history.map((h) => (
              <div key={h.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="font-semibold text-white">{h.workflowName}</div>
                  <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                    Model: {h.modelUsed} • Trigger: {h.triggerEvent} {h.approvedBy ? `• ${h.approvedBy}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-gray-400">{h.durationMs}ms</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    h.status === "completed" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40" :
                    "bg-dark-elevated text-gray-400 border border-dark-border"
                  }`}>
                    {h.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
