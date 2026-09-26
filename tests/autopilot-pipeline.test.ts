import { describe, it, expect, beforeEach } from "vitest";
import { AdapterResolver } from "../src/lib/automation/adapters/adapter-resolver";
import { RSSAdapter } from "../src/lib/automation/adapters/rss-adapter";
import { AtomAdapter } from "../src/lib/automation/adapters/atom-adapter";
import { JSONAdapter } from "../src/lib/automation/adapters/json-adapter";
import { HTMLAdapter } from "../src/lib/automation/adapters/html-adapter";
import { SitemapAdapter } from "../src/lib/automation/adapters/sitemap-adapter";
import { PDFAdapter } from "../src/lib/automation/adapters/pdf-adapter";
import { OpportunityClassifier } from "../src/lib/automation/classifier";
import { OpportunityExtractor } from "../src/lib/automation/extractor";
import { DeadlineEngine } from "../src/lib/automation/deadline-engine";
import { OpportunityPublisher } from "../src/lib/automation/publisher";
import { OpportunityDeduplicator } from "../src/lib/automation/deduplicator";

describe("CareerForgeX Autonomous Opportunity Pipeline Test Suite", () => {
  // Test 1: Adapter Resolver routing
  it("should resolve the correct adapter by type and URL pattern", () => {
    expect(AdapterResolver.resolve("rss").adapterType).toBe("rss");
    expect(AdapterResolver.resolve("atom").adapterType).toBe("atom");
    expect(AdapterResolver.resolve("json").adapterType).toBe("json");
    expect(AdapterResolver.resolve("html").adapterType).toBe("html");
    expect(AdapterResolver.resolve("pdf").adapterType).toBe("pdf");
    expect(AdapterResolver.resolve("sitemap").adapterType).toBe("sitemap");
    expect(AdapterResolver.resolve("playwright").adapterType).toBe("playwright");

    // URL inference fallback
    expect(AdapterResolver.resolve(null, "https://example.com/feed.rss").adapterType).toBe("rss");
    expect(AdapterResolver.resolve(null, "https://example.com/sitemap.xml").adapterType).toBe("sitemap");
    expect(AdapterResolver.resolve(null, "https://example.com/notice.pdf").adapterType).toBe("pdf");
    expect(AdapterResolver.resolve(null, "https://example.com/api/jobs.json").adapterType).toBe("json");
  });

  // Test 2: RSS Adapter Parsing
  it("should parse RSS feeds into normalized raw opportunity payloads", async () => {
    const rssAdapter = new RSSAdapter();
    const mockRssXml = `
      <rss version="2.0">
        <channel>
          <title>IIT Research Notices</title>
          <item>
            <title>Summer Research Fellowship in Machine Learning 2027</title>
            <link>https://iit.ac.in/fellowship/sfp2027</link>
            <description>Applications invited for 8-week summer research in AI. Stipend: Rs. 15,000 pm.</description>
            <pubDate>Mon, 15 Mar 2027 10:00:00 GMT</pubDate>
            <guid>sfp-2027-01</guid>
          </item>
        </channel>
      </rss>
    `;

    const items = await rssAdapter.parse(
      {
        url: "https://iit.ac.in/rss",
        status: 200,
        statusText: "OK",
        contentHash: "hash123",
        body: mockRssXml,
      },
      {
        id: "source_1",
        name: "IIT Research",
        url: "https://iit.ac.in/rss",
        adapterType: "rss",
        adapterVersion: "1.0.0",
        parserVersion: "1.0.0",
      }
    );

    expect(items.length).toBe(1);
    expect(items[0].title).toBe("Summer Research Fellowship in Machine Learning 2027");
    expect(items[0].sourceUrl).toBe("https://iit.ac.in/fellowship/sfp2027");
    expect(items[0].guid).toBe("sfp-2027-01");
  });

  // Test 3: HTML Adapter Keyword & Context Detection
  it("should detect opportunity links and extract contextual deadline strings from HTML", async () => {
    const htmlAdapter = new HTMLAdapter();
    const mockHtml = `
      <html>
        <body>
          <div class="announcements">
            <p>Last date: 15/10/2026</p>
            <a href="/research/summer-internship-2026">Call for Summer Internship Applications 2026</a>
            <p>Unrelated news: Annual convocation ceremony.</p>
          </div>
        </body>
      </html>
    `;

    const items = await htmlAdapter.parse(
      {
        url: "https://iitb.ac.in/portal",
        status: 200,
        statusText: "OK",
        contentHash: "hash456",
        body: mockHtml,
      },
      {
        id: "source_2",
        name: "IIT Bombay",
        url: "https://iitb.ac.in/portal",
        adapterType: "html",
        adapterVersion: "1.0.0",
        parserVersion: "1.0.0",
      }
    );

    expect(items.length).toBe(1);
    expect(items[0].title).toContain("Summer Internship");
    expect(items[0].applicationUrl).toBe("https://iitb.ac.in/research/summer-internship-2026");
    expect(items[0].deadlineString).toBe("15/10/2026");
  });

  // Test 4: Classification Taxonomy
  it("should classify categories, domains, and work modes according to controlled taxonomy", () => {
    const res1 = OpportunityClassifier.classify(
      "Summer Research Fellowship in Quantum Computing",
      "Selected fellows will work on-site at Bengaluru campus. Stipend of Rs 15,000 per month provided."
    );
    expect(res1.opportunityType).toBe("Fellowship");
    expect(res1.domain).toBe("Physics & Quantum Sciences");
    expect(res1.mode).toBe("On-site");
    expect(res1.isPaid).toBe(true);

    const res2 = OpportunityClassifier.classify(
      "Remote AI Software Engineering Intern",
      "Work from home opportunity in PyTorch, Python, and natural language processing."
    );
    expect(res2.opportunityType).toBe("Internship");
    expect(res2.domain).toBe("Computer Science / AI");
    expect(res2.mode).toBe("Remote");
  });

  // Test 5: Deterministic AI Extractor (Zero-Hallucination Policy)
  it("should extract structured data without hallucinating missing fields", () => {
    const raw = {
      title: "IIT Madras Research Project Assistant",
      sourceUrl: "https://iitm.ac.in/project/101",
      fullContent: `
        Applications are invited for Project Associate.
        Eligibility: B.Tech in CSE with minimum 7.5 CGPA.
        Stipend: ₹25,000 / month.
        Last date: 2026-11-30.
        Apply at: https://iitm.ac.in/apply
      `,
    };

    const extracted = OpportunityExtractor.extractDeterministic(raw, "IIT Madras");

    expect(extracted.title).toBe("IIT Madras Research Project Assistant");
    expect(extracted.organization).toBe("IIT Madras");
    expect(extracted.opportunityType).toBe("Research Project");
    expect(extracted.stipend).toBe("₹25,000 / month");
    expect(extracted.isPaid).toBe(true);
    expect(extracted.deadline).toBeInstanceOf(Date);
    expect(extracted.salary).toBeNull(); // Strictly null when unavailable
  });

  // Test 6: Deadline Status Calculation & Countdown
  it("should calculate correct deadline statuses and labels relative to current date", () => {
    const referenceDate = new Date("2026-10-01T00:00:00Z");

    // 10 days in future -> OPEN
    const futureDate = new Date("2026-10-11T00:00:00Z");
    const openCalc = DeadlineEngine.calculateStatus(futureDate, referenceDate);
    expect(openCalc.status).toBe("OPEN");
    expect(openCalc.daysRemaining).toBe(10);
    expect(openCalc.badgeVariant).toBe("success");

    // 2 days in future -> CLOSING_SOON
    const soonDate = new Date("2026-10-03T00:00:00Z");
    const soonCalc = DeadlineEngine.calculateStatus(soonDate, referenceDate);
    expect(soonCalc.status).toBe("CLOSING_SOON");
    expect(soonCalc.daysRemaining).toBe(2);
    expect(soonCalc.badgeVariant).toBe("warning");

    // Past date -> EXPIRED
    const pastDate = new Date("2026-09-25T00:00:00Z");
    const expiredCalc = DeadlineEngine.calculateStatus(pastDate, referenceDate);
    expect(expiredCalc.status).toBe("EXPIRED");
    expect(expiredCalc.daysRemaining).toBeLessThan(0);
    expect(expiredCalc.badgeVariant).toBe("danger");

    // No deadline -> NO_DEADLINE
    const nullCalc = DeadlineEngine.calculateStatus(null, referenceDate);
    expect(nullCalc.status).toBe("NO_DEADLINE");
    expect(nullCalc.daysRemaining).toBeNull();
  });

  // Test 7: Confidence Scoring & Auto-Publish Decision Rules
  it("should auto-publish high-confidence opportunities from Tier-1 official sources", () => {
    const highConfidenceData = {
      title: "IISc Summer Research Internship 2027",
      organization: "IISc Bangalore",
      opportunityType: "Research" as const,
      shortSummary: "Verified 8-week summer internship in AI.",
      fullDescription: "Detailed description of research internship with eligibility.",
      eligibility: "Pre-final year students with minimum 8.0 CGPA.",
      domain: "Computer Science / AI",
      mode: "On-site" as const,
      applicationUrl: "https://iisc.ac.in/apply",
      sourceUrl: "https://iisc.ac.in/admissions",
      deadline: new Date("2026-12-01"),
      isPaid: true,
    };

    // Tier 1 official source
    const evaluation = OpportunityPublisher.evaluateConfidence(highConfidenceData, 1, "TRUSTED");
    expect(evaluation.totalScore).toBeGreaterThanOrEqual(80);
    expect(evaluation.recommendedAction).toBe("AUTO_PUBLISH");

    const status = OpportunityPublisher.resolveStatus(evaluation, "NEW");
    expect(status).toBe("PUBLISHED");
  });

  // Test 8: Deduplication Jaccard Word-Token Similarity
  it("should accurately compute title similarity for duplicate detection", () => {
    const title1 = "IIT Bombay Summer Research Internship in AI 2026";
    const title2 = "IIT Bombay Summer Research Internship in AI (2026)";
    const similarity = OpportunityDeduplicator.computeTitleSimilarity(title1, title2);
    expect(similarity).toBeGreaterThan(0.8);

    const title3 = "Google Software Engineering Full Time New Graduate 2026";
    const crossSimilarity = OpportunityDeduplicator.computeTitleSimilarity(title1, title3);
    expect(crossSimilarity).toBeLessThan(0.2);
  });
});
