import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";

export const viewport: Viewport = {
  themeColor: "#0A0D14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://careerforgex.com"),
  title: {
    default: `${siteConfig.brand.name} | ${siteConfig.brand.primaryHeadline}`,
    template: `%s | ${siteConfig.brand.name}`,
  },
  description: siteConfig.brand.subheading,
  keywords: [
    "AI automation agency",
    "AI automation company",
    "business automation",
    "AI agents for business",
    "workflow automation",
    "AI customer support",
    "sales automation",
    "AI workflow agency",
    "custom AI automation",
    "AI integration services",
    "RAG knowledge systems",
    "document intelligence",
  ],
  authors: [{ name: siteConfig.brand.name }],
  creator: siteConfig.brand.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://careerforgex.com",
    title: `${siteConfig.brand.name} — ${siteConfig.brand.primaryHeadline}`,
    description: siteConfig.brand.subheading,
    siteName: siteConfig.brand.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand.name} — ${siteConfig.brand.primaryHeadline}`,
    description: siteConfig.brand.subheading,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brand.name,
    url: "https://careerforgex.com",
    logo: "https://careerforgex.com/icon.png",
    description: siteConfig.brand.subheading,
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.contact.email,
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: [
      "https://twitter.com/careerforgex",
      "https://linkedin.com/company/careerforgex",
      "https://github.com/careerforgex",
    ],
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-dark-bg text-gray-100 flex flex-col font-sans antialiased selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
