import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://aurevia-genova.com";
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/administration", "/connexion", "/api/", "/grazie"] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
