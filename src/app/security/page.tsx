import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, Server, Terminal, UserCheck, Key, FileCheck, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Enterprise Security & Data Governance",
  description: "Detailed architecture overview of CareerForgeX data handling, encryption, private VPC deployment, and human approval gates.",
};

export default function SecurityPage() {
  const sections = [
    {
      title: "Data Handling & Privacy Boundaries",
      desc: "Client documents, customer conversations, and internal proprietary data are strictly segregated. We enforce explicit data boundaries: client data is never used to train or fine-tune public foundation models.",
    },
    {
      title: "Encryption in Transit & at Rest",
      desc: "All network traffic is encrypted via TLS 1.3 using modern cipher suites. Data at rest is encrypted using AES-256 with tenant-scoped KMS keys. Ephemeral demo documents are immediately purged from memory upon completion.",
    },
    {
      title: "Secrets & Credential Management",
      desc: "We never store raw API keys or database passwords in standard database tables. All external service credentials reside in isolated environment vaults (AWS Secrets Manager, Supabase Vault, or Doppler) accessed through role-based IAM.",
    },
    {
      title: "Human-in-the-Loop Governance",
      desc: "High-impact actions (such as dispatching external contracts, executing financial wires, or deleting database rows) require mandatory operator approval. Agents cannot perform unmonitored high-stakes operations.",
    },
    {
      title: "Private Cloud & On-Premise Deployment",
      desc: "For enterprises with strict data residency or SOC2/HIPAA constraints, we architect isolated deployments within your private AWS, GCP, or Azure VPC, utilizing dedicated n8n clusters and open-weights models (Llama 3, Mistral).",
    },
    {
      title: "Audit Logging & Immutable Telemetry",
      desc: "Every automated execution, tool invocation, human sign-off, and administrative update produces a structured JSON audit log recording user identity, timestamp, IP address, and payload hash.",
    },
  ];

  return (
    <div className="py-16 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SECURITY & COMPLIANCE ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Enterprise-Grade Security by Design.
        </h1>
        <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          AI automation creates immense efficiency, but only when built on a foundation of rigorous data
          isolation, least-privilege permissions, and human governance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="p-7 rounded-2xl bg-dark-card border border-dark-border space-y-2.5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent-cyan" />
              <span>{sec.title}</span>
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">{sec.desc}</p>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-2xl bg-dark-elevated border border-dark-border space-y-3 text-xs text-gray-400 leading-relaxed">
        <h3 className="text-sm font-bold text-white">Compliance & Third-Party Audits Note</h3>
        <p>
          CareerForgeX builds systems adhering to SOC2 Type II, HIPAA, and GDPR architectural principles.
          We provide customers with complete architecture documentation, data flow diagrams, and vulnerability scans
          required to satisfy external vendor risk management assessments.
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/book"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-600/30"
        >
          <span>Request Security Whitepaper & Architecture Review</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
