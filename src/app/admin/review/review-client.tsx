"use client";

import { useState } from "react";
import { Check, X, GitMerge, ExternalLink, AlertCircle, Building, Clock } from "lucide-react";

export function ReviewQueueClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (reviewItemId: string, action: string) => {
    setLoadingId(reviewItemId);
    try {
      const res = await fetch("/api/admin/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewItemId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(items.filter((i) => i.id !== reviewItemId));
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoadingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-2">
        <Check className="w-10 h-10 text-emerald-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Review Queue is Clear!</h3>
        <p className="text-sm text-slate-400">
          All extracted opportunities meet high confidence thresholds or have already been resolved.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const opp = item.opportunity;
        return (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-300">
                  {item.reviewReason}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Confidence: {opp?.confidenceScore || 0}%
                </span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Queued: {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-400">Extracted Opportunity:</span>
                <h4 className="text-base font-bold text-white">{opp?.title}</h4>
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-cyan-400" />
                  {opp?.organization} • {opp?.domain}
                </p>
                <p className="text-xs text-slate-400 line-clamp-3">
                  {opp?.shortSummary}
                </p>
                <div className="flex items-center gap-3 pt-1 text-xs">
                  <a
                    href={opp?.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Inspect Target Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                <span className="font-semibold text-slate-300">Flags & Context:</span>
                <p className="text-slate-400">
                  Reason for review: <strong className="text-white">{item.reviewReason}</strong>
                </p>
                {item.duplicateOfId && (
                  <p className="text-amber-300">
                    Potential duplicate match detected against existing record ID: {item.duplicateOfId}
                  </p>
                )}
                <p className="text-slate-500">
                  Autopilot held auto-publishing until human confirmation.
                </p>
              </div>
            </div>

            {/* Admin Decision Toolbar */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => handleAction(item.id, "REJECT")}
                disabled={loadingId === item.id}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-rose-300 border border-slate-700 hover:border-rose-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>

              {item.duplicateOfId && (
                <button
                  onClick={() => handleAction(item.id, "MERGE_DUPLICATE")}
                  disabled={loadingId === item.id}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <GitMerge className="w-3.5 h-3.5" />
                  <span>Merge with Original</span>
                </button>
              )}

              <button
                onClick={() => handleAction(item.id, "APPROVE")}
                disabled={loadingId === item.id}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve & Publish</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
