import {
  AIProvider,
  LeadScoreInput,
  LeadScoreResult,
  SupportDemoInput,
  SupportDemoResult,
  DocumentDemoInput,
  DocumentDemoResult,
  EmailDemoInput,
  EmailDemoResult,
} from "./provider";

export class MockDeterministicProvider implements AIProvider {
  name = "CareerForgeX Deterministic Engine (Interactive Demo)";
  isMock = true;

  async scoreLead(input: LeadScoreInput): Promise<LeadScoreResult> {
    const text = (input.message + " " + input.company + " " + (input.currentTools || "")).toLowerCase();

    let industry = "Technology / SaaS";
    let intent: LeadScoreResult["intent"] = "High Intent";
    let priority: LeadScoreResult["potentialPriority"] = "High";
    let complexity: LeadScoreResult["automationComplexity"] = "Medium (3-5 weeks)";
    let recommendedService = "AI Agents & Connected Workflows";
    let score = 84;

    if (text.includes("real estate") || text.includes("realty") || text.includes("property")) {
      industry = "Real Estate";
      recommendedService = "Sales Automation & Inbound Tour Scheduling";
      complexity = "Low (1-2 weeks)";
      score = 89;
    } else if (text.includes("ecommerce") || text.includes("shopify") || text.includes("store") || text.includes("order")) {
      industry = "E-Commerce & Retail";
      recommendedService = "AI Customer Support & Order Status Automation";
      complexity = "Medium (3-5 weeks)";
      score = 86;
    } else if (text.includes("invoice") || text.includes("accounting") || text.includes("billing") || text.includes("finance")) {
      industry = "Finance & Accounting";
      recommendedService = "Document Intelligence & OCR Reconciliation";
      complexity = "Medium (3-5 weeks)";
      score = 92;
    } else if (text.includes("health") || text.includes("clinic") || text.includes("patient") || text.includes("medical")) {
      industry = "Healthcare";
      recommendedService = "Private VPC RAG & Knowledge Systems";
      complexity = "Enterprise (6+ weeks)";
      score = 94;
    }

    return {
      leadSummary: `${input.company || "Prospect"} is seeking to automate repetitive operational bottlenecks around ${input.message.slice(0, 80)}... Current toolchain includes ${input.currentTools || "Standard business software"}.`,
      intent,
      industry,
      potentialPriority: priority,
      automationComplexity: complexity,
      recommendedService,
      recommendedNextAction: "Book a 30-minute Architecture & Systems Discovery Call to map current API touchpoints.",
      suggestedOutreachEmail: `Hi ${input.name || "there"},\n\nThank you for outlining your automation goals at ${input.company || "your team"}. Based on your note regarding ${input.message.slice(0, 60)}, we have mapped out how an autonomous workflow can bridge your tools without manual data transfers.\n\nWould you have 20 minutes this Thursday to walk through an architectural diagram tailored to your systems?\n\nBest regards,\nCareerForgeX Systems Team`,
      score,
    };
  }

