import { LeadForm } from "@/components/lead-form";
import { siteConfig } from "@/config/site";
import { Mail, MapPin, Clock, ShieldCheck, Terminal } from "lucide-react";

export const metadata = {
  title: "Contact & Automation Audit Request",
  description: "Request a complimentary AI automation audit. Submit your business requirements and toolchain to our systems architects.",
};

export default function ContactPage() {
  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>DIRECT REQUIREMENTS INGESTION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Request an Automation Audit.
        </h1>
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
          Provide your team's current workflow challenges and software stack.
          Our lead systems architects will evaluate feasibility, map potential agent nodes, and prepare an architectural brief.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Info & Guarantees */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Engineering Office Details
            </h3>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Direct Email</div>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-gray-400 hover:text-white transition-colors">
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Locations</div>
                  <p className="text-gray-400">{siteConfig.contact.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Engineering Hours</div>
                  <p className="text-gray-400">{siteConfig.contact.availability}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-dark-elevated border border-dark-border space-y-3 text-xs text-gray-400 leading-relaxed">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Data Protection Guarantee</span>
            </div>
            <p>
              All operational details, tool configurations, and sample documents submitted to CareerForgeX
              are protected under standard mutual non-disclosure and processed in strictly isolated environments.
            </p>
          </div>
        </div>

        {/* Right Column: Full Structured Lead Form */}
        <div className="lg:col-span-8">
          <LeadForm />
        </div>
      </div>
    </div>
  );
}
