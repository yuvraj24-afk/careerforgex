import { BaseSourceAdapter, SourceConfig } from "./base-adapter";
import { FetchResult, RawOpportunityPayload } from "@/types/opportunity";

export class APIAdapter extends BaseSourceAdapter {
  readonly adapterType = "api";
  readonly version = "1.0.0";

  async parse(fetchResult: FetchResult, source: SourceConfig): Promise<RawOpportunityPayload[]> {
    let parsed: any;
    try {
      parsed = JSON.parse(fetchResult.body);
    } catch {
      return [];
    }

    const items: RawOpportunityPayload[] = [];
    const records = Array.isArray(parsed) ? parsed : parsed.data || parsed.results || parsed.items || [];

    for (const record of records) {
      if (!record || typeof record !== "object") continue;

      const title = record.title || record.jobTitle || record.name || "Untitled Opportunity";
      const link = record.applyUrl || record.applicationUrl || record.link || record.url || source.url;
      const organization = record.organization || record.company || record.institution || source.name;
      const description = record.description || record.summary || "";
      const deadline = record.deadline || record.closingDate || record.expiryDate;
      const pubDate = record.publishedDate || record.createdAt;

      const resolvedLink = this.resolveUrl(String(link), source.url);

      items.push({
        title: String(title).trim(),
        sourceUrl: resolvedLink,
        applicationUrl: resolvedLink,
        organization: String(organization).trim(),
        contentSnippet: typeof description === "string" ? description.slice(0, 300) : "",
        fullContent: typeof description === "string" ? `${title}\n\n${description}` : JSON.stringify(record),
        publishedDate: pubDate ? String(pubDate) : undefined,
        deadlineString: deadline ? String(deadline) : undefined,
        guid: record.id || record.uuid || resolvedLink,
        extraMeta: {
          apiPayload: record,
          adapter: this.adapterType,
        },
      });
    }

    return items;
  }
}
