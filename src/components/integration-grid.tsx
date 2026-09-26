"use client";

import { useState } from "react";
import {
  Sparkles,
  Bot,
  Brain,
  Cpu,
  Database,
  Share2,
  Workflow,
  Zap,
  Mail,
  MessageSquare,
  CreditCard,
  Radio,
  FileCode,
} from "lucide-react";

interface IntegrationItem {
  name: string;
  category: string;
  desc: string;
  icon: any;
}

const integrations: IntegrationItem[] = [
  { name: "OpenAI GPT-4o", category: "AI Models", desc: "Multimodal reasoning & structured outputs", icon: Sparkles },
  { name: "Anthropic Claude 3.5", category: "AI Models", desc: "Long-context RAG & deep analysis", icon: Brain },
  { name: "Google Gemini 1.5", category: "AI Models", desc: "Large token windows & fast inference", icon: Cpu },
  { name: "n8n Self-Hosted", category: "Orchestration", desc: "Private on-premise execution nodes", icon: Workflow },
  { name: "Make / Integromat", category: "Orchestration", desc: "Cloud webhook pipelines", icon: Zap },
  { name: "Zapier Enterprise", category: "Orchestration", desc: "Standardized app connectors", icon: Zap },
  { name: "HubSpot CRM", category: "CRM & Sales", desc: "Bi-directional contact & deal sync", icon: Share2 },
  { name: "Salesforce REST", category: "CRM & Sales", desc: "Enterprise account orchestration", icon: Share2 },
  { name: "Slack Bolt & Webhooks", category: "Messaging", desc: "Human approval queues & real-time alerts", icon: MessageSquare },
  { name: "WhatsApp Cloud API", category: "Messaging", desc: "Conversational customer qualification", icon: MessageSquare },
  { name: "Google Workspace & M365", category: "Productivity", desc: "Smart email triage & calendar booking", icon: Mail },
  { name: "Twilio Voice & SMS", category: "Telephony", desc: "Voice AI & two-factor verifications", icon: Radio },
  { name: "Supabase & PostgreSQL", category: "Data Storage", desc: "pgvector hybrid embeddings & ledgers", icon: Database },
  { name: "Stripe Billing", category: "Payments", desc: "Subscription provisioning & invoices", icon: CreditCard },
  { name: "Notion API", category: "Knowledge", desc: "Dynamic internal SOP ingestion", icon: FileCode },
];

export function IntegrationGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "AI Models", "Orchestration", "CRM & Sales", "Messaging", "Data Storage"];

  const filtered =
    selectedCategory === "All"
      ? integrations
      : integrations.filter((i) => i.category === selectedCategory);

  return (
    <section className="py-20 lg:py-28 relative bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono mb-4">
            <Workflow className="w-3.5 h-3.5" />
            <span>CONNECTED ECOSYSTEM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Built to Work With the Tools Your Team Already Uses.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-400">
            We don't force you onto proprietary software silos. We deploy intelligent agents and
            resilient pipelines that integrate directly into your existing enterprise stack.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                    : "bg-dark-card border border-dark-border text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="p-4 rounded-xl bg-dark-card/90 border border-dark-border hover:border-brand-500/50 hover:bg-dark-elevated transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-dark-elevated group-hover:bg-brand-600/20 border border-dark-border flex items-center justify-center text-brand-400 mb-3 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-white group-hover:text-brand-300 transition-colors">
                  {item.name}
                </div>
                <span className="text-[10px] font-mono uppercase text-gray-500 block mt-0.5">
                  {item.category}
                </span>
                <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
