# CareerForgeX — Automation Setup Guide

This guide covers setting up, running, and maintaining the autonomous opportunity ingestion engine for CareerForgeX.

---

## 1. Operating Principle: Zero Daily Manual Work

CareerForgeX is designed so that administrators do not manually enter or update opportunities on a daily basis. 
Once initialized, the autonomous worker and scheduler run continuously:
* Due official sources are queried based on priority and configurable intervals.
* Content is fetched politely with ETag, Last-Modified, and cryptographic SHA-256 hash checks.
* Unchanged web pages are bypassed immediately to minimize compute and API cost.
* New and updated opportunities are extracted with a strict zero-hallucination guarantee.
* High-confidence opportunities (Score $\ge 80$) from trusted premier sources auto-publish immediately.
* Expired listings are updated dynamically to `CLOSING_SOON` or `EXPIRED`.
* Source degradation ($\ge 3$ consecutive errors) triggers system alerts for administrative review.

---

## 2. Prerequisites

* **Node.js**: v20.x or higher
* **Package Manager**: npm, yarn, or pnpm
* **Database**: SQLite (for local development) or PostgreSQL / Supabase (for production)
* **TypeScript & tsx**: Installed as dev dependencies

---

## 3. Local Development Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Initialize Database & Seed
```bash
# Push Prisma schema to local database
npm run prisma:push

# Generate Prisma Client
npm run prisma:generate

# Seed premier official sources, opportunities, and initial telemetry
npm run prisma:seed
```

### Step 3: Run Worker in Single-Pass (Verification Mode)
```bash
npm run worker:once
```
Output will demonstrate source check, deadline synchronization, and link revalidation.

### Step 4: Run Autonomous Background Worker Daemon
In a dedicated terminal tab or process manager:
```bash
npm run worker
```
The daemon polls every 60 seconds (configurable via `WORKER_INTERVAL_MS`), checks due sources, syncs deadlines, updates heartbeats, and dispatches student notifications.

### Step 5: Start Next.js Web Interface
```bash
npm run dev
# Application will be accessible at http://localhost:3000
# Autopilot telemetry dashboard: http://localhost:3000/admin/automation
```

---

## 4. Production Worker Deployment

In production environments (e.g. AWS EC2, DigitalOcean, Railway, Render, Fly.io, or Docker), the autonomous worker must run as an independent background daemon so that closing an administrator's browser or laptop never halts opportunity ingestion.

### Option A: PM2 Process Manager (Recommended for VPS / Virtual Machines)

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Start the worker daemon with auto-restart on failure:
   ```bash
   pm2 start "npx tsx src/worker/runner.ts" --name "careerforgex-worker"
   pm2 save
   pm2 startup
   ```

3. Monitor daemon logs:
   ```bash
   pm2 logs careerforgex-worker
   ```

### Option B: Systemd Service (Linux Server)

Create `/etc/systemd/system/careerforgex-worker.service`:
```ini
[Unit]
Description=CareerForgeX Autopilot Ingestion Worker Daemon
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/careerforgex
ExecStart=/usr/bin/npm run worker
Restart=always
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=/var/www/careerforgex/.env

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable careerforgex-worker
sudo systemctl start careerforgex-worker
```

### Option C: Serverless External Cron Triggers

If hosting on Vercel or similar serverless platforms where long-running daemons are not supported, external cron services (e.g., GitHub Actions, Cron-Job.org, AWS EventBridge) can trigger the authenticated HTTP endpoints:

* Ingestion: `POST /api/cron/ingest` with header `Authorization: Bearer <CRON_SECRET>`
* Discovery: `POST /api/cron/discover` with header `Authorization: Bearer <CRON_SECRET>`
* Revalidation: `POST /api/cron/revalidate` with header `Authorization: Bearer <CRON_SECRET>`
* Maintenance: `POST /api/cron/maintenance` with header `Authorization: Bearer <CRON_SECRET>`

---

## 5. Verifying Worker Health

To verify whether the worker is actively running:
1. Navigate to `/admin/automation`.
2. Check the **Heartbeat Status**:
   * Green dot & "Within 2 minutes": Worker is active and running autonomously.
   * Amber/Red: Worker has stalled or stopped; check logs and restart service.
3. Review the **Ingestion Job History** table for real-time item counts, duration, and execution logs.
