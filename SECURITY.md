# Security Policy — CareerForgeX

CareerForgeX takes the security of its infrastructure, autonomous ingestion workers, and student users seriously.

---

## 1. Reporting Security Vulnerabilities

If you discover a security vulnerability within CareerForgeX:

* **DO NOT** disclose the issue publicly via GitHub Issues, Discussions, or social media.
* **DO NOT** commit or paste any compromised secrets, tokens, or credentials in public channels.
* Send a detailed vulnerability report privately to our security team at:
  **`security@careerforgex.com`**

Please include:
1. Description of the vulnerability.
2. Steps to reproduce the issue (proof-of-concept scripts or HTTP requests).
3. Potential impact and attack vectors.
4. Suggested remediation or patch, if known.

We will acknowledge receipt within 48 hours and coordinate a coordinated disclosure timeline.

---

## 2. Strict Warning on Secrets & Credentials

Contributors and developers must **NEVER commit sensitive credentials** to this repository. This includes:

* `SUPABASE_SERVICE_ROLE_KEY` or direct database connection passwords.
* AI Foundation Model API keys (`OPENAI_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`).
* `AUTH_SECRET`, JWT signing keys, or session tokens.
* Cloud provider credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
* Search API keys or Email SMTP credentials.
* Private `.env` files (`.env`, `.env.local`, `.env.production`).

Ensure your local `.env` is listed in `.gitignore` before making any git commits.

---

## 3. Responsible Crawling & Scraping Boundaries

CareerForgeX operates as a polite opportunity aggregator:
* Crawlers respect `robots.txt` where applicable.
* Requests are throttled to reasonable rates (minimum 1 second between requests per domain).
* Crawlers never attempt to bypass paywalls, CAPTCHAs, or authentication boundaries.
* If a domain blocks automated requests, CareerForgeX marks the source as `BLOCKED` for human review rather than attempting evasion.
