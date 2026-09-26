# CareerForgeX — Adding New Sources Guide

This guide walks through registering, testing, and activating new official institutional sources in CareerForgeX.

---

## 1. Source Registration Flow

```
Discover / Identify Official URL
               │
               ▼
   Select Universal Adapter (HTML, RSS, Atom, JSON, Sitemap, PDF)
               │
               ▼
   Configure Check Frequency & Reliability Tier
               │
               ▼
   Test Fetch & Extraction (Dry Run)
               │
               ▼
   Activate Autonomous Monitoring
```

---

## 2. Step-by-Step Instructions

### Step 1: Access the Source Registry
Log in to the Admin Dashboard and open `/admin/sources`.

### Step 2: Fill in Source Parameters
* **Name**: Descriptive institutional name (e.g. *IIT Gandhinagar Summer Research Internship*).
* **Slug**: Unique URL slug (e.g. `iit-gandhinagar-srip`).
* **Source URL**: Direct link to the announcements or circular page (e.g. `https://srip.iitgn.ac.in/`).
* **Source Type**: `iit`, `nit`, `iisc`, `iiser`, `university`, `government`, `corporate`, or `scholarship`.
* **Reliability Tier**:
  * **Tier 1 (Official Premier)**: IIT, NIT, IISc, IISER, CSIR, TIFR, or verified corporate career portal.
  * **Tier 2 (Institutional)**: Accredited central/state universities.
  * **Tier 3 (Secondary)**: Educational circular digests.
* **Adapter Type**:
  * `html`: For standard web tables and HTML announcement pages.
  * `rss` / `atom`: For portals providing syndication feeds.
  * `json` / `api`: For REST API endpoints (e.g. Google Careers, Workday).
  * `pdf`: For direct links to PDF notices.
* **Check Frequency (Minutes)**:
  * 180 (3 hours): High-turnover corporate internships.
  * 360 (6 hours): Premier research portals during summer/winter intake season.
  * 720 (12 hours): Regular institutional noticeboards.
  * 1440 (24 hours): Annual scholarship and fellowship schemes.

### Step 3: Register via API or Seed Script
You can also insert sources programmatically via `POST /api/admin/sources`:
```json
{
  "name": "IIT Gandhinagar SRIP Portal",
  "slug": "iit-gandhinagar-srip",
  "url": "https://srip.iitgn.ac.in/",
  "sourceType": "iit",
  "tier": 1,
  "adapterType": "html",
  "checkFrequency": 360,
  "priority": 1,
  "status": "ACTIVE",
  "trustStatus": "TRUSTED"
}
```

### Step 4: Validate Immediate Execution
Click **"Run Now"** on `/admin/sources` or invoke:
```bash
curl -X POST http://localhost:3000/api/admin/automation/control \
  -H "Content-Type: application/json" \
  -d '{"action": "RUN_SOURCE_NOW", "sourceId": "<SOURCE_ID>"}'
```
Inspect the returned items, confidence scores, and ensure opportunities appear on the public website.
