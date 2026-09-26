import { createHash } from "crypto";
import { FetchResult } from "@/types/opportunity";

export interface FetchOptions {
  etag?: string | null;
  lastModified?: string | null;
  previousHash?: string | null;
  customHeaders?: Record<string, string>;
  timeoutMs?: number;
  maxRetries?: number;
}

export class SmartFetcher {
  private static domainLastRequest: Map<string, number> = new Map();
  private static readonly MIN_DOMAIN_INTERVAL_MS = 1000; // 1s polite crawling rate limit

  /**
   * Fetches URL with ETag, Last-Modified, timeout, and backoff retry.
   */
  public static async fetch(url: string, options: FetchOptions = {}): Promise<FetchResult> {
    const timeoutMs = options.timeoutMs || 15000;
    const maxRetries = options.maxRetries || 2;

    await this.throttleDomain(url);

    let attempt = 0;
    let lastError: any = null;

    while (attempt <= maxRetries) {
      try {
        const headers: Record<string, string> = {
          "User-Agent": "CareerForgeX-Autopilot/2.0 (+https://careerforgex.com/bot; responsible-indexing)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.8,*/*;q=0.7",
          "Accept-Language": "en-US,en;q=0.9",
          ...(options.customHeaders || {}),
        };

        if (options.etag) {
          headers["If-None-Match"] = options.etag;
        }
        if (options.lastModified) {
          headers["If-Modified-Since"] = options.lastModified;
        }

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(url, {
          method: "GET",
          headers,
          signal: controller.signal,
          redirect: "follow",
        });

        clearTimeout(timer);

        // Check for 304 Not Modified
        if (response.status === 304) {
          return {
            url,
            status: 304,
            statusText: "Not Modified",
            etag: options.etag,
            lastModified: options.lastModified,
            contentHash: options.previousHash || "",
            body: "",
            contentType: response.headers.get("content-type"),
            isUnchanged: true,
          };
        }

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        const body = await response.text();
        const contentHash = createHash("sha256").update(body).digest("hex");

        const responseEtag = response.headers.get("etag");
        const responseLastModified = response.headers.get("last-modified");
        const contentType = response.headers.get("content-type");

        const isUnchanged = !!(options.previousHash && options.previousHash === contentHash);

        return {
          url,
          status: response.status,
          statusText: response.statusText,
          etag: responseEtag || options.etag,
          lastModified: responseLastModified || options.lastModified,
          contentHash,
          body,
          contentType,
          isUnchanged,
        };
      } catch (err: any) {
        lastError = err;
        attempt++;
        if (attempt <= maxRetries) {
          // Exponential backoff with jitter
          const backoff = Math.pow(2, attempt) * 500 + Math.random() * 200;
          await new Promise((r) => setTimeout(r, backoff));
        }
      }
    }

    throw new Error(`Failed to fetch ${url} after ${maxRetries + 1} attempts: ${lastError?.message || lastError}`);
  }

  private static async throttleDomain(urlStr: string): Promise<void> {
    try {
      const parsed = new URL(urlStr);
      const domain = parsed.hostname;
      const now = Date.now();
      const last = this.domainLastRequest.get(domain) || 0;
      const elapsed = now - last;

      if (elapsed < this.MIN_DOMAIN_INTERVAL_MS) {
        const waitTime = this.MIN_DOMAIN_INTERVAL_MS - elapsed;
        await new Promise((r) => setTimeout(r, waitTime));
      }

      this.domainLastRequest.set(domain, Date.now());
    } catch {
      // Ignore invalid URL formatting during rate limit check
    }
  }
}
