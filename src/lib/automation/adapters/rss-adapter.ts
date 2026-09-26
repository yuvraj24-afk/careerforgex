import { BaseSourceAdapter, SourceConfig } from "./base-adapter";
import { FetchResult, RawOpportunityPayload } from "@/types/opportunity";

export class RSSAdapter extends BaseSourceAdapter {
  readonly adapterType = "rss";
  readonly version = "1.0.0";

  async parse(fetchResult: FetchResult, source: SourceConfig): Promise<RawOpportunityPayload[]> {
    const xml = fetchResult.body;
    const items: RawOpportunityPayload[] = [];

    // Match all <item>...</item> blocks
    const itemRegex = /<item[\s\S]*?<\/item>/gi;
    const itemMatches = xml.match(itemRegex) || [];

    for (const itemXml of itemMatches) {
      const titleMatch = itemXml.match(/<title(?:\s+[^>]*)?>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/title>/i);
      const linkMatch = itemXml.match(/<link(?:\s+[^>]*)?>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/link>/i);
      const descMatch = itemXml.match(/<description(?:\s+[^>]*)?>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/description>/i);
      const pubDateMatch = itemXml.match(/<pubDate(?:\s+[^>]*)?>([\s\S]*?)<\/pubDate>/i);
      const guidMatch = itemXml.match(/<guid(?:\s+[^>]*)?>([\s\S]*?)<\/guid>/i);

      const title = this.stripHtml(titleMatch?.[1] || titleMatch?.[2] || "");
      const link = (linkMatch?.[1] || linkMatch?.[2] || "").trim();
      const rawDesc = descMatch?.[1] || descMatch?.[2] || "";
      const description = this.stripHtml(rawDesc);
      const pubDate = pubDateMatch?.[1]?.trim();
      const guid = guidMatch?.[1]?.trim();

      if (!title && !link) continue;

      const resolvedLink = this.resolveUrl(link, source.url);

      items.push({
        title: title || "Untitled Opportunity",
        sourceUrl: resolvedLink,
        applicationUrl: resolvedLink,
        organization: source.name,
        contentSnippet: description.slice(0, 300),
        fullContent: `${title}\n\n${description}`,
        publishedDate: pubDate,
        guid: guid || resolvedLink,
        extraMeta: {
          feedType: "rss2",
          adapter: this.adapterType,
        },
      });
    }

    return items;
  }
}