  async resolveSupport(input: SupportDemoInput): Promise<SupportDemoResult> {
    const q = input.question.toLowerCase();

    if (q.includes("refund") || q.includes("return") || q.includes("money back") || q.includes("cancel")) {
      return {
        answer: "Under our standard 30-day satisfaction policy, return requests for undamaged items are processed within 48 hours of warehouse receipt. All original shipping fees are reimbursed if the return is due to carrier transit damage.",
        category: "Policy & Refunds",
        confidenceScore: 96,
        sources: ["Operations_SOP_Section_4.2.pdf", "Customer_Terms_2026.md#returns"],
        escalationRequired: false,
      };
    }

    if (q.includes("track") || q.includes("status") || q.includes("order") || q.includes("shipping") || q.includes("delayed")) {
      return {
        answer: "To locate your consignment, please verify your 8-digit order number (e.g. CFX-9482). Live tracking syncs via FedEx/DHL webhooks every 15 minutes. If your parcel shows no transit scans after 72 hours, our system automatically routes a tracer to carrier dispatch.",
        category: "Order Status",
        confidenceScore: 94,
        sources: ["Carrier_Fulfillment_Guide_v3.pdf", "Live_Shipment_Database_API"],
        escalationRequired: false,
      };
    }

    if (q.includes("api") || q.includes("webhook") || q.includes("error") || q.includes("auth") || q.includes("500") || q.includes("broken")) {
      return {
        answer: "For API webhook validation, ensure your HMAC-SHA256 signature header matches your organization secret. Signature mismatches commonly occur when the raw request payload body is parsed into JSON before hash verification.",
        category: "Technical Integration",
        confidenceScore: 91,
        sources: ["API_Developer_Reference_v2.6#signatures", "Webhook_Security_Whitepaper.pdf"],
        escalationRequired: true,
        escalationReason: "Technical query contains error diagnostics; flagging for Tier-2 Systems Engineer review.",
        suggestedInternalNote: "Customer encountered webhook signature mismatch. Reviewing organization payload signature header.",
      };
    }

    return {
      answer: "Thank you for contacting CareerForgeX support. We have verified your query against our internal knowledge base and connected business SOPs. Our team can deploy dedicated workflows to resolve this operational requirement seamlessly.",
      category: "General",
      confidenceScore: 88,
      sources: ["General_FAQ_Knowledge_Graph", "Company_Operations_Handbook_2026"],
      escalationRequired: false,
    };
  }

  async extractDocument(input: DocumentDemoInput): Promise<DocumentDemoResult> {
    const name = input.fileName.toLowerCase();

    if (name.includes("invoice") || name.includes("inv") || name.includes("bill")) {
      return {
        documentType: "Invoice",
        date: "2026-09-18",
        company: "Vanguard Industrial Supplies Ltd.",
        amount: "$14,850.00 USD",
        referenceNumber: "INV-2026-88914",
        extractedFields: {
          subtotal: "$13,500.00",
          taxRate: "10%",
          taxAmount: "$1,350.00",
          dueDate: "2026-10-18",
          paymentTerms: "Net 30",
          currency: "USD",
          vendorTaxId: "US-8849102-X",
          lineItemCount: 4,
          primaryItem: "Enterprise Sensor Units Type-B (Qty: 50)",
        },
        summary: "Standard 30-day hardware supply invoice with verified PO match #PO-2026-4412. No price discrepancies detected.",
        confidenceScore: 98.4,
      };
    }

    if (name.includes("po") || name.includes("purchase") || name.includes("order")) {
      return {
        documentType: "Purchase Order",
        date: "2026-09-15",
        company: "Stratos Engineering Group",
        amount: "$32,400.00 USD",
        referenceNumber: "PO-77192",
        extractedFields: {
          requestedDeliveryDate: "2026-10-10",
          authorizedSignatory: "H. Kowalski (VP Procurement)",
          costCenter: "CC-904 Engineering Operations",
          shippingTerms: "FOB Destination",
        },
        summary: "Approved commercial purchase order for technical equipment. Matches approved budget allocation.",
        confidenceScore: 97.2,
      };
    }

    return {
      documentType: "Contract / NDA",
      date: "2026-09-22",
      company: "Meridian Systems Partner Corp",
      referenceNumber: "AGR-2026-041",
      extractedFields: {
        governingLaw: "State of Delaware",
        confidentialityPeriod: "3 Years from Effective Date",
        liabilityCap: "12 Months Fees Paid",
        ipOwnership: "Client Retains All Pre-existing IP",
        terminationNotice: "30 Days Written Notice",
      },
      summary: "Mutual Non-Disclosure Agreement and Services Framework. Standard enterprise terms with standard bilateral IP protection.",
      confidenceScore: 96.8,
    };
  }

