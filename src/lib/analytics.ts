export type AnalyticsEventName =
  | "page_view"
  | "cta_click"
  | "service_view"
  | "demo_started"
  | "demo_completed"
  | "contact_started"
  | "contact_submitted"
  | "booking_started"
  | "booking_completed"
  | "roi_calculated";

export function trackEvent(name: AnalyticsEventName, properties?: Record<string, any>) {
  if (typeof window === "undefined") return;

  // Check consent stored in localStorage
  const consent = localStorage.getItem("cfx_cookie_consent");
  if (consent !== "accepted") {
    return; // Strict privacy: do not track without explicit user consent
  }

  // If PostHog or GA is loaded in window
  if ((window as any).posthog) {
    (window as any).posthog.capture(name, properties);
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[ANALYTICS] Event: ${name}`, properties);
  }
}
