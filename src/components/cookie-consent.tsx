"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("cfx_cookie_consent");
    if (!stored) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cfx_cookie_consent", "accepted");
    localStorage.setItem("cfx_consent_analytics", "true");
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem("cfx_cookie_consent", "rejected");
    localStorage.setItem("cfx_consent_analytics", "false");
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cfx_cookie_consent", "custom");
    localStorage.setItem("cfx_consent_analytics", analyticsAllowed ? "true" : "false");
    setShowPreferences(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Sticky Bottom Consent Banner */}
      <div
        role="region"
        aria-label="Cookie consent banner"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-2xl bg-dark-card/95 border border-dark-border backdrop-blur-xl shadow-2xl text-xs space-y-3 animate-in slide-in-from-bottom-5 duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span>Privacy & Cookie Governance</span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-gray-500 hover:text-white"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-gray-400 leading-relaxed">
          We use strictly necessary cookies to ensure system security and session routing.
          With your permission, we also utilize privacy-respecting analytics to optimize system telemetry.
          Learn more in our{" "}
          <Link href="/privacy" className="text-brand-400 hover:underline">
            Privacy Policy
          </Link>.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleAcceptAll}
            className="flex-1 py-1.5 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors"
          >
            Accept All
          </button>
          <button
            onClick={handleRejectAll}
            className="py-1.5 px-3 rounded-lg bg-dark-elevated hover:bg-dark-border text-gray-300 transition-colors"
          >
            Reject Non-Essential
          </button>
          <button
            onClick={() => setShowPreferences(true)}
            className="text-gray-400 hover:text-white text-[11px] underline ml-1"
          >
            Preferences
          </button>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-dark-card border border-dark-border p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <h3 className="text-sm font-semibold text-white">Cookie Preferences</h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-dark-elevated border border-dark-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Strictly Necessary Cookies</span>
                  <span className="text-[10px] font-mono text-emerald-400">Always Active</span>
                </div>
                <p className="text-gray-400 mt-1">Required for authentication, CSRF validation, and security.</p>
              </div>

              <div className="p-3 rounded-xl bg-dark-elevated border border-dark-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Telemetry & Performance</span>
                  <input
                    type="checkbox"
                    checked={analyticsAllowed}
                    onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                    className="accent-brand-500 cursor-pointer w-4 h-4"
                  />
                </div>
                <p className="text-gray-400 mt-1">Anonymous interaction metrics to evaluate demo and page performance.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
