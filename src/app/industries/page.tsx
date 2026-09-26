import Link from "next/link";
import { industriesData } from "@/data/industries";
import { ArrowRight, Building2, ShoppingBag, Home, GraduationCap, HeartPulse, Landmark, Factory, Palette, Briefcase } from "lucide-react";

export const metadata = {
  title: "AI Automation by Industry",
  description: "Explore tailored AI automation workflows for E-Commerce, Real Estate, Healthcare, Finance, Startups, Manufacturing, and Professional Services.",
};

const iconMap: Record<string, any> = {
  startups: Building2,
  ecommerce: ShoppingBag,
  "real-estate": Home,
  education: GraduationCap,
  healthcare: HeartPulse,
  finance: Landmark,
  manufacturing: Factory,
  agencies: Palette,
  "professional-services": Briefcase,
};

export default function IndustriesPage() {
  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <Building2 className="w-3.5 h-3.5" />
          <span>VERTICAL SPECIALIZATIONS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          AI Systems Tailored to Your Industry.
        </h1>
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
          Every industry has distinct regulatory requirements, software ecosystems, and customer interaction patterns.
          We architect compliance-conscious workflows designed for your specific vertical.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {industriesData.map((ind) => {
          const Icon = iconMap[ind.slug] || Building2;
          return (
            <div
              key={ind.slug}
              className="rounded-2xl bg-dark-card border border-dark-border p-7 hover:border-brand-500/50 hover:bg-dark-elevated transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-dark-elevated group-hover:bg-brand-600/20 border border-dark-border flex items-center justify-center text-brand-400 mb-4 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>

                <h2 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">
                  {ind.name}
                </h2>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {ind.tagline}
                </p>

                <div className="mt-6 pt-4 border-t border-dark-border space-y-2">
                  <span className="text-[10px] font-mono uppercase text-gray-500">Key Integrations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ind.keyIntegrations.slice(0, 4).map((tool, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-dark-elevated border border-dark-border text-[10px] font-mono text-gray-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-dark-border flex items-center justify-between">
                <Link
                  href={`/industries/${ind.slug}`}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                >
                  <span>View Vertical Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/book" className="text-xs font-mono text-gray-400 hover:text-white">
                  Audit &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
