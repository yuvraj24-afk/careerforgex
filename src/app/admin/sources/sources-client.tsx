"use client";

import { useState } from "react";
import { Plus, Database, Sparkles, ExternalLink, Check, Play, RefreshCw, Layers } from "lucide-react";

export function SourcesManagementClient({
  initialSources,
  initialDiscovered,
}: {
  initialSources: any[];
  initialDiscovered: any[];
}) {
  const [sources, setSources] = useState(initialSources);
  const [discovered, setDiscovered] = useState(initialDiscovered);
  const [activeTab, setActiveTab] = useState<"active" | "discovered">("active");

  // New source form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSource, setNewSource] = useState({
    name: "",
    url: "",
    sourceType: "iit",
    tier: 1,
    adapterType: "html",
    checkFrequency: 360,
  });

  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleTestFetch = async () => {
    if (!newSource.url) return alert("Please enter a URL to test.");
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TEST_FETCH",
          url: newSource.url,
          adapterType: newSource.adapterType,
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (e: any) {
      alert(`Test fetch failed: ${e.message}`);
    } finally {
      setTesting(false);
    }
  };

  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSource),
      });
      const data = await res.json();
      if (data.success) {
        setSources([data.source, ...sources]);
        setShowAddModal(false);
        setTestResult(null);
        setNewSource({
          name: "",
          url: "",
          sourceType: "iit",
          tier: 1,
          adapterType: "html",
          checkFrequency: 360,
        });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (e: any) {
      alert(`Failed to create source: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePromoteDiscovered = async (discoveredId: string) => {
    try {
      const res = await fetch("/api/admin/sources/discovered", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discoveredId, action: "PROMOTE_TO_ACTIVE" }),
      });
      const data = await res.json();
      if (data.success) {
        setDiscovered(discovered.filter((d) => d.id !== discoveredId));
        setSources([data.source, ...sources]);
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "active"
                ? "bg-cyan-950 border border-cyan-800 text-cyan-300 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Active Monitored Sources ({sources.length})
          </button>
          <button
            onClick={() => setActiveTab("discovered")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "discovered"
                ? "bg-purple-950 border border-purple-800 text-purple-300 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Autonomously Discovered Portals ({discovered.length})
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Official Source</span>
        </button>
      </div>

      {/* Active Sources Table */}
      {activeTab === "active" && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Source Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Tier</th>
                <th className="py-3 px-3">Adapter</th>
                <th className="py-3 px-3">Frequency</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Indexed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sources.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3">
                    <span className="font-semibold text-white block">{s.name}</span>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span className="truncate max-w-xs">{s.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </td>
                  <td className="py-3 px-3 uppercase text-[10px] font-mono text-slate-400">
                    {s.sourceType}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                      Tier {s.tier}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono uppercase text-cyan-400">
                    {s.adapterType}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    Every {s.checkFrequency >= 60 ? `${s.checkFrequency / 60}h` : `${s.checkFrequency}m`}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === "ACTIVE"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-semibold">
                    {s.recordsCreated} records
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Discovered Sources Table */}
      {activeTab === "discovered" && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="text-xs text-slate-400">
            Sources detected automatically via sitemap exploration, institutional domain heuristics, and extracted links.
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Discovered Portal</th>
                  <th className="py-3 px-3">Domain</th>
                  <th className="py-3 px-3">Inferred Type</th>
                  <th className="py-3 px-3">Trust Tier</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {discovered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <span className="font-semibold text-white block">{d.name || d.domain}</span>
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span className="truncate max-w-xs">{d.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">{d.domain}</td>
                    <td className="py-3 px-3 uppercase text-[10px] font-mono text-purple-400">
                      {d.institutionType || "Institution"}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        Tier {d.trustTier}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handlePromoteDiscovered(d.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow transition-all"
                      >
                        Promote to Active
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add New Source Modal with Instant Test Fetch Preview */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                Add Official Source to Autopilot Registry
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Source Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IIT Kharagpur Research Opportunities"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Target Portal URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://www.iitkgp.ac.in/announcements"
                    value={newSource.url}
                    onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={handleTestFetch}
                    disabled={testing}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold rounded-xl border border-slate-700 transition-all shrink-0"
                  >
                    {testing ? "Testing..." : "Test Fetch"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Source Type</label>
                  <select
                    value={newSource.sourceType}
                    onChange={(e) => setNewSource({ ...newSource, sourceType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="iit">IIT Portal</option>
                    <option value="iisc">IISc</option>
                    <option value="iiser">IISER</option>
                    <option value="nit">NIT</option>
                    <option value="university">University</option>
                    <option value="government">Government / National Lab</option>
                    <option value="corporate">Corporate Careers</option>
                    <option value="scholarship">Scholarship Trust</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Adapter Type</label>
                  <select
                    value={newSource.adapterType}
                    onChange={(e) => setNewSource({ ...newSource, adapterType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="html">HTML Resilient Adapter</option>
                    <option value="rss">RSS 2.0 Feed</option>
                    <option value="atom">Atom Feed</option>
                    <option value="json">JSON REST API</option>
                    <option value="sitemap">XML Sitemap</option>
                    <option value="pdf">PDF Circulars</option>
                    <option value="playwright">Dynamic Hydrated</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Check Frequency</label>
                  <select
                    value={newSource.checkFrequency}
                    onChange={(e) => setNewSource({ ...newSource, checkFrequency: parseInt(e.target.value, 10) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="180">Every 3 Hours</option>
                    <option value="360">Every 6 Hours</option>
                    <option value="720">Every 12 Hours</option>
                    <option value="1440">Daily (24 Hours)</option>
                    <option value="10080">Weekly</option>
                  </select>
                </div>
              </div>

              {/* Test Fetch Result Preview */}
              {testResult && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-400">
                      ✓ Fetch Succeeded (HTTP {testResult.httpStatus})
                    </span>
                    <span className="text-slate-400">
                      Items Found: <strong>{testResult.itemsCount}</strong>
                    </span>
                  </div>
                  {testResult.sampleExtraction && (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                      <span className="text-slate-400 block font-semibold">Sample Extracted Item:</span>
                      <p className="text-white font-medium">{testResult.sampleExtraction.title}</p>
                      <p className="text-slate-400">{testResult.sampleExtraction.shortSummary}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold shadow-md transition-all"
                >
                  {submitting ? "Saving..." : "Add & Schedule Source"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
