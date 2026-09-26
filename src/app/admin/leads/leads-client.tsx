"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit,
  X,
  Plus,
  Send,
  User,
  Building,
  Tag,
  Calendar,
} from "lucide-react";

interface LeadItem {
  id: string;
  name: string;
  email: string;
  company: string;
  website?: string | null;
  industry?: string | null;
  companySize?: string | null;
  automationGoal: string;
  currentTools?: string | null;
  budgetRange?: string | null;
  timeline?: string | null;
  notes?: string | null;
  source: string;
  status: string;
  score?: number | null;
  fitScore?: string | null;
  aiSummary?: string | null;
  isDemo: boolean;
  createdAt: any;
  bookings?: any[];
}

export function LeadsManagerClient({ initialLeads }: { initialLeads: LeadItem[] }) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [updating, setUpdating] = useState(false);
  const [newNote, setNewNote] = useState("");

  const statuses = ["All", "New", "Contacted", "Qualified", "Discovery", "Proposal", "Won", "Lost", "Archived"];

  const filtered = leads.filter((lead) => {
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    const query = search.toLowerCase();
    const matchesSearch =
      !search ||
      lead.name.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.automationGoal.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (leadId: string) => {
    if (!newNote.trim()) return;
    setUpdating(true);
    const updatedNotes = selectedLead?.notes
      ? `${selectedLead.notes}\n[${new Date().toLocaleDateString()}] ${newNote}`
      : `[${new Date().toLocaleDateString()}] ${newNote}`;

    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: updatedNotes }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, notes: updatedNotes } : l))
        );
        if (selectedLead) {
          setSelectedLead({ ...selectedLead, notes: updatedNotes });
        }
        setNewNote("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-dark-card border border-dark-border">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search prospect, company, tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                statusFilter === st
                  ? "bg-brand-600 text-white font-semibold"
                  : "bg-dark-elevated border border-dark-border text-gray-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* CRM Leads Table / Mobile Cards */}
      <div className="rounded-2xl bg-dark-card border border-dark-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-elevated/70 text-gray-400 border-b border-dark-border font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Prospect</th>
                <th className="py-3 px-4">Company & Industry</th>
                <th className="py-3 px-4">Budget / Timeline</th>
                <th className="py-3 px-4">AI Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/60">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-dark-elevated/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{lead.name}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{lead.email}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-white flex items-center gap-1.5">
                      <span>{lead.company}</span>
                      {lead.isDemo && (
                        <span className="text-[9px] font-mono px-1 rounded bg-dark-elevated text-gray-500">
                          Demo
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400">{lead.industry || "General"}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-brand-300 font-mono">{lead.budgetRange || "Not specified"}</div>
                    <div className="text-[11px] text-gray-400">{lead.timeline || "Within 30 days"}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-brand-950/80 border border-brand-800/40 text-brand-400">
                      {lead.score || 50}/100
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={lead.status}
                      disabled={updating}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                      className="px-2.5 py-1 rounded bg-dark-elevated border border-dark-border text-xs text-white focus:outline-none focus:border-brand-500"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Discovery">Discovery</option>
                      <option value="Proposal">Proposal</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="px-3 py-1 rounded-lg bg-dark-elevated hover:bg-dark-border text-xs text-white border border-dark-border transition-colors font-medium"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal / Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-dark-card border border-dark-border p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-dark-border">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase">LEAD_RECORD_ID: {selectedLead.id}</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedLead.name} • {selectedLead.company}</h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-dark-elevated border border-dark-border">
                <span className="text-gray-500 text-[10px] uppercase font-mono">Work Email</span>
                <div className="text-white font-mono mt-0.5">{selectedLead.email}</div>
              </div>
              <div className="p-3 rounded-xl bg-dark-elevated border border-dark-border">
                <span className="text-gray-500 text-[10px] uppercase font-mono">Website</span>
                <div className="text-brand-400 truncate mt-0.5">{selectedLead.website || "N/A"}</div>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-white uppercase font-mono">Automation Goal / Requirement</span>
              <p className="mt-1 p-3.5 rounded-xl bg-dark-bg border border-dark-border text-xs text-gray-200 leading-relaxed">
                {selectedLead.automationGoal}
              </p>
            </div>

            {selectedLead.aiSummary && (
              <div>
                <span className="text-xs font-semibold text-brand-400 uppercase font-mono">AI Architecture Brief</span>
                <p className="mt-1 p-3.5 rounded-xl bg-brand-950/20 border border-brand-800/40 text-xs text-gray-300 leading-relaxed">
                  {selectedLead.aiSummary}
                </p>
              </div>
            )}

            {/* Internal Notes */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-white uppercase font-mono">Internal Operator Notes</span>
              {selectedLead.notes && (
                <pre className="p-3 rounded-xl bg-dark-elevated border border-dark-border text-[11px] text-gray-300 font-mono whitespace-pre-wrap">
                  {selectedLead.notes}
                </pre>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add meeting note or qualification detail..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-dark-bg border border-dark-border text-xs text-white placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddNote(selectedLead.id)}
                  disabled={updating}
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
