import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Privacy Policy",
  description: "CareerForgeX Privacy Policy covering data collection, processing, and protection standards.",
};

export default function PrivacyPage() {
  return (
    <div className="py-16 lg:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-gray-300 leading-relaxed">
      <div className="border-b border-dark-border pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-xs text-gray-500 font-mono">Last Updated: September 2026</p>
      </div>

      <div className="p-4 rounded-xl bg-dark-card border border-dark-border text-xs text-gray-400 italic">
        Disclaimer: This website does not provide legal advice. The terms and statements herein govern the use
        of the CareerForgeX platform and informational website.
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">1. Company & Entity Information</h2>
        <p>
          This policy applies to <strong>CareerForgeX, Inc.</strong> ("[Company Legal Name Placeholder]"),
          with registered office at <strong>[Registered Address Placeholder, San Francisco, CA]</strong>,
          contact email: <a href={`mailto:${siteConfig.contact.email}`} className="text-brand-400 hover:underline">{siteConfig.contact.email}</a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">2. Information We Collect</h2>
        <p>
          We collect information you explicitly provide when requesting an automation audit, scheduling a discovery call,
          submitting a contact form, or testing our interactive demos:
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-400">
          <li>Contact details: Name, work email address, company name, website.</li>
          <li>Operational data: Current software tools, process descriptions, budget ranges, and project timelines.</li>
          <li>Interactive demo inputs: Sample inquiries, text snippets, and uploaded test documents.</li>
          <li>Technical telemetry: Anonymized IP addresses (for rate-limiting), browser headers, and cookie preferences.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">3. How We Use Your Information</h2>
        <p>
          We use your submitted data strictly to:
        </p>
        <ul className="list-disc list-inside space-y-1 text-gray-400">
          <li>Evaluate technical feasibility and prepare tailored architecture proposals.</li>
          <li>Schedule and conduct discovery video calls.</li>
          <li>Prevent spam, abuse, and denial-of-service through automated rate limiting.</li>
          <li>Process ephemeral sample extractions in memory without persistent file retention.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">4. No Sale of Personal Data & Zero AI Training</h2>
        <p>
          We never sell, rent, or monetize your personal or business data. Furthermore, we explicitly enforce policies
          with our foundation model providers (such as OpenAI, Anthropic, and Google Cloud) ensuring customer data is
          never utilized to train public foundation models.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">5. Your Privacy Rights</h2>
        <p>
          Under GDPR, CCPA, and applicable state privacy laws, you have the right to request access, correction, or
          complete deletion of your personal data from our records. To submit a request, contact{" "}
          <a href={`mailto:${siteConfig.contact.email}`} className="text-brand-400 hover:underline">
            {siteConfig.contact.email}
          </a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">6. Governing Jurisdiction</h2>
        <p>
          These terms and privacy protocols shall be construed and governed in accordance with the laws of
          <strong> [Jurisdiction Placeholder, State of Delaware / California, United States]</strong>.
        </p>
      </section>
    </div>
  );
}
