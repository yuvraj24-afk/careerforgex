export interface ProcessStep {
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  duration: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery",
    tagline: "Understand the business context, objectives, and pain points.",
    description: "We conduct an in-depth operational audit with your team. We identify where repetitive tasks, manual data transfers, and communication bottlenecks are slowing down your high-value employees.",
    deliverables: ["Current Workflow Inventory", "Bottleneck & Latency Analysis", "High-ROI Automation Target List"],
    duration: "Week 1",
  },
  {
    number: "02",
    title: "Process Mapping",
    tagline: "Map repetitive workflows into structured decision logic.",
    description: "Every manual action is broken down into atomic triggers, data payloads, decisions, edge-case branches, and human approval checkpoints.",
    deliverables: ["Detailed Process Decision Trees", "Input/Output Schema Definitions", "Human Approval Boundary Matrix"],
    duration: "Week 1-2",
  },
  {
    number: "03",
    title: "Architecture & Design",
    tagline: "Choose optimal models, tools, databases, and integrations.",
    description: "We architect the technical stack: foundational LLMs (OpenAI, Claude, Gemini, or open-weights), orchestration layer (n8n or custom code), vector search databases, and security guardrails.",
    deliverables: ["Technical Architecture Blueprint", "Security & Data Governance Protocol", "API Integration Specifications"],
    duration: "Week 2",
  },
  {
    number: "04",
    title: "Build & Integration",
    tagline: "Develop the workflow, agents, and tool connectors.",
    description: "Our engineers build the pipelines, write custom tool connectors, implement strict schema validators, and integrate with your existing CRM, ERP, and messaging software.",
    deliverables: ["Agent Orchestration Pipelines", "Custom API & Webhook Connectors", "Operator Dashboard & Tracing"],
    duration: "Week 3-4",
  },
  {
    number: "05",
    title: "Test & Edge Cases",
    tagline: "Stress-test against real-world failures and edge cases.",
    description: "We subject the system to rigorous adversarial evaluations, simulated API downtime, malformed payloads, and edge cases to ensure the system fails gracefully with human fallback.",
    deliverables: ["Evaluation Benchmark Report", "Failover & Retry Validation", "Security & Prompt Injection Audit"],
    duration: "Week 4-5",
  },
  {
    number: "06",
    title: "Deploy & Train",
    tagline: "Move into production with zero disruption to daily work.",
    description: "We deploy the systems to your production environment (cloud or private VPC) with canary cutovers, conduct hands-on operator training, and configure live alerting.",
    deliverables: ["Production System Cutover", "Operator Video Guides & SOPs", "Live Monitoring & Alert Channels"],
    duration: "Week 5",
  },
  {
    number: "07",
    title: "Monitor & Observe",
    tagline: "Track executions, errors, token latency, and quality.",
    description: "Every automated execution is traced in real time. We monitor latency, error rates, tool call successes, and human review frequency through centralized telemetry.",
    deliverables: ["Real-time Observability Dashboard", "Weekly Health Reports", "Automated Error Escalation"],
    duration: "Continuous",
  },
  {
    number: "08",
    title: "Optimize & Evolve",
    tagline: "Improve prompts, workflows, and model efficiencies.",
    description: "As your business grows and foundation models evolve, we continuously refine prompts, update API schemas, and optimize token usage to lower costs and expand capabilities.",
    deliverables: ["Monthly Model & Prompt Upgrades", "Throughput Optimization Sprints", "SaaS Feature Expansions"],
    duration: "Ongoing Partnership",
  },
];
