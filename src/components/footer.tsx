import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Compass, ShieldCheck, Activity, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Compass className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                {siteConfig.brand.name}
              </span>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              The autonomous student opportunity discovery and intelligence platform.
              Continuously indexing research internships, summer fellowships, PhD admissions,
              and scholarships from premier institutions on full autopilot.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-mono text-[11px]">
                <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>Autopilot Pipeline: Active & Self-Updating</span>
              </div>
            </div>
          </div>

          {/* Opportunity Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Browse Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/opportunities?type=Research" className="hover:text-cyan-400 transition-colors">
                  Research Internships
                </Link>
              </li>
              <li>
                <Link href="/opportunities?type=Fellowship" className="hover:text-cyan-400 transition-colors">
                  Summer Fellowships
                </Link>
              </li>
              <li>
                <Link href="/opportunities?type=Internship" className="hover:text-cyan-400 transition-colors">
                  Industry Internships
                </Link>
              </li>
              <li>
                <Link href="/opportunities?type=PhD" className="hover:text-cyan-400 transition-colors">
                  PhD & Higher Study
                </Link>
              </li>
              <li>
                <Link href="/opportunities?type=Scholarship" className="hover:text-cyan-400 transition-colors">
                  National Scholarships
                </Link>
              </li>
              <li>
                <Link href="/opportunities?status=CLOSING_SOON" className="text-amber-400 hover:text-amber-300 font-medium">
                  Closing Soon Openings &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Autopilot & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Platform & System
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/opportunities" className="hover:text-cyan-400 transition-colors">
                  All Opportunities
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-cyan-400 transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="hover:text-cyan-400 transition-colors">
                  Alert Subscriptions
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cyan-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-cyan-400 transition-colors">
                  How Autopilot Works
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Source Attribution & Legal Disclaimer */}
        <div className="mt-12 pt-6 border-t border-slate-900 text-[11px] text-slate-500 space-y-2">
          <p className="flex items-center gap-1.5 font-medium text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Public Source Transparency & Attribution</span>
          </p>
          <p className="leading-relaxed">
            CareerForgeX is an autonomous opportunity discovery platform. All opportunity details,
            eligibility rules, selection criteria, and application forms belong solely to the original
            hosting institutions and organizations (such as IITs, IISc, IISERs, TIFR, CSIR, and respective companies).
            CareerForgeX aggregates and indexes publicly accessible notices and provides direct links to the official portal.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-600">
            <p>© {currentYear} {siteConfig.brand.name}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
