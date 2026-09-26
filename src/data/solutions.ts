export interface SolutionDetail {
  slug: string;
  title: string;
  department: string;
  tagline: string;
  description: string;
  commonProblems: string[];
  automationOpportunities: string[];
  exampleWorkflow: {
    title: string;
    steps: string[];
  };
  metricsFocus: string[];
}

export const solutionsData: SolutionDetail[] = [
  {
    slug: "sales",
    title: "Sales Automation",
    department: "Revenue & Sales Operations",
    tagline: "Empower your revenue team with instant inbound lead enrichment, qualification, and automated CRM orchestration.",
    description: "Your reps should spend their day speaking with qualified buyers, not researching LinkedIn profiles or copying contact info into HubSpot.",
    commonProblems: [
      "Inbound leads waiting hours or days for SDR follow-up.",
      "Inaccurate or incomplete prospect records inside CRM.",
      "Reps spending 30%+ of their working hours on manual prospecting research.",
    ],
    automationOpportunities: [
      "Sub-minute inbound lead enrichment and company size verification",
      "Dynamic qualification rubric based on tech stack and budget criteria",
      "Automated personalized outreach sequencing with human approval",
      "Instant calendar booking sync with round-robin AE routing",
    ],
    exampleWorkflow: {
      title: "Inbound Prospect Flow",
      steps: ["Form Submitted", "Domain Enrichment", "ICP Scoring (>75)", "HubSpot Deal Created", "Personalized Invite Sent", "Slack AE Alert"],
    },
    metricsFocus: [
      "Eliminating delays in lead contact time",
      "Increasing qualified discovery meetings booked",
      "Zero manual contact data entry for sales reps",
    ],
  },
  {
    slug: "customer-support",
    title: "Customer Support Automation",
    department: "Customer Experience & Support",
    tagline: "Deliver instant, accurate, 24/7 customer resolutions across web, email, and messaging channels.",
    description: "Free your human tier-2 and tier-3 support teams from repetitive questions while delighting customers with immediate, verified answers.",
    commonProblems: [
      "Support queues backing up during weekend and holiday spikes.",
      "High agent burnout caused by typing the same 10 responses all day.",
      "Inconsistent answer accuracy across rotating support personnel.",
    ],
    automationOpportunities: [
      "Automated order status lookup and shipping tracking integration",
      "Grounded knowledge base search with guaranteed policy citations",
      "Intelligent ticket triage, sentiment detection, and automated routing",
      "Draft suggestion copilot mode for high-touch accounts",
    ],
    exampleWorkflow: {
      title: "Support Resolution Flow",
      steps: ["Customer Query Ingested", "Policy & Order Retrieval", "Confidence Evaluation", "Instant Accurate Resolution", "Ticket Tagged in Zendesk"],
    },
    metricsFocus: [
      "Immediate first-response resolution for routine inquiries",
      "Dramatic reduction in tier-1 ticket volume",
      "Higher customer satisfaction through consistent 24/7 availability",
    ],
  },
  {
    slug: "operations",
    title: "Operations Automation",
    department: "Business Operations & Systems",
    tagline: "Eliminate human middleware by connecting ERPs, databases, and collaboration tools into resilient automated pipelines.",
    description: "Stop relying on spreadsheets and manual copy-pasting to keep your company running. Build resilient automated backbones.",
    commonProblems: [
      "Data discrepancies between inventory, accounting, and sales systems.",
      "Manual approvals bottlenecking customer fulfillment and vendor orders.",
      "Lack of centralized observability into operational bottlenecks.",
    ],
    automationOpportunities: [
      "Cross-system data sync between legacy SQL databases and modern cloud SaaS",
      "Automated operational approval routing in Slack with 1-click actions",
      "Exception alerting and automated fallback handling on API errors",
      "Automated daily operational KPI rollups and executive summaries",
    ],
    exampleWorkflow: {
      title: "Operational Sync Flow",
      steps: ["New Contract Finalized", "ERP Order Provisioned", "Fulfillment Alert Triggered", "Slack Approval Requested", "Status Logged in Audit Trail"],
    },
    metricsFocus: [
      "Zero manual data re-entry between disconnected software",
      "Accelerated internal approval turnaround from days to minutes",
      "Complete visibility through structured audit trails",
    ],
  },
  {
    slug: "hr",
    title: "HR & Recruitment Automation",
    department: "People & Talent Acquisition",
    tagline: "Streamline talent acquisition, resume parsing, interview scheduling, and new-hire onboarding workflows.",
    description: "Provide candidate and employee experiences that feel high-touch and attentive while automating the administrative paperwork.",
    commonProblems: [
      "Recruiters overwhelmed by sorting hundreds of unqualified job applications.",
      "Scheduling back-and-forth delaying interview rounds and losing top candidates.",
      "Disorganized new-hire document intake creating compliance vulnerabilities.",
    ],
    automationOpportunities: [
      "Automated resume parsing and rubric-based candidate screening",
      "Multi-interviewer calendar coordination and automated invitation dispatch",
      "New employee onboarding document collection and IT provisioning triggers",
      "Internal HR FAQ bot for benefits, time-off, and policy questions",
    ],
    exampleWorkflow: {
      title: "Talent Intake Flow",
      steps: ["Candidate Applies", "Resume Parsed & Scored", "Hiring Manager Review", "Automated Interview Link", "Applicant Tracking System Updated"],
    },
    metricsFocus: [
      "Reduced time-to-first-interview for qualified applicants",
      "Frictionless, compliant employee onboarding paperwork",
      "Instant answers to everyday employee benefits questions",
    ],
  },
  {
    slug: "finance",
    title: "Finance & Accounting Automation",
    department: "Finance, Billing & AP/AR",
    tagline: "Transform paper invoices, receipts, and bank feeds into structured, reconciled financial ledgers automatically.",
    description: "Eliminate manual accounts payable data entry, catch discrepancies early, and close monthly books faster.",
    commonProblems: [
      "Stacks of PDF vendor invoices requiring manual typing into QuickBooks or NetSuite.",
      "Delayed expense report reconciliation and missing receipts.",
      "Risk of duplicate payments or overlooked billing discrepancies.",
    ],
    automationOpportunities: [
      "Multimodal document extraction for invoices, bills of lading, and receipts",
      "Automated 3-way matching between Purchase Order, Bill, and Bank Feed",
      "Intelligent payment authorization workflows with manager approval gates",
      "Automated aging receivable follow-up sequences for overdue accounts",
    ],
    exampleWorkflow: {
      title: "AP Reconciliation Flow",
      steps: ["Invoice Arrives via Email", "OCR Table Extraction", "3-Way PO Match Check", "Controller Sign-off", "NetSuite Bill Created"],
    },
    metricsFocus: [
      "Near-zero transcription errors on invoice line items",
      "Shortened accounts payable processing cycles",
      "Transparent audit trails for financial compliance reviews",
    ],
  },
  {
    slug: "marketing",
    title: "Marketing Automation",
    department: "Growth & Demand Generation",
    tagline: "Connect marketing analytics, multi-channel distribution, and automated content pipelines into a unified engine.",
    description: "Scale your marketing distribution without burning out your creative team on repetitive formatting and scheduling tasks.",
    commonProblems: [
      "Scattered campaign data making cross-channel attribution nearly impossible.",
      "Manual reformatting of core assets for different social and email channels.",
      "Slow response to audience engagement and webinar registrations.",
    ],
    automationOpportunities: [
      "Automated multi-channel campaign performance reporting to Slack",
      "Automated webinar attendee qualification and personalized follow-up sequences",
      "Content repurposing pipelines that format long-form articles into social threads",
      "Real-time UTM tag tracking and CRM attribution synchronization",
    ],
    exampleWorkflow: {
      title: "Content Distribution Flow",
      steps: ["New Whitepaper Published", "AI Summarizer Generates Formats", "Editorial Review in Web App", "Buffer / Hootsuite Scheduled", "UTM Tracking Logged"],
    },
    metricsFocus: [
      "Higher publishing velocity with consistent brand voice",
      "Instantaneous lead capture and follow-up from campaign assets",
      "Accurate multi-touch attribution without manual spreadsheet stitching",
    ],
  },
  {
    slug: "founders",
    title: "Founder & SMB Automation",
    department: "Executive & Small Business",
    tagline: "Operate with the capabilities of a 20-person company with a lean team by deploying connected AI business systems.",
    description: "As a founder or SMB owner, your time is your most precious asset. Automate the admin drudgery so you can focus on product, strategy, and clients.",
    commonProblems: [
      "Founders bogged down doing client intake, invoicing, and email triage.",
      "Inability to afford dedicated full-time specialists for every operational role.",
      "Work falling through the cracks during intense growth periods.",
    ],
    automationOpportunities: [
      "End-to-end client intake, onboarding, and contract generation",
      "Executive inbox assistant that drafts replies and filters noise",
      "Automated monthly invoice creation and follow-up reminders",
      "Autonomous research agent for competitor analysis and market scouting",
    ],
    exampleWorkflow: {
      title: "Founder Time Recovery Flow",
      steps: ["Client Inquires", "AI Enriches & Books Call", "Summary Sent to Founder", "Call Transcribed & Action Items Extracted", "Onboarding Folder Generated"],
    },
    metricsFocus: [
      "Reclaiming 15-20+ hours of founder time per week",
      "Scaling customer volume without immediately adding overhead payroll",
      "Professional, enterprise-grade client touchpoints from day one",
    ],
  },
];
