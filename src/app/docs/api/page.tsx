import Link from "next/link";
import { Terminal, Code2, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "API Architecture & Endpoints Documentation",
  description: "Comprehensive documentation of CareerForgeX internal API endpoints, schemas, authentication, and error codes.",
};

const endpoints = [
  {
    method: "POST",
    path: "/api/leads",
    auth: "Public (Honeypot + Rate Limited)",
    desc: "Ingests structured prospective lead requirements, triggers automated AI scoring, persists to database, and dispatches notification emails.",
    request: `{
  "name": "Elena Rostova",
  "email": "elena@company.com",
  "company": "Apex Global Logistics",
  "automationGoal": "Automate carrier invoice reconciliation from PDFs",
  "currentTools": "SAP, Excel, Slack",
  "budgetRange": "$10k - $25k",
  "timeline": "Within 30 days"
}`,
    response: `{
  "success": true,
  "leadId": "clx891024",
  "leadSummary": "High-fit opportunity for Document Intelligence pipeline...",
  "recommendedService": "Document Intelligence & OCR"
}`,
  },
  {
    method: "POST",
    path: "/api/bookings",
    auth: "Public (Rate Limited)",
    desc: "Reserves a 30-minute systems architecture discovery video call with slot validation and email confirmation.",
    request: `{
  "name": "Marcus Vance",
  "email": "marcus@vanceprop.com",
  "company": "Vance Commercial Realty",
  "date": "2026-10-02",
  "time": "14:00",
  "timezone": "America/New_York",
  "notes": "Discussing WhatsApp qualification agent"
}`,
    response: `{
  "success": true,
  "bookingId": "bk_901842",
  "meetingLink": "https://meet.careerforgex.com/audit-901842"
}`,
  },
  {
    method: "POST",
    path: "/api/demo/lead-score",
    auth: "Public (Demo Sandbox)",
    desc: "Evaluates lead intent, calculates ICP fit score, and generates a personalized outreach email draft.",
    request: `{
  "name": "Dr. Sarah Chen",
  "company": "Novas BioAnalytics",
  "email": "schen@novas.org",
  "message": "Private internal RAG knowledge base for clinical protocols"
}`,
    response: `{
  "success": true,
  "mode": "Interactive Demo",
  "data": {
    "score": 94,
    "potentialPriority": "High",
    "recommendedService": "Private VPC RAG & Knowledge Systems",
    "automationComplexity": "Enterprise (6+ weeks)"
  }
}`,
  },
  {
    method: "POST",
    path: "/api/webhooks/n8n",
    auth: "HMAC-SHA256 (X-CFX-Signature Header)",
    desc: "Inbound event listener from self-hosted or cloud n8n orchestrators.",
    request: `{
  "event": "workflow.execution_completed",
  "data": {
    "workflowId": "wf_sales_01",
    "status": "success",
    "recordsProcessed": 14
  }
}`,
    response: `{
  "success": true,
  "receivedAt": "2026-09-26T12:00:00Z",
  "event": "workflow.execution_completed"
}`,
  },
  {
    method: "GET",
    path: "/api/health",
    auth: "Public",
    desc: "Returns operational health of all underlying services, database latency, and environment status.",
    request: "No request body required",
    response: `{
  "status": "healthy",
  "environment": "production",
  "timestamp": "2026-09-26T12:00:00Z",
  "services": {
    "database": { "status": "operational", "latencyMs": 14 },
    "aiOrchestrator": { "status": "operational", "mode": "demo" }
  }
}`,
  },
];

export default function ApiDocsPage() {
  return (
    <div className="py-16 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>DEVELOPER & API REFERENCE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">API Architecture</h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Programmatic interface documentation for webhook handlers, requirement capture, and execution triggers.
        </p>
      </div>

      <div className="space-y-8">
        {endpoints.map((ep, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-border pb-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className={`px-2 py-0.5 rounded font-bold ${ep.method === "POST" ? "bg-brand-900/60 text-brand-300 border border-brand-700/50" : "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50"}`}>
                  {ep.method}
                </span>
                <span className="text-white font-semibold">{ep.path}</span>
              </div>
              <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-accent-cyan" />
                {ep.auth}
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">{ep.desc}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase">Sample Request:</span>
                <pre className="p-3 rounded-xl bg-dark-bg border border-dark-border overflow-x-auto text-[11px] text-gray-300">
                  {ep.request}
                </pre>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase">Sample 200 Response:</span>
                <pre className="p-3 rounded-xl bg-dark-bg border border-dark-border overflow-x-auto text-[11px] text-emerald-400">
                  {ep.response}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
