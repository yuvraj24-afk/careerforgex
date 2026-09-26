import Link from "next/link";
import { FAQAccordion } from "@/components/faq-accordion";
import { faqsData } from "@/data/faqs";
import { HelpCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Detailed technical, operational, and security answers regarding AI automation systems.",
};

export default function FAQPage() {
  return (
    <div className="py-16 lg:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>KNOWLEDGE BASE & FAQ</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Frequently Asked Questions.
        </h1>
        <p className="text-base text-gray-400">
          Everything you need to know about our AI agents, workflow pipelines, security, and implementation.
        </p>
      </div>

      <FAQAccordion items={faqsData} />

      <div className="p-8 rounded-2xl bg-dark-card border border-dark-border text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Have a question not listed here?</h3>
        <p className="text-xs text-gray-400">
          Our systems architects are happy to review your custom workflow and security constraints.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/30"
        >
          <span>Ask Our Team</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
