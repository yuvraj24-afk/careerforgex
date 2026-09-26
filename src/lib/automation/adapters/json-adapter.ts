import { BaseSourceAdapter, SourceConfig } from "./base-adapter";
import { FetchResult, RawOpportunityPayload } from "@/types/opportunity";

export class JSONAdapter extends BaseSourceAdapter {
  readonly adapterType = "json";
  readonly version = "1.0.0";

  async parse(fetchResult: FetchResult, source: SourceConfig): Promise<RawOpportunityPayload[]> {
    let parsed: any;
    try {
      parsed = JSON.parse(fetchResult.body);
    } catch {
      return [];
    }

    // Config options: e.g. path to array
    let config: { itemsKey?: string; titleKey?: string; urlKey?: string; descKey?: string } = {};
    if (source.configJson) {
      try {
        config = JSON.parse(source.configJson);
      } catch {
        config = {};
      }
    }

    let rawList: any[] = [];
    if (Array.isArray(parsed)) {
      rawList = parsed;
    } else if (config.itemsKey && Array.isArray(parsed[config.itemsKey])) {
      rawList = parsed[config.itemsKey];
    } else if (Array.isArray(parsed.data)) {
      rawList = parsed.data;
    } else if (Array.isArray(parsed.items)) {
      rawList = parsed.items;
    } else if (Array.isArray(parsed.opportunities)) {
      rawList = parsed.opportunities;
    } else if (Array.isArray(parsed.openings)) {
      rawList = parsed.openings;
    } else if (Array.isArray(parsed.results)) {
      rawList = parsed.results;
    } else {
      // Find the first array property in object
      for (const key of Object.keys(parsed)) {
        if (Array.isArray(parsed[key])) {
          rawList = parsed[key];
          break;
        }
      }
    }

    const items: RawOpportunityPayload[] = [];

    for (const item of rawList) {
      if (!item || typeof item !== "object") continue;

      const title =
        item[config.titleKey || ""] ||
        item.title ||
        item.name ||
        item.role ||
        item.position ||
        item.headline ||
        "Untitled Opportunity";

      const link =
        item[config.urlKey || ""] ||
        item.url ||
        item.link ||
        item.applyUrl ||
        item.applicationUrl ||
        item.href ||
        source.url;

      const description =
        item[config.descKey || ""] ||
        item.description ||
        item.summary ||
        item.details ||
        item.about ||
        "";

      const organization = item.company || item.organization || item.institute || source.name;
      const deadline = item.deadline || item.lastDate || item.closingDate;
      const pubDate = item.publishedAt || item.createdAt || item.postedDate;

      const resolvedLink = this.resolveUrl(String(link), source.url);

      items.push({
        title: String(title).trim(),
        sourceUrl: resolvedLink,
        applicationUrl: resolvedLink,
        organization: String(organization).trim(),
        contentSnippet: typeof description === "string" ? description.slice(0, 300) : "",
        fullContent: typeof description === "string" ? `${title}\n\n${description}` : JSON.stringify(item),
        publishedDate: pubDate ? String(pubDate) : undefined,
        deadlineString: deadline ? String(deadline) : undefined,
        guid: item.id ? String(item.id) : resolvedLink,
        extraMeta: {
          rawItem: item,
          adapter: this.adapterType,
        },
      });
    }

    return items;
  }
}
