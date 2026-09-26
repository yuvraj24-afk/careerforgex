import Link from "next/link";
import { solutionsData } from "@/data/solutions";
import { ArrowRight, Target, Headphones, Activity, Users, CreditCard, Megaphone, Rocket } from "lucide-react";

export const metadata = {
  title: "AI Solutions by Department",
  description: "Discover how CareerForgeX automates operations for Sales, Customer Support, Operations, HR, Finance, Marketing, and Founders.",
};

const iconMap: Record<string, any> = {
  sales: Target,
  "customer-support": Headphones,
  operations: Activity,
  hr: Users,
  finance: CreditCard,
  marketing: Megaphone,
  founders: Rocket,
};

export default function SolutionsPage() {
  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <Activity className="w-3.5 h-3.5" />
          <span>DEPARTMENTAL AUTOMATION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Solutions Engineered by Department.
        </h1>
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
          Operational bottlenecks look different in Sales than they do in Finance or HR.
          We deploy specialized systems architected around the unique software and workflows of each department.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {solutionsData.map((sol) => {
          const Icon = iconMap[sol.slug] || Activity;
          return (
            <div
              key={sol.slug}
              className="rounded-2xl bg-dark-card border border-dark-border p-7 hover:border-brand-500/50 hover:bg-dark-elevated transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-dark-elevated group-hover:bg-brand-600/20 border border-dark-border flex items-center justify-center text-brand-400 mb-4 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>

                <span className="text-[10px] font-mono uppercase text-gray-500">{sol.department}</span>
                <h2 className="text-xl font-bold text-white mt-1 group-hover:text-brand-300 transition-colors">
                  {sol.title}
                </h2>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {sol.description}
                </p>

                <div className="mt-6 pt-4 border-t border-dark-border space-y-2">
                  <span className="text-[10px] font-mono uppercase text-gray-500">Automation Targets:</span>
                  <ul className="space-y-1 text-xs text-gray-300">
                    {sol.automationOpportunities.slice(0, 3).map((opp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-brand-400 font-mono text-[10px] mt-0.5">•</span>
                        <span className="line-clamp-1">{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-dark-border flex items-center justify-between">
                <Link
                  href={`/solutions/${sol.slug}`}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                >
                  <span>Explore Department Flow</span>
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
