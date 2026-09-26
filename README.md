# CareerForgeX

> Discover Opportunities. Build Your Career.

CareerForgeX is a production-ready, self-updating, autonomous student opportunity discovery and intelligence platform. It continuously indexes, extracts, verifies, updates, and tracks deadlines for premier student opportunities across India's top academic institutions (IITs, IISc, IISERs, TIFR, CSIR) and global research labs—**with zero daily manual data entry**.

[![CareerForgeX CI](https://github.com/careerforgex/careerforgex/actions/workflows/ci.yml/badge.svg)](https://github.com/careerforgex/careerforgex/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-darkblue.svg)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Vitest-Tested-green.svg)](https://vitest.dev/)

---

## 🌟 Key Features

* **Autonomous Background Pipeline**: Decoupled worker process continuously monitors official institutional portals independent of browser sessions.
* **Smart Fetching & Change Detection**: Utilizes conditional HTTP (`ETag`, `Last-Modified`) and `SHA-256` content hashing to skip processing when content is unchanged, minimizing compute and AI costs.
* **Universal Modular Adapters**: Pluggable source parsers for `HTML`, `RSS 2.0`, `Atom`, `JSON REST`, `APIs`, `XML Sitemaps`, `PDF Notices`, and `Playwright Dynamic Hydration`.
* **Zero-Hallucination AI & Rule Extractor**: Extracts title, organization, stipend, deadlines, and degree criteria with absolute strictness. If a field is absent, it is strictly `null`.
* **Multi-Signal Duplicate Detection**: Eliminates duplicates across multiple pages, circular updates, or reposts using URL matching, Jaccard title token overlap, and deadline comparisons.
* **In-Place Updates & Audit Trail**: Updates existing opportunities when deadlines or stipends change, recording exact old vs new values in `OpportunityChangeLog` without creating confusing duplicates.
* **Real-Time Deadline Engine**: Automatically calculates days remaining and renders urgency badges (*"Closing today"*, *"Closing in 2 days"*, *"Deadline passed"*), auto-archiving stale records after 30 days.
* **Confidence & Auto-Publish Engine**: High-confidence extractions ($\ge 80\%$) from verified official portals are published automatically; uncertain extractions are routed to the Admin Review Queue.
* **Source Health & Emergency Controls**: Real-time heartbeat telemetry, failure isolation, degraded source detection, and one-click emergency controls (*"Pause All Ingestion"*, *"Run Source Now"*).
* **Personalized Alerts & Student Bookmarks**: Students can filter by domain, degree level, or category, save bookmarks, and subscribe to notifications.
* **Public Source Transparency**: Every opportunity clearly displays official source attribution, original links, and last-verified timestamps.

---

## 🏗️ Architecture Overview

```
                      🌐 PUBLIC INTERNET
                              ↓
                   🔍 AUTO SOURCE DISCOVERY
                              ↓
                  🕐 AUTOMATIC SCHEDULER (DAEMON)
                              ↓
                      🤖 SMART FETCH (ETag / SHA-256)
                              ↓
                  📋 UNIVERSAL SOURCE ADAPTERS
                              ↓
                  🧠 AI & RULE EXTRACTION ENGINE
                              ↓
                  ✅ VALIDATION & TAXONOMY CLASSIFICATION
                              ↓
                      🔁 MULTI-SIGNAL DEDUPLICATION
                              ↓
               ┌──────────────┴──────────────┐
               ↓                             ↓
          EXACT MATCH                  NEW CANDIDATE
               ↓                             ↓
        UPDATE IN-PLACE               CONFIDENCE ROUTING
       & WRITE CHANGELOG                     ↓
               │               ┌─────────────┴─────────────┐
               │               ↓                           ↓
               │        HIGH CONFIDENCE                UNCERTAIN
               │               ↓                           ↓
               │         AUTO-PUBLISH                REVIEW QUEUE
               │               ↓                           ↓
               └───────────────┬───────────────────────────┘
                               ↓
                        SUPABASE / SQLITE
                               ↓
                      🌐 CAREERFORGX WEBSITE
                               ↓
                    👨🎓 STUDENT SEARCH & ALERTS
```

---

## 🚀 Quick Start (Local Setup in 2 Minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/careerforgex/careerforgex.git
cd careerforgex
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```
*(By default, `.env.example` is configured for local zero-config SQLite development with zero required paid API keys.)*

### 4. Initialize Database & Seed Premier Sources
```bash
# Push Prisma schema to SQLite database (dev.db)
npm run prisma:push

# Seed premier official sources (IIT Bombay, IIT Madras, IISc, TIFR, Google Careers, PMRF, DAAD)
npm run prisma:seed
```

### 5. Run the Test Suite
```bash
npm run test
```
All 14 unit and pipeline tests will execute and pass via Vitest.

### 6. Launch Web Application & Autonomous Worker

**Terminal 1 — Web Application:**
```bash
# For development mode with hot reload:
npm run dev

# Or for optimized production server:
npm run build && npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

**Terminal 2 — Autonomous Background Worker Daemon:**
```bash
npm run worker
```
The worker will begin continuous autonomous scheduling and display:
```
[Worker] CareerForgeX Autopilot Daemon started. Polling interval: 60s
[Worker Tick] Checking due sources and synchronizing deadlines...
```

---

## 🔑 Administrative Access & Portal Links

* **Public Opportunity Directory**: [http://localhost:3000/opportunities](http://localhost:3000/opportunities)
* **Closing Soon Alert Portal**: [http://localhost:3000/opportunities?status=CLOSING_SOON](http://localhost:3000/opportunities?status=CLOSING_SOON)
* **Student Saved Bookmarks**: [http://localhost:3000/saved](http://localhost:3000/saved)
* **Personalized Alerts**: [http://localhost:3000/alerts](http://localhost:3000/alerts)
* **Admin Autopilot Telemetry Dashboard**: [http://localhost:3000/admin/automation](http://localhost:3000/admin/automation)
* **Admin Review Queue**: [http://localhost:3000/admin/review](http://localhost:3000/admin/review)
* **Admin Source Registry**: [http://localhost:3000/admin/sources](http://localhost:3000/admin/sources)

**Default Admin Credentials:**
* **Email**: `admin@careerforgex.com`
* **Password**: `AdminCareerForgeX2026!`

---

## 📖 In-Depth Documentation

* **[Project Architecture & Data Flow](docs/ARCHITECTURE.md)**
* **[Autopilot Engine Reference](docs/AUTOMATION.md)**
* **[Universal Source Adapters Guide](SOURCE_ADAPTER_GUIDE.md)**
* **[Adding New Sources Step-by-Step](docs/ADDING-SOURCES.md)**
* **[Database Schema & ER Diagram](docs/DATABASE.md)**
* **[API Route Documentation](docs/API.md)**
* **[Administrator Manual](docs/ADMIN.md)**
* **[Failure Recovery & Self-Healing](FAILURE_RECOVERY.md)**
* **[Production Deployment (Docker & Serverless)](docs/DEPLOYMENT.md)**

---

## 🔒 Security & Source Transparency

* **Responsible Crawling**: CareerForgeX honors request throttling, exponential backoff, and never bypasses paywalls or authentication controls.
* **Attribution**: All indexed opportunities link directly to the official host institution's portal. CareerForgeX is an independent opportunity intelligence system; the original institutions remain the sole authorities for selection criteria and notices.

---

## 📄 License

License to be determined by the project owner. Copyright (c) 2026 CareerForgeX Team.
