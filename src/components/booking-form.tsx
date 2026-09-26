"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, Loader2, ArrowRight, Globe } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface BookingFormProps {
  prefilledEmail?: string;
  prefilledName?: string;
  prefilledCompany?: string;
}

export function BookingForm({ prefilledEmail, prefilledName, prefilledCompany }: BookingFormProps) {
  // Generate next 7 business days for quick selection
  const availableDates: string[] = [];
  const today = new Date();
  for (let i = 1; i <= 10; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // Exclude weekends
    if (d.getDay() !== 0 && d.getDay() !== 6 && availableDates.length < 5) {
      availableDates.push(d.toISOString().split("T")[0]);
    }
  }

  const timeSlots = ["09:00", "11:00", "14:00", "16:00", "17:30"];

  const [name, setName] = useState<string>(prefilledName || "");
  const [email, setEmail] = useState<string>(prefilledEmail || "");
  const [company, setCompany] = useState<string>(prefilledCompany || "");
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0] || "2026-10-02");
  const [selectedTime, setSelectedTime] = useState<string>("14:00");
  const [timezone, setTimezone] = useState<string>(
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "America/New_York"
  );
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    id: string;
    meetingLink?: string;
    date: string;
    time: string;
    timezone: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !company || !selectedDate || !selectedTime) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    trackEvent("booking_started", { company });

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          date: selectedDate,
          time: selectedTime,
          timezone,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to reserve booking slot.");
      }

      setConfirmedBooking({
        id: data.bookingId,
        meetingLink: data.meetingLink,
        date: selectedDate,
        time: selectedTime,
        timezone,
      });

      trackEvent("booking_completed", { bookingId: data.bookingId });
    } catch (err: any) {
      setError(err.message || "Failed to reserve slot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div className="rounded-2xl bg-dark-card border border-emerald-500/40 p-8 lg:p-10 shadow-2xl space-y-6 animate-in fade-in duration-300">
        <div className="w-12 h-12 rounded-xl bg-emerald-950/70 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div>
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
            DISCOVERY CALL RESERVED • CONFIRMATION #{confirmedBooking.id.slice(0, 8)}
          </span>
          <h3 className="text-2xl font-bold text-white mt-1">
            Systems Discovery Session Confirmed
          </h3>
          <p className="text-sm text-gray-300 mt-2 leading-relaxed">
            A calendar invitation and conference link have been sent to{" "}
            <span className="text-white font-medium">{email}</span>.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-dark-elevated border border-dark-border space-y-3">
          <div className="flex items-center gap-3 text-xs text-gray-300">
            <CalendarIcon className="w-4 h-4 text-brand-400 shrink-0" />
            <span>
              <strong>Date:</strong> {confirmedBooking.date}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-300">
            <Clock className="w-4 h-4 text-brand-400 shrink-0" />
            <span>
              <strong>Time:</strong> {confirmedBooking.time} ({confirmedBooking.timezone})
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-300">
            <Globe className="w-4 h-4 text-accent-cyan shrink-0" />
            <span>
              <strong>Format:</strong> 30-Minute Video Systems Architecture Review
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-dark-bg border border-dark-border text-xs text-gray-400 leading-relaxed">
          <span className="font-semibold text-gray-300">Preparation:</span> If possible, have a quick list of your current software licenses (CRMs, databases, email, ERP) and the primary repetitive bottlenecks you want removed.
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center py-2.5 px-5 rounded-lg bg-dark-elevated hover:bg-dark-border text-gray-300 text-xs font-medium transition-colors"
          >
            Return to Homepage
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center py-2.5 px-5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium transition-colors"
          >
            Review 8-Step Process &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-dark-card border border-dark-border p-6 lg:p-10 shadow-2xl space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Row 1: Name, Email, Company */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Your Name <span className="text-brand-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Alex Sterling"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Work Email <span className="text-brand-400">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="alex@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Company Name <span className="text-brand-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Acme Systems"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Date Picker Buttons */}
      <div>
        <label className="block text-xs font-medium text-gray-300 mb-2">
          Select Preferred Date <span className="text-brand-400">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {availableDates.map((dateStr) => {
            const isSelected = selectedDate === dateStr;
            const dateObj = new Date(dateStr + "T00:00:00");
            const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
            const monthDay = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });

            return (
              <button
                type="button"
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-600/30 scale-102"
                    : "bg-dark-elevated border-dark-border text-gray-400 hover:text-white hover:border-gray-600"
                }`}
              >
                <div className="text-[10px] font-mono uppercase">{dayName}</div>
                <div className="text-xs font-bold mt-0.5">{monthDay}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Picker */}
      <div>
        <label className="block text-xs font-medium text-gray-300 mb-2">
          Select Time Slot <span className="text-brand-400">*</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {timeSlots.map((slot) => {
            const isSelected = selectedTime === slot;
            return (
              <button
                type="button"
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`py-2 px-3 rounded-lg border text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/30"
                    : "bg-dark-elevated border-dark-border text-gray-400 hover:text-white"
                }`}
              >
                {slot} EST
              </button>
            );
          })}
        </div>
      </div>

      {/* Timezone & Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Your Timezone
          </label>
          <input
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors font-mono"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Specific Focus or Systems to Discuss (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Connecting Shopify to NetSuite, building private legal RAG"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-brand-600/30 transition-all hover:shadow-brand-500/50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Reserving Systems Review Slot...</span>
          </>
        ) : (
          <>
            <span>Confirm Discovery Session ({selectedDate} @ {selectedTime})</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="text-center text-[11px] text-gray-500 font-mono">
        Free 30-minute session with a Principal Systems Architect • No sales pressure
      </div>
    </form>
  );
}
