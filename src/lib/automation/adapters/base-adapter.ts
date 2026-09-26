import { FetchResult, RawOpportunityPayload } from "@/types/opportunity";

export interface SourceConfig {
  id: string;
  name: string;
  url: string;
  adapterType: string;
  adapterVersion: string;
  parserVersion: string;
  configJson?: string | null;
  headersJson?: string | null;
  etag?: string | null;
  lastModified?: string | null;
}

export abstract class BaseSourceAdapter {
  abstract readonly adapterType: string;
  abstract readonly version: string;

  /**
   * Parses the raw content body fetched from the source into normalized items.
   */
  abstract parse(fetchResult: FetchResult, source: SourceConfig): Promise<RawOpportunityPayload[]>;

  /**
   * Helper to normalize relative URLs against a base URL
   */
  protected resolveUrl(relativeOrAbsolute: string, baseUrl: string): string {
    try {
      return new URL(relativeOrAbsolute, baseUrl).toString();
    } catch {
      return relativeOrAbsolute;
    }
  }

  /**
   * Cleans text, removes excessive whitespace and HTML tags if necessary
   */
  protected stripHtml(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }
}
