import { BaseSourceAdapter, SourceConfig } from "./base-adapter";
import { FetchResult, RawOpportunityPayload } from "@/types/opportunity";

export class PDFAdapter extends BaseSourceAdapter {
  readonly adapterType = "pdf";
  readonly version = "1.0.0";

  async parse(fetchResult: FetchResult, source: SourceConfig): Promise<RawOpportunityPayload[]> {
    // For PDFs, the fetch result contains raw text or binary stream
    const content = fetchResult.body;
    const items: RawOpportunityPayload[] = [];

    // Extract basic text chunks or metadata
    const textSnippet = this.stripHtml(content).slice(0, 1500);

    // Look for application date or deadline patterns
    const dateMatch = textSnippet.match(
      /(?:last date|deadline|submission date|closing date|before)[\s:]*([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4}|[0-9]{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,]+[0-9]{4})/i
    );

    // Look for stipend/fellowship mention
    const stipendMatch = textSnippet.match(
      /(?:stipend|fellowship|remuneration|consolidated pay)[\s:]*([₹Rs.0-9,/\s\-pm]+)/i
    );

    items.push({
      title: `${source.name} Official Opportunity Notice`,
      sourceUrl: source.url,
      applicationUrl: source.url,
      organization: source.name,
      contentSnippet: textSnippet.slice(0, 400),
      fullContent: `Official PDF Document Announcement\nSource: ${source.name}\nURL: ${source.url}\n\n${textSnippet}`,
      deadlineString: dateMatch ? dateMatch[1] : undefined,
      guid: source.url,
      extraMeta: {
        adapter: this.adapterType,
        stipendHint: stipendMatch ? stipendMatch[1].trim() : undefined,
      },
    });

    return items;
  }
}
