"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowRight, Loader2, Sparkles, Shield } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    industry: "Technology / SaaS",
    companySize: "11-50",
    automationGoal: "",
    currentTools: "",
    expectedTimeline: "Within 30 days",
    budgetRange: "$10k - $25k",
    additionalDetails: "",
    consent: true,
    _gotcha: "", // Honeypot
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    leadId: string;
    leadSummary?: string;
    recommendedService?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.company || !formData.automationGoal) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!formData.consent) {
      setError("Please consent to communications regarding your audit request.");
      return;
    }

    setLoading(true);
    trackEvent("contact_started", { company: formData.company });

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          website: formData.website,
          industry: formData.industry,
          companySize: formData.companySize,
          automationGoal: formData.automationGoal,
          currentTools: formData.currentTools,
          timeline: formData.expectedTimeline,
          budgetRange: formData.budgetRange,
          notes: formData.additionalDetails,
          _gotcha: formData._gotcha,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      setSuccessResult({
        leadId: data.leadId,
        leadSummary: data.leadSummary,
        recommendedService: data.recommendedService,
      });

      trackEvent("contact_submitted", { leadId: data.leadId });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Your information wasn't submitted. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (successResult) {
    return (
      <div className="rounded-2xl bg-dark-card border border-emerald-500/40 p-8 lg:p-10 shadow-2xl space-y-6 animate-in fade-in duration-300">
        <div className="w-12 h-12 rounded-xl bg-emerald-950/70 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div>
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
            REQUEST ACKNOWLEDGED • REF: {successResult.leadId.slice(0, 10)}
          </span>
          <h3 className="text-2xl font-bold text-white mt-1">
            Your automation audit request has been received.
          </h3>
          <p className="text-sm text-gray-300 mt-2 leading-relaxed">
            Our systems architecture team is evaluating your current workflow inputs and tool requirements.
            A preliminary architectural brief will be prepared before our initial conversation.
          </p>
        </div>

        {successResult.recommendedService && (
          <div className="p-4 rounded-xl bg-dark-elevated border border-dark-border text-xs space-y-1">
            <span className="font-mono text-brand-400 text-[10px] uppercase">Preliminary Architecture Match:</span>
            <div className="text-white font-semibold">{successResult.recommendedService}</div>
            {successResult.leadSummary && (
              <p className="text-gray-400 mt-1">{successResult.leadSummary}</p>
            )}
          </div>
        )}

        <div className="p-4 rounded-xl bg-dark-elevated/70 border border-dark-border space-y-3">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            What Happens Next:
          </h4>
          <ol className="text-xs text-gray-300 space-y-2 list-decimal list-inside leading-relaxed">
            <li>We review your tech stack and automation goals within 4 business hours.</li>
            <li>We draft a tailored node & agent workflow canvas for your team.</li>
            <li>You can fast-track the review by picking a convenient time slot on our calendar below.</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/book"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-brand-600/30 transition-all"
          >
            <span>Schedule Systems Discovery Call</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-dark-elevated hover:bg-dark-border text-gray-300 text-xs sm:text-sm font-medium transition-colors"
          >
            <span>Explore Live Demos</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-dark-card border border-dark-border p-6 lg:p-10 shadow-2xl space-y-6">
      {/* Honeypot hidden input */}
      <input
        type="text"
        name="_gotcha"
        value={formData._gotcha}
        onChange={(e) => setFormData({ ...formData, _gotcha: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Row 1: Name & Work Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Full Name <span className="text-brand-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Elena Rostova"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Work Email <span className="text-brand-400">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="elena@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Row 2: Company & Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Company Name <span className="text-brand-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Acme Global Logistics"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Company Website
          </label>
          <input
            type="url"
            placeholder="https://company.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Row 3: Industry & Size */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">Industry</label>
          <select
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
          >
            <option>Technology / SaaS</option>
            <option>E-Commerce & Retail</option>
            <option>Real Estate & PropTech</option>
            <option>Healthcare & Life Sciences</option>
            <option>Financial Services</option>
            <option>Manufacturing & Supply Chain</option>
            <option>Education & EdTech</option>
            <option>Agencies & Professional Services</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">Company Size</label>
          <select
            value={formData.companySize}
            onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
          >
            <option>1-10 employees</option>
            <option>11-50 employees</option>
            <option>51-200 employees</option>
            <option>201-500 employees</option>
            <option>500+ employees</option>
          </select>
        </div>
      </div>

      {/* Row 4: What do you want to automate? */}
      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1.5">
          What business process do you want to automate? <span className="text-brand-400">*</span>
        </label>
        <textarea
          required
          rows={3}
          placeholder="Describe the repetitive workflow, where manual hours are currently spent, and what tools are involved (e.g. carrier invoice extraction, lead qualification, ticket triage)..."
          value={formData.automationGoal}
          onChange={(e) => setFormData({ ...formData, automationGoal: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors leading-relaxed"
        />
      </div>

      {/* Row 5: Current Tools */}
      <div>
        <label className="block text-xs font-medium text-gray-300 mb-1.5">
          Current Software Tools Involved
        </label>
        <input
          type="text"
          placeholder="e.g. HubSpot, Salesforce, Slack, SAP, QuickBooks, Gmail, Notion"
          value={formData.currentTools}
          onChange={(e) => setFormData({ ...formData, currentTools: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
        />
      </div>

      {/* Row 6: Timeline & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">Expected Timeline</label>
          <select
            value={formData.expectedTimeline}
            onChange={(e) => setFormData({ ...formData, expectedTimeline: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
          >
            <option>Immediately</option>
            <option>Within 30 days</option>
            <option>1-3 months</option>
            <option>Exploring / Feasibility research</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">Project Scope / Budget Range</label>
          <select
            value={formData.budgetRange}
            onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
          >
            <option>$5k - $10k (Focused single workflow)</option>
            <option>$10k - $25k (Multi-workflow system)</option>
            <option>$25k - $50k+ (Enterprise custom build)</option>
            <option>Need help scoping</option>
          </select>
        </div>
      </div>

      {/* Consent Checkbox */}
      <div className="flex items-start gap-2.5 pt-2">
        <input
          type="checkbox"
          id="consent"
          checked={formData.consent}
          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
          className="mt-0.5 accent-brand-500 cursor-pointer w-4 h-4"
        />
        <label htmlFor="consent" className="text-xs text-gray-400 cursor-pointer leading-relaxed">
          I agree to have CareerForgeX analyze this operational requirements submission and contact me regarding system architecture and scoping.
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-brand-600/30 transition-all hover:shadow-brand-500/50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing Requirements & Scoring Pipeline...</span>
          </>
        ) : (
          <>
            <span>Request Automation Audit</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 font-mono">
        <Shield className="w-3.5 h-3.5 text-accent-cyan" />
        <span>Strict Confidentiality • No third-party data sales • SOC2-conscious</span>
      </div>
    </form>
  );
}
