"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Bot,
  FileText,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Upload,
  RefreshCw,
  Copy,
  Check,
  Shield,
  Zap,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<"lead" | "support" | "document" | "email">("lead");

  // Demo 1: Lead Qualification State
  const [leadInput, setLeadInput] = useState({
    name: "Marcus Vance",
    company: "Vance Commercial Realty",
    email: "marcus@vancerealty-demo.com",
    website: "https://vancerealty-demo.com",
    message: "We need an inbound qualification agent that engages weekend buyer inquiries via WhatsApp and schedules property showings on agent calendars.",
    currentTools: "HubSpot, Gmail, WhatsApp Business",
  });
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadResult, setLeadResult] = useState<any>(null);

  // Demo 2: Support Assistant State
  const [supportInput, setSupportInput] = useState("What is your refund policy if our shipment was delayed by the freight carrier?");
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportResult, setSupportResult] = useState<any>(null);

  // Demo 3: Document Extraction State
  const [docFile, setDocFile] = useState<File | null>(null);
  const [selectedSampleDoc, setSelectedSampleDoc] = useState<string>("sample-carrier-invoice.pdf");
  const [docStage, setDocStage] = useState<"idle" | "uploading" | "processing" | "extracting" | "complete">("idle");
  const [docResult, setDocResult] = useState<any>(null);

  // Demo 4: Email Automation State
  const [emailInput, setEmailInput] = useState(
    "Hi CareerForgeX team,\n\nWe are looking to automate our monthly carrier invoice audits. We receive about 450 PDF freight bills a month and our accounting team is spending 20 hours a week typing line items into NetSuite.\n\nCan you share what the typical timeline and pricing looks like for this?\n\nBest,\nElena Rostova\nVP Operations, Apex Logistics"
  );
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailResult, setEmailResult] = useState<any>(null);

  // Handlers
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadLoading(true);
    trackEvent("demo_started", { type: "lead_score" });
    try {
      const res = await fetch("/api/demo/lead-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadInput),
      });
      const data = await res.json();
      setLeadResult(data.data);
      trackEvent("demo_completed", { type: "lead_score" });
    } catch (err) {
      console.error(err);
    } finally {
      setLeadLoading(false);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupportLoading(true);
    trackEvent("demo_started", { type: "support" });
    try {
      const res = await fetch("/api/demo/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: supportInput }),
      });
      const data = await res.json();
      setSupportResult(data.data);
      trackEvent("demo_completed", { type: "support" });
    } catch (err) {
      console.error(err);
    } finally {
      setSupportLoading(false);
    }
  };

  const handleDocProcess = async () => {
    setDocStage("uploading");
    trackEvent("demo_started", { type: "document" });

    // Step animation through stages
    setTimeout(() => setDocStage("processing"), 400);
    setTimeout(() => setDocStage("extracting"), 800);

    try {
      let res;
      if (docFile) {
        const formData = new FormData();
        formData.append("file", docFile);
        res = await fetch("/api/demo/document", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/demo/document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: selectedSampleDoc, fileSize: 184000 }),
        });
      }
      const data = await res.json();
      setTimeout(() => {
        setDocResult(data.data);
        setDocStage("complete");
        trackEvent("demo_completed", { type: "document" });
      }, 1200);
    } catch (err) {
      console.error(err);
      setDocStage("idle");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    trackEvent("demo_started", { type: "email" });
    try {
      const res = await fetch("/api/demo/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent: emailInput }),
      });
      const data = await res.json();
      setEmailResult(data.data);
      trackEvent("demo_completed", { type: "email" });
    } catch (err) {
      console.error(err);
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INTERACTIVE CAPABILITY PLAYGROUND</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Experience Autonomous Business AI in Action.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-400">
          Test real operational tasks: inbound lead qualification, citation-grounded customer support,
          multimodal document OCR, and automated email classification.
        </p>

        {/* Demo Mode Notice */}
        <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-card border border-dark-border text-xs font-mono text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Running in Interactive Demo Mode (Simulated deterministic models with zero API keys required)</span>
        </div>
      </div>

      {/* Demo Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
        {[
          { id: "lead", label: "01. Lead Qualification", icon: Bot },
          { id: "support", label: "02. Support Assistant", icon: Zap },
          { id: "document", label: "03. Document Extraction", icon: FileText },
          { id: "email", label: "04. Email Triage", icon: Mail },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30 scale-102"
                  : "bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:bg-dark-elevated"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Playground Surface */}
      <div className="rounded-2xl bg-dark-card/90 border border-dark-border p-6 lg:p-10 shadow-2xl backdrop-blur-xl">
        {/* ============================================================ */}
        {/* DEMO 1: LEAD QUALIFICATION */}
        {/* ============================================================ */}
        {activeTab === "lead" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            {/* Input Form */}
            <form onSubmit={handleLeadSubmit} className="lg:col-span-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Inbound Lead Qualification</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  The agent crawls company details, evaluates ICP fit score, and drafts personalized outreach.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={leadInput.name}
                    onChange={(e) => setLeadInput({ ...leadInput, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1">Company</label>
                  <input
                    type="text"
                    value={leadInput.company}
                    onChange={(e) => setLeadInput({ ...leadInput, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">Automation Requirement</label>
                <textarea
                  rows={3}
                  value={leadInput.message}
                  onChange={(e) => setLeadInput({ ...leadInput, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">Current Tech Stack</label>
                <input
                  type="text"
                  value={leadInput.currentTools}
                  onChange={(e) => setLeadInput({ ...leadInput, currentTools: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={leadLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-brand-600/30 transition-all"
              >
                {leadLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                <span>{leadLoading ? "Scoring & Enriching Lead..." : "Analyze & Score Lead"}</span>
              </button>
            </form>

            {/* Results Output */}
            <div className="lg:col-span-6 rounded-xl bg-dark-elevated border border-dark-border p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-dark-border text-xs">
                <span className="font-mono text-gray-400">STRUCTURED_OUTPUT</span>
                {leadResult && (
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-mono text-[10px]">
                    Fit Score: {leadResult.score}/100
                  </span>
                )}
              </div>

              {!leadResult && !leadLoading ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  Click "Analyze & Score Lead" to execute qualification model.
                </div>
              ) : leadLoading ? (
                <div className="py-12 text-center text-xs text-gray-400 space-y-3">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-400" />
                  <p>Decomposing company footprint and computing fit score...</p>
                </div>
              ) : (
                <div className="space-y-3 text-xs animate-in fade-in duration-200">
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Analysis Summary:</span>
                    <p className="text-gray-300 mt-0.5 leading-relaxed">{leadResult.leadSummary}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dark-border">
                    <div className="p-2.5 rounded bg-dark-bg border border-dark-border">
                      <span className="text-[10px] font-mono text-gray-500">Priority:</span>
                      <div className="text-emerald-400 font-bold mt-0.5">{leadResult.potentialPriority}</div>
                    </div>
                    <div className="p-2.5 rounded bg-dark-bg border border-dark-border">
                      <span className="text-[10px] font-mono text-gray-500">Complexity:</span>
                      <div className="text-brand-300 font-bold mt-0.5">{leadResult.automationComplexity}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-dark-bg border border-dark-border">
                    <span className="text-[10px] font-mono text-gray-500">Recommended Next Step:</span>
                    <div className="text-white font-medium mt-0.5">{leadResult.recommendedNextAction}</div>
                  </div>

                  <div className="pt-2 border-t border-dark-border">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Generated Outreach Email:</span>
                    <pre className="mt-1 p-3 rounded bg-dark-bg border border-dark-border font-mono text-[11px] text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {leadResult.suggestedOutreachEmail}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* DEMO 2: SUPPORT ASSISTANT */}
        {/* ============================================================ */}
        {activeTab === "support" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            <form onSubmit={handleSupportSubmit} className="lg:col-span-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">AI Customer Support Resolution</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Queries indexed company SOPs with guaranteed citations and human escalation triggers.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">
                  Customer Query or Message
                </label>
                <textarea
                  rows={4}
                  value={supportInput}
                  onChange={(e) => setSupportInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white"
                />
              </div>

              {/* Sample Quick Questions */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="text-gray-500 font-mono">Try Samples:</span>
                <button
                  type="button"
                  onClick={() => setSupportInput("Where is my order CFX-8819 and how do I change shipping?")}
                  className="px-2 py-0.5 rounded bg-dark-elevated text-gray-300 hover:text-white border border-dark-border"
                >
                  Order Status
                </button>
                <button
                  type="button"
                  onClick={() => setSupportInput("We are seeing a 500 error validating webhook signatures. What causes this?")}
                  className="px-2 py-0.5 rounded bg-dark-elevated text-gray-300 hover:text-white border border-dark-border"
                >
                  API Technical Error
                </button>
              </div>

              <button
                type="submit"
                disabled={supportLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-brand-600/30 transition-all"
              >
                {supportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>{supportLoading ? "Retrieving Knowledge & Drafting Answer..." : "Resolve Query"}</span>
              </button>
            </form>

            <div className="lg:col-span-6 rounded-xl bg-dark-elevated border border-dark-border p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-dark-border text-xs">
                <span className="font-mono text-gray-400">GROUNDED_RESOLUTION</span>
                {supportResult && (
                  <span className="px-2 py-0.5 rounded bg-brand-950/60 border border-brand-800/40 text-brand-400 font-mono text-[10px]">
                    Confidence: {supportResult.confidenceScore}%
                  </span>
                )}
              </div>

              {!supportResult && !supportLoading ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  Enter a customer inquiry to test knowledge retrieval.
                </div>
              ) : supportLoading ? (
                <div className="py-12 text-center text-xs text-gray-400 space-y-3">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-400" />
                  <p>Searching policy vectors and verifying citations...</p>
                </div>
              ) : (
                <div className="space-y-3 text-xs animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-lg bg-dark-bg border border-dark-border leading-relaxed text-gray-200">
                    {supportResult.answer}
                  </div>

                  <div className="pt-2 border-t border-dark-border space-y-2">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Verified Citations:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {supportResult.sources.map((src: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-dark-bg border border-dark-border font-mono text-[10px] text-accent-cyan">
                          📄 {src}
                        </span>
                      ))}
                    </div>
                  </div>

                  {supportResult.escalationRequired && (
                    <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs">
                      <strong>⚠️ Escalation Flagged:</strong> {supportResult.escalationReason}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* DEMO 3: DOCUMENT INTELLIGENCE */}
        {/* ============================================================ */}
        {activeTab === "document" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Document Intelligence & OCR</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Converts PDF invoices, purchase orders, and receipts into verified structured JSON.
                </p>
              </div>

              {/* Sample Document Picker */}
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1.5">
                  Select a Sample Document or Upload Your Own
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: "carrier-invoice.pdf", label: "Carrier Invoice" },
                    { name: "purchase-order.pdf", label: "Purchase Order" },
                    { name: "vendor-nda.pdf", label: "Vendor NDA" },
                  ].map((doc) => (
                    <button
                      type="button"
                      key={doc.name}
                      onClick={() => {
                        setSelectedSampleDoc(doc.name);
                        setDocFile(null);
                      }}
                      className={`p-2.5 rounded-lg border text-xs text-center transition-all ${
                        selectedSampleDoc === doc.name && !docFile
                          ? "bg-brand-600 border-brand-500 text-white shadow-sm"
                          : "bg-dark-elevated border-dark-border text-gray-400 hover:text-white"
                      }`}
                    >
                      <FileText className="w-4 h-4 mx-auto mb-1" />
                      <span className="block truncate">{doc.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="p-6 rounded-xl bg-dark-elevated/70 border border-dashed border-dark-border hover:border-brand-500 text-center transition-colors">
                <Upload className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                <p className="text-xs font-medium text-gray-300">
                  {docFile ? docFile.name : "Drag & drop PDF / PNG / JPG or choose file"}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">Maximum file size 10MB • Ephemeral memory processing</p>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setDocFile(e.target.files[0]);
                    }
                  }}
                  className="mt-3 text-xs text-gray-400 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-dark-card file:text-gray-300 cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={handleDocProcess}
                disabled={docStage !== "idle" && docStage !== "complete"}
                className="w-full py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-brand-600/30 transition-all"
              >
                {docStage !== "idle" && docStage !== "complete" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Document ({docStage})...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Extract Structured Data</span>
                  </>
                )}
              </button>
            </div>

            {/* Structured JSON Output */}
            <div className="lg:col-span-6 rounded-xl bg-dark-elevated border border-dark-border p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-dark-border text-xs">
                <span className="font-mono text-gray-400">EXTRACTED_FIELDS</span>
                {docResult && (
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-mono text-[10px]">
                    OCR Confidence: {docResult.confidenceScore}%
                  </span>
                )}
              </div>

              {!docResult && docStage === "idle" ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  Select a sample document and click "Extract Structured Data".
                </div>
              ) : docStage !== "complete" && docStage !== "idle" ? (
                <div className="py-12 text-center text-xs text-gray-400 space-y-3">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-400" />
                  <p className="capitalize font-mono">Stage: {docStage}...</p>
                </div>
              ) : (
                <div className="space-y-3 text-xs animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded bg-dark-bg border border-dark-border">
                      <span className="text-[10px] font-mono text-gray-500">Document Type:</span>
                      <div className="text-white font-semibold mt-0.5">{docResult.documentType}</div>
                    </div>
                    <div className="p-2.5 rounded bg-dark-bg border border-dark-border">
                      <span className="text-[10px] font-mono text-gray-500">Reference Number:</span>
                      <div className="text-brand-300 font-mono font-semibold mt-0.5">{docResult.referenceNumber}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-dark-bg border border-dark-border">
                    <span className="text-[10px] font-mono text-gray-500">Counterparty / Vendor:</span>
                    <div className="text-white font-semibold mt-0.5">{docResult.company}</div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Extracted Key-Value Schema:</span>
                    <pre className="mt-1 p-3 rounded bg-dark-bg border border-dark-border font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed">
                      {JSON.stringify(docResult.extractedFields, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* DEMO 4: EMAIL TRIAGE & AUTOMATION */}
        {/* ============================================================ */}
        {activeTab === "email" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            <form onSubmit={handleEmailSubmit} className="lg:col-span-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Email Inbox Triage & Classification</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Classifies high-volume inboxes into Sales, Support, Finance, or Spam, and proposes next actions.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1">
                  Incoming Raw Email Content
                </label>
                <textarea
                  rows={6}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white leading-relaxed font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={emailLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-brand-600/30 transition-all"
              >
                {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                <span>{emailLoading ? "Classifying & Generating Response..." : "Classify & Propose Action"}</span>
              </button>
            </form>

            <div className="lg:col-span-6 rounded-xl bg-dark-elevated border border-dark-border p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-dark-border text-xs">
                <span className="font-mono text-gray-400">TRIAGE_EVALUATION</span>
                {emailResult && (
                  <span className="px-2 py-0.5 rounded bg-brand-950/60 border border-brand-800/40 text-brand-300 font-mono text-[10px]">
                    Category: {emailResult.classification}
                  </span>
                )}
              </div>

              {!emailResult && !emailLoading ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  Click "Classify & Propose Action" to evaluate the inbox message.
                </div>
              ) : emailLoading ? (
                <div className="py-12 text-center text-xs text-gray-400 space-y-3">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-400" />
                  <p>Analyzing sentiment, urgency, and routing rules...</p>
                </div>
              ) : (
                <div className="space-y-3 text-xs animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded bg-dark-bg border border-dark-border">
                      <span className="text-[10px] font-mono text-gray-500">Urgency:</span>
                      <div className="text-emerald-400 font-bold mt-0.5">{emailResult.urgency}</div>
                    </div>
                    <div className="p-2.5 rounded bg-dark-bg border border-dark-border">
                      <span className="text-[10px] font-mono text-gray-500">Sentiment:</span>
                      <div className="text-white font-bold mt-0.5">{emailResult.sentiment}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-dark-bg border border-dark-border">
                    <span className="text-[10px] font-mono text-gray-500">Suggested Action:</span>
                    <div className="text-white font-medium mt-0.5">{emailResult.suggestedAction}</div>
                  </div>

                  <div className="pt-2 border-t border-dark-border">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Suggested Reply Draft:</span>
                    <pre className="mt-1 p-3 rounded bg-dark-bg border border-dark-border font-mono text-[11px] text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {emailResult.draftedResponse}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Discovery CTA Banner */}
      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-brand-950/40 via-dark-card to-dark-elevated border border-brand-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white">Ready to deploy these systems on your business data?</h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            We build and integrate these exact models into your HubSpot, Slack, ERP, and databases.
          </p>
        </div>

        <Link
          href="/book"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-brand-600/30 transition-all shrink-0"
        >
          <span>Book a Free Automation Audit</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
