# CareerForgeX — Autopilot Architecture & Specification

CareerForgeX is designed and engineered as a self-updating, autonomous student opportunity discovery and intelligence system. It eliminates the need for manual daily data entry by continuously monitoring official institutional portals, research institutes, and corporate programs.

---

## 1. Core Vision: Opportunity Intelligence

CareerForgeX continuously maintains:
* **Research Internships**: Indian and international premier institutions (IITs, IISc, IISERs, TIFR, Max Planck).
* **Summer & Winter Internships**: Flagship undergraduate and postgraduate seasonal programs.
* **Research Assistant / Project Positions**: Sponsored projects under DST, SERB, CSIR, and faculty grants.
* **Higher-Study & PhD Admissions**: Direct PhD schemes (PMRF), institutional doctoral admissions.
* **Scholarships & Fellowships**: DAAD WISE, Rhodes, Fulbright-Nehru, Charpak, and national fellowships.
* **Student Competitions & Hackathons**: Top national and international collegiate contests.

```
INTERNET
   ↓
SOURCE DISCOVERY (Automated Sitemaps & Directories)
   ↓
SOURCE MONITORING (Configurable Check Frequency & Priority)
   ↓
SMART FETCH (ETag / Last-Modified / SHA-256 Hash)
   ↓
CHANGE DETECTION (Bypass Unchanged Pages)
   ↓
UNIVERSAL ADAPTERS (HTML, RSS, Atom, JSON, Sitemap, PDF)
   ↓
STRICT AI & RULE EXTRACTION (Zero-Hallucination Policy)
   ↓
VALIDATION & CONTROLLED TAXONOMY CLASSIFICATION
   ↓
MULTI-SIGNAL DEDUPLICATION (Canonical URL, Jaccard Similarity, Deadlines)
   ↓
SOURCE VERIFICATION & RELIABILITY TIERS (Tier 1 Premier to Tier 4)
   ↓
CONFIDENCE ENGINE (Scoring 0–100)
   ↓
AUTO-PUBLISH (Score >= 80) / REVIEW QUEUE (Score 50–79)
   ↓
DATABASE (Prisma ORM: PostgreSQL / Supabase / SQLite)
   ↓
CAREERFORGX WEBSITE (Dynamic Database-Driven Frontend)
   ↓
STUDENT SEARCH / SAVE / NOTIFICATION ALERTS
```

---

## 2. Zero-Daily-Manual-Update Principle

Traditional job portals require manual copy-pasting from university portals every day.
CareerForgeX reverses this paradigm:
* The administrator sets up the ecosystem once.
* The autonomous background daemon (`src/worker/runner.ts`) performs the recurring work.
* Manual administration is strictly an exception reserved for edge-case review ($50 \le \text{Confidence} < 80$), degraded source alerts, or manual overrides.

---

## 3. Autonomous Scheduler & Background Worker

The scheduler runs independently of any user browser or laptop:
* Standalone process: `npm run worker` or `tsx src/worker/runner.ts`.
* Configurable polling interval (`WORKER_INTERVAL_MS`, default 60 seconds).
* Per-source scheduling parameters:
  * `checkFrequency` (minutes)
  * `priority` (1 = high, 2 = normal, 3 = low)
  * `lastCheckedAt` & `nextCheckAt`
* Automatically queries due sources (`nextCheckAt <= now()`).
* In one-shot mode (`--once`), executes a single scheduling tick suitable for cloud cron triggers.

---

## 4. Automatic Source Discovery & Trust Classification

Prospective sources enter a controlled verification funnel:
```
DISCOVERED → SOURCE VALIDATION → TRUST CLASSIFICATION → ACTIVE / REVIEW / BLOCKED
```
* **Discovery Channels**: XML Sitemaps, outbound links from official circulars, institutional directories (`iit*.ac.in`, `nit*.ac.in`, `iiser*.ac.in`, `*.res.in`).
* **Quarantine**: Newly discovered domains are stored in `DiscoveredSource` with trust tier ratings before promotion to active scraping.

---

## 5. Source Reliability Tiers

* **Tier 1 (Official Premier)**: Direct IITs, NITs, IISc, IISERs, CSIR, TIFR, or verified corporate career portals (e.g. Google Careers). Checked every 3–6 hours.
* **Tier 2 (Institutional)**: Accredited central/state universities. Checked every 6–12 hours.
* **Tier 3 (Secondary)**: Educational circular digests. Checked every 12–24 hours.
* **Tier 4 (Unverified / Community)**: Awaiting administrative review.

---

## 6. Universal Source Adapters

