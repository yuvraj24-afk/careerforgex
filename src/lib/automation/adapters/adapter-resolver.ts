import { BaseSourceAdapter } from "./base-adapter";
import { RSSAdapter } from "./rss-adapter";
import { AtomAdapter } from "./atom-adapter";
import { JSONAdapter } from "./json-adapter";
import { APIAdapter } from "./api-adapter";
import { SitemapAdapter } from "./sitemap-adapter";
import { HTMLAdapter } from "./html-adapter";
import { PDFAdapter } from "./pdf-adapter";
import { PlaywrightAdapter } from "./playwright-adapter";

export class AdapterResolver {
  private static adapters: Map<string, BaseSourceAdapter> = new Map<string, BaseSourceAdapter>([
    ["rss", new RSSAdapter()],
    ["atom", new AtomAdapter()],
    ["json", new JSONAdapter()],
    ["api", new APIAdapter()],
    ["sitemap", new SitemapAdapter()],
    ["html", new HTMLAdapter()],
    ["pdf", new PDFAdapter()],
    ["playwright", new PlaywrightAdapter()],
  ]);

  /**
   * Resolves the adapter for a given adapterType string or infers from URL
   */
  public static resolve(adapterType?: string | null, url?: string): BaseSourceAdapter {
    const normalizedType = adapterType?.toLowerCase().trim();

    if (normalizedType && this.adapters.has(normalizedType)) {
      return this.adapters.get(normalizedType)!;
    }

    // Auto-inference from URL if adapterType is missing or default
    if (url) {
      const lowerUrl = url.toLowerCase();
      if (lowerUrl.endsWith(".rss") || lowerUrl.includes("/rss") || lowerUrl.includes("feed=rss")) {
        return this.adapters.get("rss")!;
      }
      if (lowerUrl.endsWith(".atom") || lowerUrl.includes("/atom")) {
        return this.adapters.get("atom")!;
      }
      if (lowerUrl.endsWith(".json") || lowerUrl.includes("/api/")) {
        return this.adapters.get("json")!;
      }
      if (lowerUrl.includes("sitemap.xml") || lowerUrl.endsWith("/sitemap")) {
        return this.adapters.get("sitemap")!;
      }
      if (lowerUrl.endsWith(".pdf")) {
        return this.adapters.get("pdf")!;
      }
    }

    // Default to resilient HTML adapter
    return this.adapters.get("html")!;
  }

  public static getSupportedAdapters(): string[] {
    return Array.from(this.adapters.keys());
  }
}
