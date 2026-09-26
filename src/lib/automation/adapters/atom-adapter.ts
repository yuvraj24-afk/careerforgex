import { BaseSourceAdapter, SourceConfig } from "./base-adapter";
import { FetchResult, RawOpportunityPayload } from "@/types/opportunity";

export class AtomAdapter extends BaseSourceAdapter {
  readonly adapterType = "atom";
  readonly version = "1.0.0";

  async parse(fetchResult: FetchResult, source: SourceConfig): Promise<RawOpportunityPayload[]> {
    const xml = fetchResult.body;
    const items: RawOpportunityPayload[] = [];

    // Match all <entry>...</entry> blocks
    const entryRegex = /<entry[\s\S]*?<\/entry>/gi;
    const entryMatches = xml.match(entryRegex) || [];

    for (const entryXml of entryMatches) {
      const titleMatch = entryXml.match(/<title(?:\s+[^>]*)?>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/title>/i);
      const linkMatch = entryXml.match(/<link(?:\s+[^>]*href=["']([^"']+)["'][^>]*)?\s*\/?>/i);
      const summaryMatch = entryXml.match(/<(?:summary|content)(?:\s+[^>]*)?>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/(?:summary|content)>/i);
      const updatedMatch = entryXml.match(/<(?:updated|published)(?:\s+[^>]*)?>([\s\S]*?)<\/(?:updated|published)>/i);
      const idMatch = entryXml.match(/<id(?:\s+[^>]*)?>([\s\S]*?)<\/id>/i);

      const title = this.stripHtml(titleMatch?.[1] || titleMatch?.[2] || "");
      const link = linkMatch?.[1]?.trim() || "";
      const rawSummary = summaryMatch?.[1] || summaryMatch?.[2] || "";
      const summary = this.stripHtml(rawSummary);
      const date = updatedMatch?.[1]?.trim();
      const guid = idMatch?.[1]?.trim();

      if (!title && !link) continue;

      const resolvedLink = this.resolveUrl(link, source.url);

      items.push({
        title: title || "Untitled Opportunity",
        sourceUrl: resolvedLink,
        applicationUrl: resolvedLink,
        organization: source.name,
        contentSnippet: summary.slice(0, 300),
        fullContent: `${title}\n\n${summary}`,
        publishedDate: date,
        guid: guid || resolvedLink,
        extraMeta: {
          feedType: "atom",
          adapter: this.adapterType,
        },
      });
    }

    return items;
  }
}
