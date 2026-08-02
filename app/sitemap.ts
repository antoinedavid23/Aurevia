import type { MetadataRoute } from "next";
import { experiences, services } from "@/data/content";

const base = "https://aurevia-genova.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const mainPages = [
    "", "/servizi", "/proprieta", "/esperienze", "/chi-siamo",
    "/proprietari", "/simulatore", "/valutazione", "/contatti", "/faq",
    "/mentions-legales", "/privacy", "/cookie-policy", "/termini",
  ];
  const detailPages = [
    ...services.map(({ slug }) => `/servizi/${slug}`),
    ...experiences.map(({ slug }) => `/esperienze/${slug}`),
  ];
  return [...mainPages, ...detailPages].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.split("/").filter(Boolean).length === 1 ? 0.8 : 0.7,
  }));
}
