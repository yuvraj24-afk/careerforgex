# CareerForgeX — Administrator Guide

CareerForgeX operates on the **Zero-Daily-Manual-Update Principle**. Administrators should not log in daily to manually post opportunities. The administration console is strictly for operational oversight, review of edge cases, and emergency control.

---

## 1. Accessing the Admin Console

* **URL**: `/admin/automation`
* **Default Seed Email**: `admin@careerforgex.com`
* **Default Seed Password**: `AdminCareerForgeX2026!` (Configurable via `.env`)

---

## 2. Admin Dashboards Overview

### A. Autopilot Control & Telemetry (`/admin/automation`)
* **Live System Metrics**: Active sources, degraded sources, total opportunities, closing soon, and items pending review.
* **Worker Heartbeat Indicator**: Displays whether the background daemon is healthy (`Within 2 minutes`) or stalled.
* **Emergency Controls**:
  * **Pause All Ingestion**: Freezes all scraping immediately without shutting down the public site.
  * **Resume Ingestion**: Resumes automated polling.
  * **Reprocess Failed Sources**: Clears degraded states and resets error counters.
* **Job Execution Log**: Real-time audit trail of all ingestion jobs, run IDs, duration, and extracted counts.

### B. Review Queue (`/admin/review`)
* Displays opportunities flagged by the confidence engine ($50 \le \text{Score} < 80$) or marked as `LIKELY_DUPLICATE`.
* **Actions**:
  * **Approve**: Publishes the opportunity immediately.
  * **Merge**: Merges changes into the parent duplicate opportunity.
  * **Reject**: Rejects and archives the candidate.

### C. Source Registry (`/admin/sources`)
* View all active, paused, and degraded sources.
* Inspect check frequencies, error messages, and success timestamps.
* **Run Source Now**: Triggers an instant fetch on any specific portal.
* **Discovered Tab**: Review prospective institutional domains discovered autonomously by the crawler.

---

## 3. Routine Administrative Checklist (Weekly / Monthly)

1. **Check System Alerts**: Review any sources marked `DEGRADED` to see if university HTML structure changed.
2. **Clear Review Queue**: Approve or reject edge cases flagged for human review.
3. **Promote Discovered Sources**: Check `/admin/sources?tab=discovered` and promote verified institutional domains into active monitoring.
