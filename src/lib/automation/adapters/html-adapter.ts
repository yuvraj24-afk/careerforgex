import { BaseSourceAdapter, SourceConfig } from "./base-adapter";
import { FetchResult, RawOpportunityPayload } from "@/types/opportunity";

export class HTMLAdapter extends BaseSourceAdapter {
  readonly adapterType = "html";
  readonly version = "1.0.0";

  async parse(fetchResult: FetchResult, source: SourceConfig): Promise<RawOpportunityPayload[]> {
    const html = fetchResult.body;
    const items: RawOpportunityPayload[] = [];
    const seenLinks = new Set<string>();

    const opportunityKeywords = [
      "internship",
      "fellowship",
      "research",
      "summer",
      "winter",
      "phd",
      "scholarship",
      "trainee",
      "project assistant",
      "project associate",
      "student",
      "award",
      "opportunity",
      "call for applications",
      "visiting student",
      "vsrp",
      "surge",
      "sfp",
    ];

    // Regex to match anchor tags: <a href="..." ...>text</a>
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(html)) !== null) {
      const rawHref = match[1]?.trim();
      const rawText = match[2] || "";
      const text = this.stripHtml(rawText);

      if (!rawHref || !text || text.length < 5) continue;
      if (rawHref.startsWith("#") || rawHref.startsWith("javascript:") || rawHref.startsWith("mailto:")) continue;

      const lowerText = text.toLowerCase();
      const lowerHref = rawHref.toLowerCase();

      const matchesKeyword = opportunityKeywords.some(
        (kw) => lowerText.includes(kw) || lowerHref.includes(kw)
      );

      if (matchesKeyword) {
        const resolvedUrl = this.resolveUrl(rawHref, source.url);
        if (seenLinks.has(resolvedUrl)) continue;
        seenLinks.add(resolvedUrl);

        // Find contextual surrounding text (150 chars before and after match index)
        const start = Math.max(0, match.index - 150);
        const end = Math.min(html.length, match.index + match[0].length + 150);
        const contextHtml = html.slice(start, end);
        const contextText = this.stripHtml(contextHtml);

        // Attempt date extraction from context
        const dateMatch = contextText.match(
          /(?:deadline|last date|closing date|due date|apply by)[\s:]*([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4}|[0-9]{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]+[0-9]{4})/i
        );

        items.push({
          title: text,
          sourceUrl: source.url,
          applicationUrl: resolvedUrl,
          organization: source.name,
          contentSnippet: contextText.slice(0, 300),
          fullContent: `${text}\n\nContext:\n${contextText}\n\nLink: ${resolvedUrl}`,
          deadlineString: dateMatch ? dateMatch[1] : undefined,
          guid: resolvedUrl,
          extraMeta: {
            adapter: this.adapterType,
            discoveredLink: resolvedUrl,
          },
        });
      }
    }

    // Also check for structured table rows if present
    if (items.length === 0) {
      const rowRegex = /<tr[\s\S]*?<\/tr>/gi;
      const rows = html.match(rowRegex) || [];
      for (const row of rows) {
        const rowText = this.stripHtml(row);
        const lowerRow = rowText.toLowerCase();
        if (opportunityKeywords.some((kw) => lowerRow.includes(kw))) {
          const rowLinkMatch = row.match(/href=["']([^"']+)["']/i);
          const link = rowLinkMatch ? this.resolveUrl(rowLinkMatch[1], source.url) : source.url;

          if (!seenLinks.has(link)) {
            seenLinks.add(link);
            items.push({
              title: rowText.slice(0, 80),
              sourceUrl: source.url,
              applicationUrl: link,
              organization: source.name,
              contentSnippet: rowText.slice(0, 300),
              fullContent: rowText,
              guid: link,
              extraMeta: { adapter: this.adapterType, fromTable: true },
            });
          }
        }
      }
    }

    return items;
  }
}
