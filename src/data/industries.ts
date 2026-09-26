export interface IndustryDetail {
  slug: string;
  name: string;
  tagline: string;
  overview: string;
  industryProblems: string[];
  automationOpportunities: string[];
  exampleWorkflows: { title: string; steps: string[] }[];
  aiAgentExamples: { role: string; task: string }[];
  keyIntegrations: string[];
  securityConsiderations: string[];
}

export const industriesData: IndustryDetail[] = [
  {
    slug: "startups",
    name: "Startups & Scaleups",
    tagline: "Move with maximum velocity by automating operational overhead from seed stage to series B.",
    overview: "Fast-growing venture-backed startups often hit a wall where founders and early engineers get bogged down in customer support, manual prospect research, and administrative tasks. CareerForgeX installs intelligent systems so your team stays focused on product and engineering.",
    industryProblems: [
      "Rapidly scaling inbound lead volume with limited sales headcount.",
      "Engineers interrupted by non-technical customer questions and documentation requests.",
      "Fragmented software stacks (Slack, Notion, Linear, Stripe, HubSpot) causing lost context.",
    ],
    automationOpportunities: [
      "Instant inbound lead qualification and round-robin founder booking",
      "Linear / Jira bug intake agent that parses customer bug reports and reproduces stack traces",
      "Stripe failed payment recovery workflows with custom transactional alerts",
    ],
    exampleWorkflows: [
      {
        title: "Inbound Prospect to Linear Bug Triage",
        steps: ["User reports issue via web", "AI Agent reproduces error steps", "Creates enriched Linear ticket", "Alerts #eng-triage in Slack"],
      },
    ],
    aiAgentExamples: [
      { role: "Founder Copilot Agent", task: "Prepares morning briefing on pipeline changes, high-intent leads, and critical support tickets." },
      { role: "Product Feedback Synthesizer", task: "Aggregates feature requests across Discord, Slack, and email into structured product roadmaps." },
    ],
    keyIntegrations: ["Linear", "GitHub", "Slack", "HubSpot", "Stripe", "Notion"],
    securityConsiderations: ["SOC2-ready credential vaults", "Least-privilege API tokens", "Zero public model data training"],
  },
  {
    slug: "ecommerce",
    name: "E-Commerce & Retail",
    tagline: "Deliver instant customer resolution, automate order fulfillment tracking, and enrich product catalogs.",
    overview: "Modern retail brands handle immense volume with tight margins. We connect Shopify, Gorgias, Klaviyo, and ERPs so repetitive customer questions are resolved in under 30 seconds and stock alerts are routed automatically.",
    industryProblems: [
      "BFCM and seasonal traffic spikes overwhelming support teams with 'Where is my order?' tickets.",
      "High rates of return processing delays leading to negative reviews.",
      "Manual product catalog copy writing and multi-channel SEO tag synchronization.",
    ],
    automationOpportunities: [
      "Autonomous 24/7 order status and carrier tracking lookups via WhatsApp and Web",
      "Automated return policy verification, label generation, and restocking alerts",
      "Catalog enrichment agents generating structured SEO metadata and attributes",
    ],
    exampleWorkflows: [
      {
        title: "Instant Order Triage & Address Correction",
        steps: ["Customer requests address change", "AI queries Shopify GraphQL", "Verifies label status", "Updates warehouse shipping slip", "Confirms with customer"],
      },
    ],
    aiAgentExamples: [
      { role: "VIP Customer Concierge", task: "Monitors high-LTV customers and flags churn risks or tailored re-order recommendations." },
      { role: "Returns Resolution Agent", task: "Validates return eligibility according to terms and automatically issues RMA bar codes." },
    ],
    keyIntegrations: ["Shopify Plus", "Gorgias", "Klaviyo", "FedEx API", "ShipBob", "Recharge"],
    securityConsiderations: ["PCI-DSS compliance boundaries", "Customer PII redaction", "Encrypted session tokens"],
  },
  {
    slug: "real-estate",
    name: "Real Estate & PropTech",
    tagline: "Capture every weekend buyer lead, qualify financial criteria, and schedule property showings automatically.",
    overview: "Real estate deals move fast. Inquiries received after hours or during showings frequently go cold. We deploy conversational qualification agents that connect MLS data, calendars, and WhatsApp so your brokerage never misses a qualified buyer.",
    industryProblems: [
      "Losing prospective buyers who inquire outside regular business hours.",
      "Agents spending hours calling unqualified leads with unrealistic budgets.",
      "Disorganized client communications scattered across phone, text, and portal emails.",
    ],
    automationOpportunities: [
      "Instant WhatsApp and SMS conversational qualification on portal leads",
      "Automated budget, pre-approval, and location criteria scoring",
      "Real-time property tour booking directly onto the designated listing agent's calendar",
    ],
    exampleWorkflows: [
      {
        title: "Inbound Buyer to Confirmed Showing",
        steps: ["Portal lead arrives", "AI agent texts prospect in 45s", "Verifies financing status", "Suggests 3 matching MLS listings", "Schedules showing"],
      },
    ],
    aiAgentExamples: [
      { role: "Buyer Qualification Agent", task: "Engages portal inquiries, gathers preferred bedrooms/budget, and assigns priority tier." },
      { role: "Listing Matcher", task: "Monitors new MLS listings and alerts past clients when matching properties hit the market." },
    ],
    keyIntegrations: ["HubSpot CRM", "Follow Up Boss", "WhatsApp Cloud API", "Google Calendar", "Twilio"],
    securityConsiderations: ["Fair housing compliance filters", "Secure handling of financial pre-approval documents"],
  },
  {
    slug: "education",
    name: "Education & EdTech",
    tagline: "Automate student admissions triage, course FAQ resolution, and administrative onboarding.",
    overview: "Educational institutions and EdTech platforms face seasonal surges in admissions inquiries and course support. Our RAG-powered systems give students instant, accurate answers while routing complex advisor cases seamlessly.",
    industryProblems: [
      "Admissions teams inundated with repetitive questions regarding tuition, deadlines, and prerequisites.",
      "Delayed responses causing prospective students to enroll in competing institutions.",
      "Manual transcript intake and preliminary prerequisite verification bottlenecks.",
    ],
    automationOpportunities: [
      "24/7 Student Advisor Assistant answering degree requirements and deadlines",
      "Automated transcript OCR parsing and credit transfer pre-evaluation",
      "Intelligent student retention alerts based on engagement drops",
    ],
    exampleWorkflows: [
      {
        title: "Admissions Ingestion & Prerequisite Verification",
        steps: ["Student uploads transcript PDF", "Vision OCR extracts coursework", "Compares against catalog prerequisites", "Routes to admissions officer with summary"],
      },
    ],
    aiAgentExamples: [
      { role: "Admissions Concierge Agent", task: "Guides applicants through required submission documents and schedules interview appointments." },
      { role: "Academic Handbook Assistant", task: "Provides instant citations to course catalogs, graduation requirements, and academic policies." },
    ],
    keyIntegrations: ["Canvas LMS", "Salesforce Education Cloud", "Zendesk", "Google Workspace"],
    securityConsiderations: ["FERPA compliance compliance controls", "Student record privacy segregation", "Encrypted document storage"],
  },
  {
    slug: "healthcare",
    name: "Healthcare & Life Sciences",
    tagline: "HIPAA-conscious appointment routing, clinical trial document search, and administrative triage.",
    overview: "Healthcare providers and medical research teams cannot afford data leaks or hallucinations. We deploy private VPC-isolated AI architectures with strict human-in-the-loop signoffs for medical record parsing and protocol retrieval.",
    industryProblems: [
      "Medical staff burdened by excessive administrative documentation and intake typing.",
      "Researchers spending hours locating specific protocols across thousands of PDF trial documents.",
      "Strict regulatory environments forbidding generic public cloud AI products.",
    ],
    automationOpportunities: [
      "Private VPC RAG systems indexing standard operating procedures and clinical trial protocols",
      "Automated patient intake questionnaire structuring and EHR preparation",
      "Provider credentialing document validation and expiry tracking",
    ],
    exampleWorkflows: [
      {
        title: "Clinical Protocol Search & Citation Verification",
        steps: ["Researcher submits protocol query", "Private VPC pgvector hybrid search", "Validates source document ID", "Returns answer with paragraph citations"],
      },
    ],
    aiAgentExamples: [
      { role: "Protocol Discovery Copilot", task: "Extracts biomarker inclusion/exclusion criteria from 500-page trial protocols." },
      { role: "Intake Structuring Agent", task: "Converts patient symptom narratives into standardized ICD-10 compatible operational notes for clinician review." },
    ],
    keyIntegrations: ["Epic / Cerner FHIR APIs", "Private AWS VPC", "PostgreSQL pgvector", "Microsoft Azure for Healthcare"],
    securityConsiderations: ["BAA (Business Associate Agreement) compatibility", "End-to-end encryption with tenant KMS", "Zero public model exposure"],
  },
  {
    slug: "finance",
    name: "Financial Services & FinTech",
    tagline: "Automated compliance audit logging, loan application structuring, and statement reconciliation.",
    overview: "Financial institutions require exact accuracy, deterministic audit trails, and strict role permissions. CareerForgeX builds financial automation pipelines that combine strict mathematical verification with intelligent document understanding.",
    industryProblems: [
      "Manual transcription of financial statements, tax returns, and bank statements.",
      "Regulatory audit requirements requiring exhaustive human traceability.",
      "Slow loan and credit underwriting turnaround times caused by manual document review.",
    ],
    automationOpportunities: [
      "Automated multi-period financial statement normalization into structured JSON",
      "Real-time KYC/AML document intake and identity consistency verification",
      "Automated compliance checklist evaluation against FINRA / SEC guidelines",
    ],
    exampleWorkflows: [
      {
        title: "Commercial Loan Application Intake",
        steps: ["Applicant uploads balance sheet PDF", "OCR extracts 3 years of line items", "Calculates DSCR & Debt-to-Equity ratios", "Underwriter review queue updated"],
      },
    ],
    aiAgentExamples: [
      { role: "Underwriting Assistant Agent", task: "Summarizes applicant financial health and flags discrepancies between tax returns and bank statements." },
      { role: "Compliance Audit Monitor", task: "Scans client communications for regulatory disclosure violations and logs findings." },
    ],
    keyIntegrations: ["QuickBooks Online", "NetSuite ERP", "Plaid API", "Salesforce Financial Services Cloud"],
    securityConsiderations: ["SOC2 Type II compliance readiness", "Immutable audit logging", "Air-gapped deployment options"],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing & Supply Chain",
    tagline: "Automate carrier invoice reconciliation, bill of materials extraction, and inventory exception alerts.",
    overview: "Supply chains run on documents: purchase orders, packing lists, tariff schedules, and carrier invoices. We build document intelligence pipelines that connect legacy ERPs with modern notification workflows.",
    industryProblems: [
      "Accounts payable teams transcribing hundreds of multi-page freight bills weekly.",
      "Production delays caused by delayed inventory exception notifications.",
      "Lack of centralized tracking for vendor lead-time slippage.",
    ],
    automationOpportunities: [
      "Automated carrier bill of lading OCR and tariff rate reconciliation",
      "Inventory threshold alerts dispatched to shop-floor supervisor channels",
      "Vendor purchase order confirmation tracking and expected delivery date synchronization",
    ],
    exampleWorkflows: [
      {
        title: "Freight Bill Audit & NetSuite Sync",
        steps: ["Carrier emails freight bill PDF", "Vision model extracts line charges", "Compares with contracted tariff sheet", "Finance sign-off on variances", "ERP bill created"],
      },
    ],
    aiAgentExamples: [
      { role: "PO Exception Monitor", task: "Flags unconfirmed purchase orders approaching critical path ship dates." },
      { role: "Freight Audit Agent", task: "Validates fuel surcharges and accessorial fees against negotiated master service agreements." },
    ],
    keyIntegrations: ["SAP", "Oracle NetSuite", "Slack", "Microsoft 365", "PostgreSQL"],
    securityConsiderations: ["IP whitelisted webhook endpoints", "Strict ERP write permissions", "Complete transaction ledgering"],
  },
  {
    slug: "agencies",
    name: "Agencies & Studios",
    tagline: "Automate client onboarding, multi-channel weekly reporting, and creative brief synthesis.",
    overview: "Marketing, design, and development agencies spend too many unbillable hours assembling weekly client reports and coordinating onboarding deliverables. We automate the operational plumbing so your creative team can focus on billable client strategy.",
    industryProblems: [
      "Account managers spending entire Mondays assembling cross-platform metrics into slide decks.",
      "Disorganized client onboarding leading to delayed project kickoff dates.",
      "Scope creep caused by lack of documentation on revision requests.",
    ],
    automationOpportunities: [
      "Automated cross-channel performance reporting generated and dispatched directly to client Slack channels",
      "Self-service client intake workflows that create Google Drive folders, Figma workspaces, and Asana boards",
      "Automated meeting transcription, action-item extraction, and task assignment",
    ],
    exampleWorkflows: [
      {
        title: "Client Kickoff Automation",
        steps: ["Contract signed in PandaDoc", "Stripe deposit verified", "Asana project & Google Drive created", "Welcome brief sent to client", "Team notified in Slack"],
      },
    ],
    aiAgentExamples: [
      { role: "Reporting Synthesis Agent", task: "Pulls Google Ads, Meta Ads, and GA4 data into a unified executive summary narrative." },
      { role: "Meeting Action Item Extractor", task: "Converts client zoom recordings into structured Linear or Asana tasks with assignees." },
    ],
    keyIntegrations: ["Asana", "ClickUp", "Slack", "Google Drive", "PandaDoc", "Meta / Google Ads APIs"],
    securityConsiderations: ["Client-scoped workspace separation", "Zero data sharing between agency clients"],
  },
  {
    slug: "professional-services",
    name: "Professional Services & Legal",
    tagline: "Accelerate contract analysis, automate matter intake, and structure billing records.",
    overview: "Consultancies, law firms, and advisory practices handle vast amounts of confidential documents and billable time entries. We deploy high-accuracy document intelligence and search systems with strict enterprise governance.",
    industryProblems: [
      "Associates spending days conducting manual preliminary discovery across contract archives.",
      "Lost billable time caused by delayed time tracking entry.",
      "Complex client onboarding involving multi-party conflict checks and NDA tracking.",
    ],
    automationOpportunities: [
      "Preliminary contract clause comparison against standard corporate playbook",
      "Private internal knowledge retrieval over historical client advisory opinions",
      "Automated engagement letter generation and client conflict checking workflows",
    ],
    exampleWorkflows: [
      {
        title: "Vendor NDA Review Flow",
        steps: ["Vendor submits draft NDA", "AI compares clauses against legal playbook", "Highlights non-standard liability terms", "Prepares redline recommendation for partner"],
      },
    ],
    aiAgentExamples: [
      { role: "Playbook Compliance Agent", task: "Flags deviations in indemnity, choice of law, and term length in incoming agreements." },
      { role: "Precedent Research Assistant", task: "Identifies past firm memos and work product relevant to current client matters." },
    ],
    keyIntegrations: ["Clio", "Microsoft 365", "DocuSign", "Box", "PostgreSQL pgvector"],
    securityConsiderations: ["Attorney-client privilege isolation", "Zero data retention on external model servers", "Granular matter-level RBAC"],
  },
];
