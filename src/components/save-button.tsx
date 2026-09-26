"use client";

import { useState } from "react";
import { Bookmark, Check } from "lucide-react";

export function SaveButton({ opportunityId, initialSaved = false }: { opportunityId: string; initialSaved?: boolean }) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const toggleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(data.saved);
      }
    } catch {
      // Ignore network errors in demo
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
        saved
          ? "bg-cyan-950 border-cyan-800 text-cyan-300 shadow-sm"
          : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
      }`}
    >
      {saved ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Bookmark className="w-3.5 h-3.5" />}
      <span>{saved ? "Saved" : "Save Opportunity"}</span>
    </button>
  );
}
