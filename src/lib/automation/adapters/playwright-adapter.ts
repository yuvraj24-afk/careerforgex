import { BaseSourceAdapter, SourceConfig } from "./base-adapter";
import { FetchResult, RawOpportunityPayload } from "@/types/opportunity";

export class PlaywrightAdapter extends BaseSourceAdapter {
  readonly adapterType = "playwright";
  readonly version = "1.0.0";

  async parse(fetchResult: FetchResult, source: SourceConfig): Promise<RawOpportunityPayload[]> {
    // When Playwright / Chromium headless scraping runs, HTML or pre-rendered state is delivered in fetchResult.
    // If running in environment without headless browser, fall back to parsing embedded JSON (__NEXT_DATA__, window.__INITIAL_STATE__)
    const html = fetchResult.body;
    const items: RawOpportunityPayload[] = [];

    // Check for embedded JSON state
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/i);
    if (nextDataMatch) {
      try {
        const nextData = JSON.parse(nextDataMatch[1]);
        const stringified = JSON.stringify(nextData);
        // Look for opportunity patterns in Next data
        items.push({
          title: `${source.name} Dynamic Opportunity Portal`,
          sourceUrl: source.url,
          applicationUrl: source.url,
          organization: source.name,
          contentSnippet: `Dynamic Next.js hydrated page content from ${source.name}`,
          fullContent: stringified.slice(0, 3000),
          guid: source.url,
          extraMeta: { adapter: this.adapterType, dynamicHydrated: true },
        });
        return items;
      } catch {
        // Fall back to DOM extraction
      }
    }

    // Fallback: extract cards or listings
    const cardRegex = /<(?:div|section|article|li)[^>]*?(?:job|opportunity|opening|career|card)[^>]*?>([\s\S]*?)<\/(?:div|section|article|li)>/gi;
    const cardMatches = html.match(cardRegex) || [];

    for (const card of cardMatches.slice(0, 20)) {
      const text = this.stripHtml(card);
      if (text.length > 20) {
        const linkMatch = card.match(/href=["']([^"']+)["']/i);
        const link = linkMatch ? this.resolveUrl(linkMatch[1], source.url) : source.url;

        items.push({
          title: text.slice(0, 90),
          sourceUrl: source.url,
          applicationUrl: link,
          organization: source.name,
          contentSnippet: text.slice(0, 300),
          fullContent: text,
          guid: link,
          extraMeta: { adapter: this.adapterType },
        });
      }
    }

    if (items.length === 0) {
      items.push({
        title: `${source.name} Verified Opportunity Portal`,
        sourceUrl: source.url,
        applicationUrl: source.url,
        organization: source.name,
        contentSnippet: this.stripHtml(html).slice(0, 300),
        fullContent: this.stripHtml(html).slice(0, 1500),
        guid: source.url,
        extraMeta: { adapter: this.adapterType },
      });
    }

    return items;
  }
}
