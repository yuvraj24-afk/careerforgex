import { BaseSourceAdapter, SourceConfig } from "./base-adapter";
import { FetchResult, RawOpportunityPayload } from "@/types/opportunity";

export class SitemapAdapter extends BaseSourceAdapter {
  readonly adapterType = "sitemap";
  readonly version = "1.0.0";

  async parse(fetchResult: FetchResult, source: SourceConfig): Promise<RawOpportunityPayload[]> {
    const xml = fetchResult.body;
    const items: RawOpportunityPayload[] = [];

    // Match <url>...</url>
    const urlRegex = /<url[\s\S]*?<\/url>/gi;
    const matches = xml.match(urlRegex) || [];

    // Opportunity keyword filters for sitemaps so we don't index irrelevant pages
    const opportunityKeywords = [
      "internship",
      "fellowship",
      "research",
      "summer",
      "winter",
      "phd",
      "admission",
      "scholarship",
      "opportunity",
      "career",
      "opening",
      "vacancy",
      "project",
      "trainee",
    ];

    for (const urlBlock of matches) {
      const locMatch = urlBlock.match(/<loc(?:\s+[^>]*)?>([\s\S]*?)<\/loc>/i);
      const lastModMatch = urlBlock.match(/<lastmod(?:\s+[^>]*)?>([\s\S]*?)<\/lastmod>/i);

      const loc = locMatch?.[1]?.trim();
      const lastmod = lastModMatch?.[1]?.trim();

      if (!loc) continue;

      const lowerLoc = loc.toLowerCase();
      const isRelevant = opportunityKeywords.some((kw) => lowerLoc.includes(kw));

      if (isRelevant) {
        // Derive clean title from URL slug
        const urlObj = new URL(loc);
        const pathSegments = urlObj.pathname.split("/").filter(Boolean);
        const slug = pathSegments[pathSegments.length - 1] || "";
        const title = slug
          .replace(/[-_]/g, " ")
          .replace(/\.(html|php|aspx|jsp)$/i, "")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        items.push({
          title: title || `${source.name} Opportunity Announcement`,
          sourceUrl: loc,
          applicationUrl: loc,
          organization: source.name,
          contentSnippet: `Discovered from sitemap at ${loc}`,
          fullContent: `Discovered opportunity URL from sitemap: ${loc}\nSource: ${source.name}`,
          publishedDate: lastmod,
          guid: loc,
          extraMeta: {
            adapter: this.adapterType,
            discoveredFromSitemap: true,
          },
        });
      }
    }

    return items;
  }
}