Pluggable modular parsers in `src/lib/automation/adapters/`:
* `HTMLAdapter`: Handles university tables, circular pages, and semantic HTML notices.
* `RSSAdapter` & `AtomAdapter`: Ingests syndication feeds.
* `JSONAdapter`: Ingests REST APIs (e.g. Google Careers API).
* `SitemapAdapter`: Parses XML sitemaps to discover new links.
* `PDFAdapter`: Ingests text and deadlines from official advertisement PDFs.
* `PlaywrightAdapter`: Hydrates dynamic JavaScript SPAs.

---

## 7. Smart Fetching & Change Detection

* Conditional HTTP requests using `If-None-Match` (`ETag`) and `If-Modified-Since` (`Last-Modified`).
* Computes `SHA-256` body hash.
* If content is unchanged:
  * Pipeline skips expensive AI extraction and database writes.
  * Updates `lastCheckedAt` and advances `nextCheckAt`.
* Polite crawling with domain throttling and exponential backoff retry.
* Failure isolation: One source timeout or HTTP 500 error never blocks other sources.

---

## 8. AI Extraction & Zero-Hallucination Policy

The extraction engine (`src/lib/automation/extractor.ts`) extracts 18 structured fields:
* `title`, `organization`, `opportunityType`, `shortSummary`, `fullDescription`, `eligibility`, `degreeRequirements`, `yearRequirements`, `branchRequirements`, `domain`, `skills`, `location`, `mode`, `duration`, `stipend`, `salary`, `deadline`, `applicationUrl`, `sourceUrl`.
* **Zero Hallucination**: If a field is not present in the source text, it is strictly set to `null`. Missing stipends, deadlines, or degree criteria are never invented.

---

## 9. Multi-Signal Deduplication

Prevents duplicate entries across repeated crawls, circular revisions, and mirror pages:
1. Exact Canonical / Source / Application URL match.
2. Jaccard word-token similarity on titles $\ge 0.85$ + matching organization $\rightarrow$ `EXACT_MATCH`.
3. Same deadline + title similarity $\ge 0.65 \rightarrow$ `LIKELY_DUPLICATE`.
4. Title similarity $\ge 0.70 \rightarrow$ `LIKELY_DUPLICATE`.

---

## 10. In-Place Automatic Updates

When an existing opportunity is modified at the source:
* The existing record is updated in-place (no confusing `"IIT Bombay - New"` duplicates).
* An audit entry is written to `OpportunityChangeLog` with `fieldName`, `oldValue`, `newValue`, `changedAt`, `source`, and `actorType: 'SYSTEM'`.

---

## 11. Real-Time Deadline Lifecycle Engine

Calculated dynamically on every query and synchronized by the worker:
* `daysRemaining > 3` $\rightarrow$ `OPEN`
* `0 <= daysRemaining <= 3` $\rightarrow$ `CLOSING_SOON`
* `daysRemaining < 0` $\rightarrow$ `EXPIRED`
* No deadline $\rightarrow$ `NO_DEADLINE`
* Records expired for more than 30 days are automatically transitioned to `ARCHIVED`.

---

## 12. Confidence & Auto-Publish Engine

Scoring matrix ($0 - 100$):
* Official Source Tier 1: $+30$
* Valid Application URL: $+20$
* Organization Identified: $+15$
* Definite Deadline: $+15$
* Detailed Eligibility: $+10$
* Clean Schema: $+10$

Routing:
* **Score $\ge 80$ & Tier 1/2**: Automatically published (`PUBLISHED`).
* **Score $50 - 79$ or Duplicate Flag**: Routed to Admin Review Queue (`PENDING_REVIEW`).
* **Score $< 50$**: Flagged or rejected (`REJECTED`).

---

## 13. Source Health Monitoring & Emergency Controls

* **Heartbeat**: Worker writes heartbeat timestamp to `system_metrics` (`last_worker_heartbeat`) every minute.
* **Degraded Detection**: 3 consecutive failures trigger `status = 'DEGRADED'` and raise a `SystemAlert`.
* **Emergency Controls** (via UI or `/api/admin/automation/control`):
  * `PAUSE_ALL`: Immediately halts all active ingestion.
  * `RESUME_ALL`: Clears emergency pause.
  * `RUN_SOURCE_NOW`: Triggers immediate fetch of any source.
  * `REPROCESS_FAILED`: Resets error counters and re-queues degraded sources.

---

## 14. Personalized Student Alert Dispatch

When a new opportunity is published:
* System queries matching student alert preferences (`user_alert_preferences`).
* Checks opportunity types, domains, and keywords.
* Dispatches notification events to the student's in-app feed (`notifications` table).
