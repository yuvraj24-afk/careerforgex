export interface SiteConfig {
  brand: {
    name: string;
    tagline: string;
    positioning: string;
    corePromise: string;
    primaryHeadline: string;
    alternativeHeadline: string;
    subheading: string;
    mission: string;
    approach: string;
  };
  contact: {
    email: string;
    salesEmail: string;
    supportEmail: string;
    phone: string;
    location: string;
    availability: string;
  };
  features: {
    enableAutopilot: boolean;
    enableStudentAlerts: boolean;
    enableBookmarks: boolean;
    enableAdminReview: boolean;
    demoMode: boolean;
  };
  ctas: {
    primary: string;
    secondary: string;
  };
  navigation: {
    main: { name: string; href: string; badge?: string }[];
    categories: { name: string; href: string; icon: string }[];
    admin: { name: string; href: string }[];
    legal: { name: string; href: string }[];
  };
}

export const siteConfig: SiteConfig = {
  brand: {
    name: "CareerForgeX",
    tagline: "Discover Opportunities. Build Your Career.",
    positioning: "The autonomous student opportunity discovery and intelligence platform.",
    corePromise: "Never miss a research internship, fellowship, PhD opening, or scholarship deadline again.",
    primaryHeadline: "Discover Premier Opportunities on Full Autopilot.",
    alternativeHeadline: "Zero-Manual Scraping. Verified Official Student Openings.",
    subheading: "CareerForgeX automatically monitors, extracts, verifies, and tracks deadlines from India's top premier institutions (IITs, IISc, IISERs, TIFR) and global research labs.",
    mission: "To eliminate the friction of searching hundreds of institutional websites by building an autonomous intelligence pipeline for student academic and career opportunities.",
    approach: "Smart Fetching → Change Detection → AI Extraction → Controlled Taxonomy → Multi-Signal Deduplication → Deadline Engine → Auto-Publishing.",
  },
  contact: {
    email: "contact@careerforgex.com",
    salesEmail: "contact@careerforgex.com",
    supportEmail: "support@careerforgex.com",
    phone: "+91 80 4923 3674",
    location: "Global Remote",
    availability: "Mon - Fri, 9:00 AM - 6:00 PM IST",
  },
  features: {
    enableAutopilot: true,
    enableStudentAlerts: true,
    enableBookmarks: true,
    enableAdminReview: true,
    demoMode: process.env.DEMO_MODE !== "false",
  },
  ctas: {
    primary: "Explore Opportunities",
    secondary: "View Autopilot Engine",
  },
  navigation: {
    main: [
      { name: "Explore Opportunities", href: "/opportunities" },
      { name: "Closing Soon", href: "/opportunities?status=CLOSING_SOON", badge: "Urgent" },
      { name: "Saved", href: "/saved" },
      { name: "Alerts", href: "/alerts" },
    ],
    categories: [
      { name: "Research Internships", href: "/opportunities?type=Research", icon: "Microscope" },
      { name: "Summer Fellowships", href: "/opportunities?type=Fellowship", icon: "Award" },
      { name: "Industry Internships", href: "/opportunities?type=Internship", icon: "Briefcase" },
      { name: "PhD & Doctoral", href: "/opportunities?type=PhD", icon: "GraduationCap" },
      { name: "Scholarships", href: "/opportunities?type=Scholarship", icon: "BookOpen" },
      { name: "Competitions & Hackathons", href: "/opportunities?type=Competition", icon: "Trophy" },
    ],
    admin: [
      { name: "Autopilot Dashboard", href: "/admin/automation" },
      { name: "Review Queue", href: "/admin/review" },
      { name: "Source Registry", href: "/admin/sources" },
      { name: "Discovered Portals", href: "/admin/sources?tab=discovered" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Source Attribution & Transparency", href: "/about" },
    ],
  },
};
