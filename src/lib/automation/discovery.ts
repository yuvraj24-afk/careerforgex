import { prisma } from "@/lib/db";

export interface DiscoveredCandidate {
  url: string;
  name?: string;
  domain: string;
  institutionType: string;
  trustTier: number;
  referringUrl?: string;
  discoveredVia: string;
}

export class SourceDiscoveryService {
  /**
   * Recognized Indian & International Academic / Institutional domain suffixes and patterns
   */
  private static readonly INSTITUTIONAL_PATTERNS = [
    { regex: /iit[a-z]*\.ac\.in/i, type: "iit", tier: 1 },
    { regex: /nit[a-z]*\.ac\.in/i, type: "nit", tier: 1 },
    { regex: /iisc\.ac\.in/i, type: "iisc", tier: 1 },
    { regex: /iiser[a-z]*\.ac\.in/i, type: "iiser", tier: 1 },
    { regex: /iiit[a-z]*\.ac\.in/i, type: "iiit", tier: 1 },
    { regex: /tifr\.res\.in/i, type: "research_lab", tier: 1 },
    { regex: /csir\.res\.in/i, type: "research_lab", tier: 1 },
    { regex: /isro\.gov\.in/i, type: "government", tier: 1 },
    { regex: /drdo\.gov\.in/i, type: "government", tier: 1 },
    { regex: /\.gov\.in/i, type: "government", tier: 1 },
    { regex: /\.ac\.in/i, type: "central_univ", tier: 2 },
    { regex: /\.edu/i, type: "foreign_univ", tier: 2 },
    { regex: /careers\.(google|microsoft|amazon|apple|meta|nvidia)\.com/i, type: "company", tier: 1 },
  ];

  /**
   * Inspects a newly observed URL (e.g. from extracted application links or sitemaps)
   * and registers it into DiscoveredSource if it qualifies as an institutional domain.
   */
  public static async evaluateAndRegisterUrl(
    targetUrl: string,
    referringUrl?: string,
    discoveredVia = "link_extractor"
  ): Promise<boolean> {
    try {
      const parsed = new URL(targetUrl);
      const domain = parsed.hostname.toLowerCase();

      // Check if domain is already known as an active source
      const existingSource = await prisma.source.findFirst({
        where: { url: { contains: domain } },
      });
      if (existingSource) return false;

      // Check if already in discovered sources
      const existingDiscovered = await prisma.discoveredSource.findUnique({
        where: { url: targetUrl },
      });
      if (existingDiscovered) return false;

      // Match against institutional patterns
      let institutionType = "unknown";
      let trustTier = 3;

      for (const pattern of this.INSTITUTIONAL_PATTERNS) {
        if (pattern.regex.test(domain) || pattern.regex.test(targetUrl)) {
          institutionType = pattern.type;
          trustTier = pattern.tier;
          break;
        }
      }

      if (institutionType === "unknown") {
        return false; // Skip random commercial/marketing sites
      }

      const inferredName = domain
        .replace(/^www\./, "")
        .split(".")[0]
        .toUpperCase();

      await prisma.discoveredSource.create({
        data: {
          url: targetUrl,
          name: `${inferredName} Opportunity Portal`,
          domain,
          institutionType,
          trustTier,
          referringUrl,
          discoveredVia,
          status: "DISCOVERED",
          validationNotes: `Discovered from ${referringUrl || discoveredVia}. Matched institutional profile: ${institutionType}.`,
        },
      });

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Discovers known top Indian Institutional research & student training portals
   */
  public static async discoverFromSeedDirectories(): Promise<number> {
    const seedInstitutions = [
      { url: "https://www.iitb.ac.in/en/careers", name: "IIT Bombay Official Openings", domain: "iitb.ac.in", type: "iit", tier: 1 },
      { url: "https://www.iitm.ac.in/academics/fellowships", name: "IIT Madras Fellowships", domain: "iitm.ac.in", type: "iit", tier: 1 },
      { url: "https://home.iitd.ac.in/opportunities.php", name: "IIT Delhi Announcements", domain: "iitd.ac.in", type: "iit", tier: 1 },
      { url: "https://iisc.ac.in/admissions/", name: "IISc Bangalore Admissions & Fellowships", domain: "iisc.ac.in", type: "iisc", tier: 1 },
      { url: "https://www.iiserb.ac.in/summer_internship", name: "IISER Bhopal Student Program", domain: "iiserb.ac.in", type: "iiser", tier: 1 },
      { url: "https://www.iiserpune.ac.in/opportunities", name: "IISER Pune Opportunities", domain: "iiserpune.ac.in", type: "iiser", tier: 1 },
      { url: "https://www.tifr.res.in/~vsrp/", name: "TIFR Visiting Students Research Programme", domain: "tifr.res.in", type: "research_lab", tier: 1 },
      { url: "https://www.csir.res.in/career-opportunities", name: "CSIR Career & Project Assistant Portal", domain: "csir.res.in", type: "research_lab", tier: 1 },
    ];

    let registered = 0;
    for (const inst of seedInstitutions) {
      const existing = await prisma.discoveredSource.findUnique({ where: { url: inst.url } });
      const active = await prisma.source.findFirst({ where: { url: inst.url } });

      if (!existing && !active) {
        await prisma.discoveredSource.create({
          data: {
            url: inst.url,
            name: inst.name,
            domain: inst.domain,
            institutionType: inst.type,
            trustTier: inst.tier,
            discoveredVia: "institutional_directory",
            status: "DISCOVERED",
            validationNotes: "Official Indian premier research & educational portal",
          },
        });
        registered++;
      }
    }

    return registered;
  }
}
