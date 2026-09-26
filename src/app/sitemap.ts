import { MetadataRoute } from "next";
import { servicesData } from "@/data/services";
import { solutionsData } from "@/data/solutions";
import { industriesData } from "@/data/industries";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://careerforgex.com";

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/solutions",
    "/industries",
    "/how-it-works",
    "/case-studies",
    "/pricing",
    "/demo",
    "/contact",
    "/book",
    "/resources",
    "/blog",
    "/faq",
    "/security",
    "/privacy",
    "/terms",
    "/status",
    "/docs/api",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const serviceRoutes = servicesData.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const solutionRoutes = solutionsData.map((s) => ({
    url: `${baseUrl}/solutions/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const industryRoutes = industriesData.map((i) => ({
    url: `${baseUrl}/industries/${i.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes, ...solutionRoutes, ...industryRoutes];
}
