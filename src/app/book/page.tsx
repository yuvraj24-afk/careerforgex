import { BookingForm } from "@/components/booking-form";
import { Calendar, Clock, Globe, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Book a Systems Discovery Session",
  description: "Schedule a 30-minute technical architecture review with our Lead AI Automation Architects.",
};

export default function BookDiscoveryPage() {
  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <Calendar className="w-3.5 h-3.5" />
          <span>DIRECT ARCHITECT SCHEDULING</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Book a Free Automation Audit.
        </h1>
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
          Reserve a 30-minute video session with our Lead Systems Architect. We will walk through your current
          repetitive operational workflows, review integration feasibility, and map high-ROI agent nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Agenda & Guarantees */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Discovery Session Agenda
            </h3>

            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-brand-400 font-bold">10m:</span>
                <span>Audit current manual bottlenecks and data entry tasks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-brand-400 font-bold">10m:</span>
                <span>Review software APIs (CRMs, databases, email, ERPs).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-brand-400 font-bold">10m:</span>
                <span>Map candidate AI agent nodes, guardrails, and timeline.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-dark-elevated border border-dark-border space-y-3 text-xs text-gray-400 leading-relaxed">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Sales Pressure</span>
            </div>
            <p>
              You'll be speaking directly with an engineer who designs and deploys AI systems—not an outsourced SDR.
              Our goal is to give you architectural clarity on what can genuinely be automated.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Booking Form */}
        <div className="lg:col-span-8">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
