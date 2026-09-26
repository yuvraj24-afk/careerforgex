import Link from "next/link";
import { ArrowRight, BookOpen, Download, FileCode, Layers, ShieldCheck, Terminal, Cpu } from "lucide-react";

export const metadata = {
  title: "Resources, Guides & Architecture Blueprints",
  description: "Download operational frameworks, workflow templates, security checklists, and technical documentation for enterprise AI systems.",
};

const resources = [
  {
    title: "Enterprise AI Security & Human-in-the-Loop Architecture",
    type: "Whitepaper",
    category: "Security",
    description: "A comprehensive guide to designing review queues, confidence thresholds, and audit logging for high-impact autonomous actions.",
    link: "/security",
  },
  {
    title: "Internal Systems API Architecture & Endpoint Reference",
    type: "Technical Spec",
    category: "Architecture",
    description: "Documentation of CareerForgeX internal endpoints, schemas, authentication requirements, and rate limit structures.",
    link: "/docs/api",
  },
  {
    title: "Inbound Lead Qualification & CRM Orchestration Template",
    type: "Workflow Blueprint",
    category: "Sales Automation",
    description: "Step-by-step decision graph for web form ingestion, clearbit enrichment, ICP scoring, and automated HubSpot deal creation.",
    link: "/services/sales-automation",
  },
  {
    title: "RAG Chunking & Metadata Filtering Playbook",
    type: "Engineering Guide",
    category: "Knowledge Systems",
    description: "Best practices for semantic header chunking, hybrid BM25 + dense vector indexing, and citation verification in enterprise RAG.",
    link: "/services/rag-knowledge-systems",
  },
  {
    title: "Multimodal Document Intelligence Field Extractor",
    type: "Schema Spec",
    category: "Finance & Operations",
    description: "Zod schemas and prompt templates for extracting nested tables and tax totals from vendor invoices and bills of lading.",
    link: "/demo",
  },
  {
    title: "The 8-Step Autonomous Automation Implementation Guide",
    type: "Methodology",
    category: "Process",
    description: "From discovery and process mapping to canary deployment and continuous latency monitoring.",
    link: "/how-it-works",
  },
];

export default function ResourcesPage() {
  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>KNOWLEDGE BASE & FRAMEWORKS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Systems Engineering Resources.
        </h1>
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
          Open architectural frameworks, security whitepapers, schema definitions, and workflow templates
          developed by the CareerForgeX engineering team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-dark-card border border-dark-border p-7 hover:border-brand-500/50 hover:bg-dark-elevated transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-brand-950/70 border border-brand-800/40 text-brand-400 uppercase">
                  {item.category}
                </span>
                <span className="text-gray-500">{item.type}</span>
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors mt-1">
                {item.title}
              </h2>

              <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-dark-border">
              <Link
                href={item.link}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center justify-between"
              >
                <span>Access Resource</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
