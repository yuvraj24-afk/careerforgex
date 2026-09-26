import Link from "next/link";
import { ROICalculator } from "@/components/roi-calculator";
import { ArrowRight, CheckCircle2, Shield, Layers, HelpCircle, Calculator } from "lucide-react";

export const metadata = {
  title: "Pricing & Engagement Scoping",
  description: "Transparent, scoped engagement tiers for AI automation: Foundation, Growth, and Custom enterprise infrastructure.",
};

const tiers = [
  {
    name: "Foundation",
    tagline: "For focused, single-workflow automation projects.",
    description: "Ideal for teams with one acute operational bottleneck—such as inbound lead qualification, customer ticket triage, or invoice PDF extraction.",
    deliverables: [
      "1 Core End-to-End Autonomous Pipeline",
      "Up to 3 Software Tool Integrations (CRM, Slack, Email)",
      "Strict Zod Schema Validation & Guardrails",
      "Human-in-the-Loop Operator Review Interface",
      "Standard Latency & Error Alerting",
      "Full Operator Video SOP Documentation",
    ],
    idealFor: "Startups & SMBs looking for immediate capacity gains.",
    cta: "Request Foundation Scope",
  },
  {
    name: "Growth",
    tagline: "For multi-department connected automation systems.",
    description: "Architected for scaling businesses ready to connect Sales, Support, and Operations into unified, event-driven pipelines with autonomous agents.",
    popular: true,
    deliverables: [
      "3-5 Interconnected Workflow Pipelines",
      "Cross-Department Orchestration (Sales + Support + Ops)",
      "Dedicated Self-Hosted or Cloud n8n Infrastructure",
      "Grounded RAG Knowledge Base with Verified Citations",
      "Real-time Telemetry & Telemetry Dashboard",
      "Bi-Weekly Prompt Evaluation & Drift Optimization",
    ],
    idealFor: "Scaleups and 50+ employee organizations removing cross-tool friction.",
    cta: "Request Growth Scope",
  },
  {
    name: "Custom Enterprise",
    tagline: "For proprietary AI infrastructure and private cloud deployment.",
    description: "Engineered for organizations with strict compliance, SOC2, HIPAA, or on-premise security requirements needing bespoke model architectures.",
    deliverables: [
      "Private VPC Deployment (AWS / GCP / Azure or On-Prem)",
      "Open-Weights Model Fine-Tuning (Llama 3 / Mistral)",
      "Hybrid pgvector Database with Enterprise RBAC",
      "Air-Gapped Compliance & BAA Compatibility",
      "Dedicated Engineering Pod with 99.9% SLA",
      "Complete Source Code & Architecture Ownership",
    ],
    idealFor: "Healthcare, Financial Institutions, and Enterprise Engineering teams.",
    cta: "Request Enterprise Scope",
  },
];

export default function PricingPage() {
  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>TRANSPARENT SCOPING</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Every System Is Scoped to Your Business.
        </h1>
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
          We do not force you into opaque subscriptions or arbitrary user seats. We scope engagements
          around the specific pipelines, tool APIs, and security guardrails your operations require.
        </p>
      </div>

      {/* Engagement Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-2xl p-8 flex flex-col justify-between transition-all relative ${
              tier.popular
                ? "bg-dark-card border-2 border-brand-500 shadow-2xl shadow-brand-500/15"
                : "bg-dark-card border border-dark-border"
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-600 text-white font-mono text-[10px] uppercase font-semibold">
                Most Popular
              </span>
            )}

            <div>
              <h2 className="text-2xl font-bold text-white">{tier.name}</h2>
              <p className="text-xs text-brand-400 font-mono mt-1">{tier.tagline}</p>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">{tier.description}</p>

              <div className="mt-6 pt-6 border-t border-dark-border space-y-2.5">
                <span className="text-[10px] font-mono uppercase text-gray-500 tracking-wider">
                  Included Engineering Deliverables:
                </span>
                <ul className="space-y-2 text-xs text-gray-300">
                  {tier.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-dark-border space-y-3">
              <div className="text-[11px] text-gray-400 italic">
                <strong>Best suited for:</strong> {tier.idealFor}
              </div>
              <Link
                href="/book"
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  tier.popular
                    ? "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30"
                    : "bg-dark-elevated hover:bg-dark-border text-white border border-dark-border"
                }`}
              >
                <span>{tier.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ROI & Capacity Calculator */}
      <div className="pt-8">
        <ROICalculator />
      </div>

      {/* FAQ Callout */}
      <div className="p-8 rounded-2xl bg-dark-card border border-dark-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white">Have questions on pricing structure or maintenance?</h3>
          <p className="text-xs text-gray-400 mt-1">
            Check out our detailed FAQ covering implementation timelines, hosting costs, and ongoing optimization.
          </p>
        </div>
        <Link
          href="/faq"
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg bg-dark-elevated hover:bg-dark-border text-gray-200 text-xs font-semibold border border-dark-border shrink-0 transition-colors"
        >
          <span>View Pricing FAQs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
