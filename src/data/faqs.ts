export interface FAQItemData {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Technical" | "Security" | "Process" | "Pricing";
}

export const faqsData: FAQItemData[] = [
  {
    id: "faq-1",
    question: "What is AI automation and how does it differ from traditional software?",
    answer: "Traditional automation relies on rigid, hardcoded rules (e.g. 'if cell A equals X, then email Y') that break whenever formats change. AI automation integrates foundation models and autonomous agents capable of semantic reasoning, computer vision, and unstructured data parsing. This allows the system to comprehend free-form customer inquiries, unstructured invoices, and messy emails, making intelligent decisions while calling your existing tools.",
    category: "General",
  },
  {
    id: "faq-2",
    question: "Do you replace our existing software (like HubSpot, Slack, or ERPs)?",
    answer: "No. Our guiding philosophy is 'Your team shouldn't be the API'. We do not ask you to migrate away from the tools your company has invested in. Instead, we build the intelligent orchestration layer that bridges your existing CRM, ERP, databases, and communication channels so data flows automatically without manual copy-pasting.",
    category: "General",
  },
  {
    id: "faq-3",
    question: "What is an AI agent, and what can it actually do?",
    answer: "Unlike a basic chatbot that only replies with text, an AI agent is goal-driven. It receives an objective, breaks it down into logical steps, chooses and executes schema-validated API tools, queries private knowledge bases, requests human approval when confidence is below your defined threshold, and records complete execution audit logs.",
    category: "Technical",
  },
  {
    id: "faq-4",
    question: "Can you deploy workflows on our own private cloud or VPC?",
    answer: "Yes. For organizations with strict compliance, SOC2, HIPAA, or data sovereignty requirements, we architect systems that run inside your private AWS, GCP, or Azure VPC. We can deploy self-hosted orchestration (such as dedicated n8n clusters) and private open-weights models (like Llama 3 or Mistral) ensuring your data never traverses public third-party APIs.",
    category: "Security",
  },
  {
    id: "faq-5",
    question: "How do you prevent hallucinations and errors in high-stakes workflows?",
    answer: "We employ defense-in-depth safety engineering: (1) Deterministic output schemas validated via Zod, (2) Grounded RAG with strict citation requirements where the model can only cite verified source documents, (3) Boundary guardrails preventing out-of-scope actions, and (4) Human-in-the-Loop review gates for any high-impact operations like contract distribution, financial transactions, or permanent record updates.",
    category: "Security",
  },
  {
    id: "faq-6",
    question: "How long does a typical implementation take?",
    answer: "Focused automation systems (such as an automated inbound lead qualification loop or customer support triage) typically launch to production in 2 to 4 weeks. Multi-department agent systems or complex enterprise RAG implementations generally require 6 to 10 weeks, encompassing architecture, security reviews, sandbox testing, and staff training.",
    category: "Process",
  },
  {
    id: "faq-7",
    question: "What happens after deployment? Do you provide maintenance and monitoring?",
    answer: "Yes. APIs evolve, third-party software updates schemas, and business workflows shift. We provide proactive monitoring, real-time error alerting, token efficiency optimization, and monthly prompt refinement sprints to ensure your automated systems continue running smoothly.",
    category: "Process",
  },
  {
    id: "faq-8",
    question: "How does pricing work?",
    answer: "Every automation system is scoped to your exact business requirements, current toolchain, and complexity. We offer three structured engagement tiers: Foundation (for focused, high-ROI single workflows), Growth (for multi-department connected agent systems), and Custom (for private enterprise infrastructure and proprietary AI builds). You can use our interactive ROI calculator or request a custom scope.",
    category: "Pricing",
  },
];
