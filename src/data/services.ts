export interface ServiceDetail {
  slug: string;
  title: string;
  shortDescription: string;
  heroTagline: string;
  whatItSolves: string[];
  whoItsFor: string[];
  howItWorks: { step: string; title: string; desc: string }[];
  workflowExample: {
    trigger: string;
    agentRole: string;
    tools: string[];
    decision: string;
    humanApproval: string;
    output: string;
  };
  features: string[];
  technologies: string[];
  securityMeasures: string[];
  implementationProcess: string[];
  expectedOutcomes: string[];
}

export const servicesData: ServiceDetail[] = [
  {
    slug: "ai-agents",
    title: "AI Agents",
    shortDescription: "Autonomous AI workers that reason through multi-step business tasks and use connected tools.",
    heroTagline: "Autonomous workers that don't just answer questions—they reason, use tools, call APIs, and execute complex workflows.",
    whatItSolves: [
      "Eliminating manual human handoffs between disparate enterprise systems.",
      "Handling ambiguous business inputs that traditional static scripts fail on.",
      "Executing multi-step operations that require reasoning, context lookup, and tool orchestration.",
      "Scaling operational execution without linear headcount expansion.",
    ],
    whoItsFor: [
      "Fast-growing scaleups drowning in cross-tool operational overhead.",
      "Enterprise teams looking to augment knowledge workers with autonomous digital coworkers.",
      "Operations teams managing repetitive decision trees across CRMs, ERPs, and databases.",
    ],
    howItWorks: [
      { step: "01", title: "Objective Definition", desc: "Define explicit agent goals, state models, allowed tools, and escalation criteria." },
      { step: "02", title: "Tool Registry Connection", desc: "Equip the agent with verified schema-validated APIs (CRM, SQL, Slack, Email, Docs)." },
      { step: "03", title: "Guardrails & Memory", desc: "Implement deterministic safety boundaries, session persistence, and PII filters." },
      { step: "04", title: "Human Review Gate", desc: "Introduce conditional checkpoints where high-impact actions require operator sign-off." },
    ],
    workflowExample: {
      trigger: "High-value enterprise lead books through the website",
      agentRole: "Autonomous Sales Research Agent",
      tools: ["Domain Crawler", "LinkedIn/Company Intelligence API", "HubSpot CRM", "Slack"],
      decision: "Is company headcount > 100 and utilizing compatible software?",
      humanApproval: "Account Executive reviews tailored briefing document before initial dispatch",
      output: "Deal enriched in CRM, custom account dossier posted to Slack #enterprise-deals",
    },
    features: [
      "Multi-agent orchestration and specialized role handoffs",
      "Dynamic tool calling with strict Zod schema validation",
      "Stateful long-term memory and session recovery",
      "Human-in-the-loop review queues and approval gates",
      "Full execution tracing, latency profiling, and audit logging",
    ],
    technologies: ["OpenAI GPT-4o", "Anthropic Claude 3.5 Sonnet", "LangGraph", "n8n", "PostgreSQL", "Redis"],
    securityMeasures: [
      "Strict allowlisted tool boundaries—agents cannot execute arbitrary HTTP calls",
      "Role-based access control (RBAC) ensuring agents only access authorized tenant data",
      "All prompts and model inputs scrubbed for sensitive PII",
    ],
    implementationProcess: [
      "Week 1: Process decomposition and tool dependency mapping",
      "Week 2: Agent graph architecture, tool integration, and mock simulations",
      "Week 3: Sandbox testing with edge-case evaluation and guardrail tuning",
      "Week 4: Production cutover with operator dashboard and telemetry",
    ],
    expectedOutcomes: [
      "Designed to reduce manual operational handoffs and eliminate repetitive cross-tool transcription.",
      "Improved task execution speed from hours to seconds with consistent formatting.",
      "High reliability through structured deterministic fallbacks.",
    ],
  },
  {
    slug: "workflow-automation",
    title: "Workflow Automation",
    shortDescription: "Reliable event-driven pipelines via n8n, Make, webhooks, and custom APIs.",
    heroTagline: "Connect your existing software stack into resilient, event-driven pipelines that never drop data.",
    whatItSolves: [
      "Data silos between marketing, sales, accounting, and fulfillment.",
      "Delayed manual updates and repetitive copy-paste tasks between applications.",
      "Brittle legacy automations that break whenever an API payload slightly shifts.",
    ],
    whoItsFor: [
      "Companies with modern tech stacks that want seamless real-time synchronization.",
      "Businesses moving away from expensive proprietary iPaaS lock-in to open-source n8n.",
      "Operations leaders who need 99.9% reliable background data movement.",
    ],
    howItWorks: [
      { step: "01", title: "Event Mapping", desc: "Catalog triggers, payloads, webhooks, and destination schemas." },
      { step: "02", title: "Resilient Pipeline Build", desc: "Build orchestration nodes with retry policies, deduplication, and error queues." },
      { step: "03", title: "Monitoring & Alerting", desc: "Deploy real-time error reporting to Slack/PagerDuty for instant exception handling." },
      { step: "04", title: "Continuous Optimization", desc: "Refactor pipeline bottlenecks and scale throughput as volume grows." },
    ],
    workflowExample: {
      trigger: "Customer signs DocuSign enterprise contract",
      agentRole: "Provisioning & Operations Pipeline",
      tools: ["DocuSign Webhook", "Stripe Billing", "QuickBooks", "AWS User Provisioning"],
      decision: "Verify whether customer selected annual wire vs monthly credit card",
      humanApproval: "Finance team confirms tax exemption certificate if applicable",
      output: "Stripe subscription activated, NetSuite invoice generated, welcome package sent",
    },
    features: [
      "Self-hosted dedicated n8n infrastructure or cloud workflows",
      "Idempotent event processing to prevent duplicate execution",
      "Dead-letter queues and automated failure retry policies",
      "Bi-directional synchronization between legacy SQL databases and modern SaaS",
      "Comprehensive webhook secret verification and payload logging",
    ],
    technologies: ["n8n", "Make", "Zapier Enterprise", "Node.js / TypeScript", "PostgreSQL", "Docker"],
    securityMeasures: [
      "HMAC-SHA256 signature verification on all inbound webhooks",
      "Encrypted credential vaults with zero hardcoded API keys",
      "SOC2-compliant secret handling and IP whitelisting",
    ],
    implementationProcess: [
      "Sprint 1: Architecture review, webhook inventory, and integration setup",
      "Sprint 2: Pipeline development, data transformation, and schema validation",
      "Sprint 3: Stress testing, failover drills, and staff handoff",
    ],
    expectedOutcomes: [
      "Designed to establish seamless synchronization across business applications.",
      "Reduced time-to-fulfillment and near-instant notification for mission-critical events.",
      "Clear visibility and audit trails for every background transaction.",
    ],
  },
  {
    slug: "customer-support",
    title: "AI Customer Support",
    shortDescription: "Instant 24/7 resolution agents connected to company knowledge bases.",
    heroTagline: "Resolve customer inquiries instantly across web, email, and messaging with verified accuracy and zero hallucinations.",
    whatItSolves: [
      "Slow response times during non-business hours and peak traffic periods.",
      "High volume of repetitive tier-1 queries that overwhelm human support agents.",
      "Inconsistent answers given by rotating support personnel across channels.",
    ],
    whoItsFor: [
      "E-commerce brands handling high volumes of order tracking and return inquiries.",
      "SaaS companies with extensive technical documentation and API support.",
      "Service businesses needing instant multi-channel triage and scheduling.",
    ],
    howItWorks: [
      { step: "01", title: "Knowledge Ingestion", desc: "Index help docs, refund policies, FAQs, and ticket history into a secure vector store." },
      { step: "02", title: "Integration Connection", desc: "Connect support endpoints: Web widget, Zendesk, Freshdesk, Gorgias, or WhatsApp." },
      { step: "03", title: "Grounded Answering", desc: "Configure AI to answer strictly using company sources with explicit citations." },
      { step: "04", title: "Seamless Escalation", desc: "Automatically route complex or emotional cases to human agents with full conversation summaries." },
    ],
    workflowExample: {
      trigger: "Customer inquires: 'Where is my order and can I change the shipping address?'",
      agentRole: "Customer Care & Order Resolution Agent",
      tools: ["Shopify GraphQL", "Klaviyo", "Zendesk API", "FedEx Tracking API"],
      decision: "Has the warehouse already fulfilled and printed the shipping label?",
      humanApproval: "If fulfilled, escalate to warehouse supervisor for address intercept",
      output: "Address updated in ERP, customer receives updated tracking link via SMS",
    },
    features: [
      "Multi-channel coverage: Web chat, Email, WhatsApp, and SMS",
      "Strict citation engine prevents hallucinated policies or promises",
      "Live order, invoice, and subscription status lookup via secure APIs",
      "Automated sentiment detection and priority escalation routing",
      "Support agent copilot mode for draft suggestion before human sending",
    ],
    technologies: ["OpenAI GPT-4o", "Claude 3.5 Sonnet", "Postgres pgvector", "Gorgias", "Zendesk", "Twilio"],
    securityMeasures: [
      "Redaction of credit card numbers, passwords, and sensitive PII from logs",
      "Customer data never used to train public foundation models",
      "Rate limiting to prevent denial-of-service or prompt extraction attacks",
    ],
    implementationProcess: [
      "Phase 1: Knowledge audit and FAQ categorization",
      "Phase 2: RAG pipeline build and internal sandbox validation against historical tickets",
      "Phase 3: Agent-assist pilot (AI drafts, human approves)",
      "Phase 4: Full deployment with continuous evaluation and weekly accuracy audits",
    ],
    expectedOutcomes: [
      "Designed to significantly decrease first-response and resolution times.",
      "Frees human support specialists to focus on high-touch and complex customer relationships.",
      "Maintains brand voice consistency 24 hours a day, 7 days a week.",
    ],
  },
  {
    slug: "sales-automation",
    title: "Sales Automation",
    shortDescription: "Lead capture, enrichment, qualification, scoring, outreach, and CRM sync.",
    heroTagline: "Turn inbound website visitors and outbound prospect lists into qualified, scheduled meetings on autopilot.",
    whatItSolves: [
      "Slow response times to inbound leads that result in dropped conversion rates.",
      "Sales development reps spending hours manually researching prospect tech stacks.",
      "Inconsistent lead scoring and messy, out-of-date CRM records.",
    ],
    whoItsFor: [
      "B2B software and service companies seeking to maximize inbound pipeline conversion.",
      "Sales teams that want SDRs having conversations rather than copying contact fields.",
      "Agencies and consultants managing high-volume qualification workflows.",
    ],
    howItWorks: [
      { step: "01", title: "Capture & Enrich", desc: "Ingest leads from web forms, event webhooks, or Apollo/Clay lists." },
      { step: "02", title: "Autonomous Research", desc: "Agent crawls prospect website, identifies company size, tech stack, and pain points." },
      { step: "03", title: "ICP Scoring", desc: "Evaluate prospect fit against your ideal customer profile rubric." },
      { step: "04", title: "Personalized Outreach", desc: "Draft bespoke follow-up emails and dispatch calendar invites to qualified buyers." },
    ],
    workflowExample: {
      trigger: "Prospect submits 'Request Audit' form on website",
      agentRole: "Sales Intelligence & Qualification Agent",
      tools: ["Clearbit / Clay API", "HubSpot", "Google Calendar API", "Slack"],
      decision: "Evaluate budget tier and tech stack compatibility",
      humanApproval: "Optional SDR review for Tier-1 Enterprise targets",
      output: "Prospect booked on AE calendar, contextual briefing document created in CRM",
    },
    features: [
      "Sub-minute inbound response times with personalized context",
      "Automated domain scraping and technology stack detection",
      "Multi-tier ICP qualification algorithm with custom scoring weights",
      "Seamless bi-directional sync with HubSpot, Salesforce, and Pipedrive",
      "Intelligent meeting booking with automatic timezone synchronization",
    ],
    technologies: ["OpenAI GPT-4o", "HubSpot API", "Salesforce REST", "Clay", "Google Calendar"],
    securityMeasures: [
      "Strict CAN-SPAM and GDPR-compliant unsubscribe mechanisms",
      "Domain health and email warmup guardrails to protect deliverability",
      "Audited CRM write permissions avoiding inadvertent record overwrites",
    ],
    implementationProcess: [
      "Week 1: ICP definition, scoring criteria alignment, and CRM field mapping",
      "Week 2: Autonomous research agent development and enrichment pipeline setup",
      "Week 3: Calendar integration, email template personalization, and testing",
      "Week 4: Live deployment and initial conversion monitoring",
    ],
    expectedOutcomes: [
      "Designed to eliminate delays in prospect qualification and outreach.",
      "Higher engagement through tailored, context-aware initial messaging.",
      "Clean, fully enriched CRM contact records without manual data entry.",
    ],
  },
  {
    slug: "rag-knowledge-systems",
    title: "RAG & Knowledge Systems",
    shortDescription: "Vector search over PDFs, SOPs, and internal documents with strict RBAC.",
    heroTagline: "Unlock the collective intelligence of your organization with private, citation-backed enterprise search.",
    whatItSolves: [
      "Employees wasting hours searching across fragmented Notion, Drive, Confluence, and PDF silos.",
      "Onboarding new team members taking months due to undocumented tribal knowledge.",
      "Risks of generic AI tools leaking confidential business IP to public models.",
    ],
    whoItsFor: [
      "Professional service firms, law offices, and consultancies with deep document archives.",
      "Engineering and product teams with extensive technical documentation.",
      "Heavily regulated businesses needing private, on-premise or VPC-hosted knowledge access.",
    ],
    howItWorks: [
      { step: "01", title: "Document Ingestion", desc: "Continuously ingest PDFs, Word documents, Notion pages, and markdown files." },
      { step: "02", title: "Semantic Chunking", desc: "Parse documents by semantic sections rather than arbitrary token boundaries." },
      { step: "03", title: "Hybrid Vector Indexing", desc: "Index content using dense vector embeddings combined with BM25 keyword search." },
      { step: "04", title: "Permissioned Retrieval", desc: "Query answers with explicit citations, respecting user access roles." },
    ],
    workflowExample: {
      trigger: "Engineer asks: 'What is the rollback protocol for Kubernetes cluster deployment?'",
      agentRole: "Internal Knowledge Retrieval Agent",
      tools: ["Postgres pgvector", "GitLab Wiki", "Confluence API", "Slack Bot"],
      decision: "Verify engineer's security group permissions for infrastructure docs",
      humanApproval: "None required for read-only verified knowledge retrieval",
      output: "Precise 4-step rollback command list returned with direct link to SOP-infra-09.md",
    },
    features: [
      "Hybrid retrieval combining dense neural embeddings with exact keyword search",
      "Guaranteed source citations with document name, section, and page number",
      "Strict role-based access control (RBAC) ensuring departmental privacy",
      "Automated re-indexing pipelines whenever source files are updated",
      "Zero training clause: your proprietary documents never train external models",
    ],
    technologies: ["PostgreSQL pgvector", "Pinecone / Qdrant", "Claude 3.5 Sonnet", "LangChain", "Next.js"],
    securityMeasures: [
      "Data encrypted in transit (TLS 1.3) and at rest (AES-256)",
      "VPC deployment options for complete data perimeter isolation",
      "Audit trail logging every internal search query and retrieved document",
    ],
    implementationProcess: [
      "Sprint 1: Document audit, categorization, and access control matrix",
      "Sprint 2: Chunking strategy optimization and vector embedding pipeline build",
      "Sprint 3: Web UI and Slack/Teams copilot interface integration",
      "Sprint 4: Search relevance benchmarking and verification drills",
    ],
    expectedOutcomes: [
      "Designed to drastically accelerate internal information discovery.",
      "Verifiable answers with citations eliminate guesswork and misinformation.",
      "Protects proprietary IP within a private, governed security architecture.",
    ],
  },
  {
    slug: "document-intelligence",
    title: "Document Intelligence",
    shortDescription: "PDF, invoice, contract, and form OCR with structured data extraction.",
    heroTagline: "Convert unstructured PDFs, scanned invoices, and complex agreements into clean, validated JSON in seconds.",
    whatItSolves: [
      "Manual data entry from invoices, bills of lading, and receipts into accounting software.",
      "Human transcription errors leading to billing discrepancies and compliance issues.",
      "Slow contract review cycles delaying deals and vendor approvals.",
    ],
    whoItsFor: [
      "Logistics and supply chain businesses managing thousands of shipping documents.",
      "Finance and accounting teams processing high-volume accounts payable.",
      "Legal and compliance departments reviewing vendor MSAs and NDAs.",
    ],
    howItWorks: [
      { step: "01", title: "Document Intake", desc: "Receive documents via email attachment, webhook, cloud storage, or secure upload." },
      { step: "02", title: "Multimodal OCR", desc: "Extract raw layout, tables, signatures, and printed text with high-precision vision models." },
      { step: "03", title: "Schema Enforcement", desc: "Map unstructured text into strict, typed JSON structures validated by Zod." },
      { step: "04", title: "System Sync", desc: "Push verified fields into your ERP, database, or accounting platform." },
    ],
    workflowExample: {
      trigger: "Vendor emails monthly bill with PDF attachment to billing@company.com",
      agentRole: "Accounts Payable Extraction Agent",
      tools: ["Vision OCR Model", "NetSuite API", "PostgreSQL", "Slack"],
      decision: "Does the invoice line item total match the approved PO in ERP?",
      humanApproval: "Finance controller approves payment if variance > $50",
      output: "Bill created in NetSuite, receipt archived in S3 with extracted metadata",
    },
    features: [
      "Extract complex multi-page tables, nested line items, and tax breakdowns",
      "Handles scanned, skewed, low-resolution, and handwritten documents",
      "Automated cross-validation against external databases and purchase orders",
      "Deterministic schema validation ensures output format is 100% predictable",
      "Temporary processing with automated file purge to protect confidential data",
    ],
    technologies: ["GPT-4o Vision", "AWS Textract", "Python / FastAPI", "Zod", "PostgreSQL"],
    securityMeasures: [
      "Temporary ephemeral storage—files deleted immediately after JSON extraction",
      "File type and MIME validation preventing malicious executable uploads",
      "Strict file size limits and cryptographic hash deduplication",
    ],
    implementationProcess: [
      "Week 1: Document taxonomy review and JSON schema specification",
      "Week 2: Multimodal extraction model configuration and validation testing",
      "Week 3: ERP / accounting software API connector development",
      "Week 4: Shadow testing on historical batches followed by live rollout",
    ],
    expectedOutcomes: [
      "Designed to replace manual paper and PDF transcription with automated structured ingestion.",
      "Near-zero transcription errors through automated mathematical verification.",
      "Accelerates invoice processing cycles from days to minutes.",
    ],
  },
  {
    slug: "email-automation",
    title: "Email & Communication Automation",
    shortDescription: "Smart inbox routing, draft synthesis, classification, and follow-up loops.",
    heroTagline: "Transform high-volume shared inboxes from chaotic bottlenecks into structured, automated action queues.",
    whatItSolves: [
      "Shared team inboxes (support@, sales@, info@) becoming unmanageable black holes.",
      "Important client emails getting buried or delayed during busy periods.",
      "Staff spending hours writing the same repetitive updates and follow-ups.",
    ],
    whoItsFor: [
      "Executive teams and founders managing hundreds of daily inbound messages.",
      "Customer success departments coordinating renewals and account questions.",
      "Agencies managing multi-client communications across distributed inboxes.",
    ],
    howItWorks: [
      { step: "01", title: "Inbox Ingestion", desc: "Connect Google Workspace or Microsoft 365 via secure OAuth webhooks." },
      { step: "02", title: "Semantic Classification", desc: "Classify incoming emails by intent, urgency, sentiment, and topic." },
      { step: "03", title: "Context Synthesis", desc: "Retrieve relevant customer history from CRM and past correspondence." },
      { step: "04", title: "Draft & Execute", desc: "Generate context-aware reply drafts ready for 1-click human approval." },
    ],
    workflowExample: {
      trigger: "Customer emails asking for invoice copy and payment receipt",
      agentRole: "Communications Triage & Fulfillment Agent",
      tools: ["Microsoft Graph API", "Stripe API", "QuickBooks", "Slack"],
      decision: "Verify sender email matches authenticated billing contact in Stripe",
      humanApproval: "None required for automated self-service receipt generation",
      output: "Email reply sent with secure PDF receipt attached; ticket closed in CRM",
    },
    features: [
      "Real-time semantic inbox triage and priority tagging",
      "Automated draft generation matching your team's tone and brand guidelines",
      "Automatic follow-up sequences triggered by non-response after X business days",
      "Seamless integration with Google Workspace and Microsoft 365",
      "Human-in-the-loop draft review modal embedded in web app or Slack",
    ],
    technologies: ["Claude 3.5 Sonnet", "Microsoft Graph API", "Gmail API", "TypeScript", "Redis"],
    securityMeasures: [
      "OAuth 2.0 with minimal required scope access (least privilege principle)",
      "Strict data boundary: emails are never used to train public LLMs",
      "Full audit logging of all drafted and dispatched communications",
    ],
    implementationProcess: [
      "Sprint 1: Inbox workflow analysis and intent taxonomy definition",
      "Sprint 2: Email API connector build, security audit, and classification testing",
      "Sprint 3: Draft assistant deployment for staff review and refinement",
      "Sprint 4: Phased autonomous deployment for approved low-risk categories",
    ],
    expectedOutcomes: [
      "Designed to reduce inbox backlog and prevent critical messages from slipping through.",
      "Faster response times with consistent, polished company communication.",
      "Gives team members hours of daily focus time back.",
    ],
  },
  {
    slug: "internal-ai",
    title: "Internal AI Systems",
    shortDescription: "Employee assistant, company knowledge, operations, and analytics copilot.",
    heroTagline: "Empower every department with an intelligent operational copilot embedded directly into Slack or Teams.",
    whatItSolves: [
      "Employees struggling with complex internal software interfaces and queries.",
      "Repetitive questions directed at HR, IT, and Finance teams.",
      "Difficulties generating quick cross-system operational reports.",
    ],
    whoItsFor: [
      "Companies with 50+ employees seeking to streamline internal operations.",
      "Distributed and remote teams that need asynchronous answers to SOPs.",
      "Leaders who want instant natural-language reporting on operational KPIs.",
    ],
    howItWorks: [
      { step: "01", title: "Internal Tool Mapping", desc: "Connect Jira, GitHub, Slack, Notion, HRIS, and internal databases." },
      { step: "02", title: "Assistant Persona Configuration", desc: "Build tailored copilots for Engineering, HR, Sales, and Leadership." },
      { step: "03", title: "Security Boundary Setup", desc: "Enforce strict organizational role permissions so employees only see their scope." },
      { step: "04", title: "Chat Integration", desc: "Deploy directly into Slack (@CareerForgeX Bot) or private web interface." },
    ],
    workflowExample: {
      trigger: "Employee asks in Slack: '@Copilot what is our policy on travel meal stipends?'",
      agentRole: "Internal Employee Copilot",
      tools: ["Notion SOP Vector Index", "BambooHR API", "Slack Events API"],
      decision: "Verify employee region (US vs EU stipend limits)",
      humanApproval: "None for standard policy lookup",
      output: "Instant accurate answer returned in thread with link to expense submission form",
    },
    features: [
      "Embedded in existing workflows: Slack, Microsoft Teams, or private web app",
      "Department-specific skill sets: HR policies, IT ticketing, SQL reporting",
      "Natural language to SQL query conversion with read-only database guardrails",
      "Automated summary generation for long Slack threads and meetings",
      "Granular role-based permissions preventing unauthorized data exposure",
    ],
    technologies: ["OpenAI GPT-4o", "Slack Bolt SDK", "PostgreSQL", "Next.js", "Docker"],
    securityMeasures: [
      "Read-only credentials for all analytical database connections",
      "Zero retention of confidential query payloads by third-party model vendors",
      "Multi-factor authentication and SSO integration (Okta, Google Workspace)",
    ],
    implementationProcess: [
      "Phase 1: Security clearance, system architecture, and tool inventory",
      "Phase 2: RAG indexing of internal handbooks and database schema modeling",
      "Phase 3: Pilot deployment to core operations group for feedback",
      "Phase 4: Company-wide launch and automated usage monitoring",
    ],
    expectedOutcomes: [
      "Designed to streamline internal knowledge access and reduce administrative interruptions.",
      "Instant resolution of common operational questions.",
      "Empowers non-technical team members with direct natural-language reporting.",
    ],
  },
  {
    slug: "custom-ai",
    title: "Custom AI Builds",
    shortDescription: "Custom architecture, private hosting, model evaluation, and deployment.",
    heroTagline: "Bespoke AI architectures engineered specifically for your proprietary business processes and compliance standards.",
    whatItSolves: [
      "Off-the-shelf SaaS tools failing to address unique or proprietary business workflows.",
      "High compliance requirements that forbid multi-tenant public cloud services.",
      "Need for custom fine-tuned models trained on proprietary industry data.",
    ],
    whoItsFor: [
      "Enterprises requiring private cloud (AWS / GCP / Azure) VPC hosting.",
      "Healthcare, defense, and financial organizations with strict regulatory audits.",
      "Companies building proprietary AI features to differentiate their product offering.",
    ],
    howItWorks: [
      { step: "01", title: "Deep Discovery & Feasibility", desc: "Evaluate technical requirements, data availability, and compliance constraints." },
      { step: "02", title: "Custom Architecture", desc: "Select optimal models (open-weights vs commercial), vector storage, and orchestration." },
      { step: "03", title: "Private Engineering & Evaluation", desc: "Build pipelines, benchmark accuracy using golden datasets, and conduct security reviews." },
      { step: "04", title: "Enterprise Deployment", desc: "Deploy inside your private cloud perimeter with CI/CD and comprehensive monitoring." },
    ],
    workflowExample: {
      trigger: "Proprietary medical lab report generated by diagnostic equipment",
      agentRole: "Specialized Clinical Analysis Pipeline",
      tools: ["Private AWS VPC", "Fine-tuned Llama 3 70B", "DICOM / HL7 Parser"],
      decision: "Detect abnormal biomarker flags exceeding standard clinical standard deviation",
      humanApproval: "Mandatory pathologist sign-off before electronic medical record commit",
      output: "Structured diagnostic summary securely appended to patient record in Epic EHR",
    },
    features: [
      "Private cloud deployment (AWS, GCP, Azure, or on-premise hardware)",
      "Open-source model fine-tuning and domain adaptation (Llama 3, Mistral, Qwen)",
      "Custom evaluation suites measuring accuracy, latency, and drift against golden benchmarks",
      "Comprehensive compliance documentation for SOC2, HIPAA, and ISO 27001",
      "Dedicated infrastructure with full client ownership of all intellectual property",
    ],
    technologies: ["PyTorch", "vLLM", "AWS SageMaker", "Docker / Kubernetes", "PostgreSQL pgvector"],
    securityMeasures: [
      "Air-gapped or private VPC networking with zero public internet exposure",
      "End-to-end encryption with client-managed keys (CMK)",
      "Strict data retention policies and zero vendor telemetry",
    ],
    implementationProcess: [
      "Month 1: Technical scoping, data governance review, and architecture blueprint",
      "Month 2: Pipeline development, model fine-tuning, and offline benchmarking",
      "Month 3: VPC deployment, penetration testing, and integration verification",
      "Month 4: Production cutover, operations training, and ongoing SLA support",
    ],
    expectedOutcomes: [
      "Designed to solve complex, proprietary business problems that generic tools cannot address.",
      "Full ownership of models, code, and infrastructure without vendor lock-in.",
      "Enterprise-grade security adhering to the strictest industry regulations.",
    ],
  },
];