  async classifyEmail(input: EmailDemoInput): Promise<EmailDemoResult> {
    const text = input.emailContent.toLowerCase();

    if (text.includes("pricing") || text.includes("demo") || text.includes("quote") || text.includes("audit") || text.includes("services")) {
      return {
        classification: "Sales",
        sentiment: "Positive",
        urgency: "Immediate",
        keyEntities: ["Inbound Lead", "Budget Inquiry", "Workflow Automation"],
        suggestedAction: "Enrich prospect domain, sync to HubSpot Deals pipeline, and dispatch calendar booking link.",
        draftedResponse: "Hello,\n\nThanks for reaching out! We would be delighted to audit your repetitive workflows and demonstrate our AI systems in action. You can select a convenient slot directly on our systems calendar here: https://careerforgex.com/book\n\nLooking forward to speaking,\nCareerForgeX Solutions Team",
      };
    }

    if (text.includes("broken") || text.includes("bug") || text.includes("issue") || text.includes("help") || text.includes("not working")) {
      return {
        classification: "Support",
        sentiment: "Frustrated",
        urgency: "Immediate",
        keyEntities: ["Incident Report", "System Error", "High Priority"],
        suggestedAction: "Create Zendesk urgent ticket, tag on-call engineer in Slack #ops-alerts, and notify customer of investigation.",
        draftedResponse: "Hi there,\n\nWe have received your report and our engineering team is actively investigating the error log you noted. We will update you with our remediation within the next 45 minutes.\n\nCareerForgeX Systems Operations",
      };
    }

    if (text.includes("invoice") || text.includes("remittance") || text.includes("payment") || text.includes("wire") || text.includes("bank")) {
      return {
        classification: "Finance",
        sentiment: "Neutral",
        urgency: "Within 24 Hours",
        keyEntities: ["Invoice Processing", "Remittance Advice", "Accounts Payable"],
        suggestedAction: "Route attachment to OCR Document Intelligence pipeline and verify against open Accounts Payable register.",
        draftedResponse: "Thank you. Your invoice has been received and routed to our automated billing reconciliation queue. Reference confirmation will follow shortly.",
      };
    }

    return {
      classification: "Other",
      sentiment: "Neutral",
      urgency: "Within 24 Hours",
      keyEntities: ["General Communication"],
      suggestedAction: "Archive or route to general inquiries triage queue.",
      draftedResponse: "Thank you for reaching out to CareerForgeX. We have acknowledged your note and routed it to the relevant team.",
    };
  }

  async chatCopilot(query: string, context?: Record<string, any>): Promise<string> {
    const q = query.toLowerCase();

    if (q.includes("new leads") || q.includes("leads this week")) {
      return `📊 **Lead Intelligence Summary:**\n- There are **4 active leads** currently in the pipeline.\n- **Apex Global Logistics (Demo)**: Qualified ($10k-$25k) - Document Intelligence.\n- **Vance Commercial Realty (Demo)**: Discovery ($5k-$10k) - Sales WhatsApp Agent.\n- **Novas BioAnalytics (Demo)**: Proposal ($25k-$50k) - Private VPC RAG.\n- **Kite Apparel Co. (Demo)**: New ($5k-$10k) - E-commerce Support.\n\nWould you like me to draft follow-up outreach for any specific prospect?`;
    }

    if (q.includes("sales automation") || q.includes("which leads")) {
      return `🎯 **Sales Automation Enquiries:**\n- **Vance Commercial Realty (Demo)**: Real Estate agency requesting automated inbound qualification and WhatsApp tour booking. Status: **Discovery**.\n- Next step: Review confirmed calendar slot on October 2nd.`;
    }

    if (q.includes("draft") || q.includes("follow-up")) {
      return `✉️ **Suggested Outreach Draft:**\n\n**Subject:** Next steps: Automating document workflows at your team\n\n**Body:**\nHi Elena,\n\nFollowing up on your automation request regarding carrier invoice extraction and Slack exception alerts. We've drafted a reference architecture that connects your SAP and Microsoft 365 environments without custom code maintenance.\n\nWould you like to review the step-by-step canvas during our discovery call?\n\nBest,\nAlex Sterling — Lead AI Architect`;
    }

    return `🤖 **CareerForgeX Admin Copilot:** I can assist with pipeline queries, lead summarization, execution approval checks, and outbound email drafting. What would you like to inspect?`;
  }
}
