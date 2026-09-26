# CareerForgeX — API Reference

All API routes return JSON and follow standard HTTP response codes.

---

## 1. Public Opportunity Endpoints

### `GET /api/opportunities`
Fetches a paginated, filterable list of published opportunities.

* **Query Parameters**:
  * `q` (string): Search text against title, organization, and description.
  * `type` (string): Filter by type (`Research`, `Internship`, `Fellowship`, etc.).
  * `domain` (string): Filter by domain (`Computer Science / AI`, `Electronics`, etc.).
  * `status` (string): Set to `CLOSING_SOON` to show expiring items.
  * `page` (int): Page number (default: `1`).
  * `limit` (int): Page size (default: `12`).
* **Response**:
  ```json
  {
    "total": 42,
    "page": 1,
    "limit": 12,
    "opportunities": [ ... ]
  }
  ```

### `GET /api/opportunities/[slug]`
Fetches full details of an opportunity by its unique slug, including source information and change logs.

---

## 2. Student Actions Endpoints

### `POST /api/student/save`
Bookmarks an opportunity for a student.
* **Body**: `{ "opportunityId": "string" }`
* **Response**: `{ "saved": true }`

### `POST /api/student/alerts`
Sets or updates student alert criteria (domains, opportunity types, keywords).

---

## 3. Autonomous Ingestion & Cron Endpoints

These endpoints are triggered by external schedulers or serverless cron jobs. They require the `Authorization: Bearer <CRON_SECRET>` header.

### `POST /api/cron/ingest`
Runs a scheduled ingestion tick on sources where `nextCheckAt <= now()`.
* **Response**:
  ```json
  {
    "success": true,
    "sourcesChecked": 3,
    "itemsCreated": 5,
    "itemsUpdated": 2
  }
  ```

### `POST /api/cron/revalidate`
Runs link validity checks on active opportunities and archives confirmed 404 links.

### `POST /api/cron/maintenance`
Purges historical job logs older than retention thresholds and archives expired opportunities.

---

## 4. Administrative Control Endpoints

Requires admin session authentication.

### `GET /api/admin/automation/stats`
Returns aggregated live metrics:
* Total sources, active sources, degraded sources.
* Total opportunities, auto-published count, pending review count.
* Worker heartbeat status (`last_worker_heartbeat`).

### `POST /api/admin/automation/control`
Executes emergency controls:
* `PAUSE_ALL`: Stops all automated scrapers immediately.
* `RESUME_ALL`: Clears emergency pause.
* `RUN_SOURCE_NOW`: Triggers immediate fetch of `{ "sourceId": "..." }`.
* `REPROCESS_FAILED`: Resets consecutive failures on degraded sources.

### `GET /api/admin/review` / `POST /api/admin/review`
Fetches items awaiting review and handles `APPROVE`, `REJECT`, or `MERGE` actions.
