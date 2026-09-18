import type { Metadata } from "next";
import { translate } from "@/lib/public-site/i18n";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aurevia-genova.com";

export function pageMetadata({ title, description, path, image = "/images/home/hero-concierge.webp" }: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const canonical = new URL(path, siteUrl).toString();
  const socialImage = new URL(image, siteUrl).toString();
  const italianTitle = translate(title, "it");
  const italianDescription = translate(description, "it");
  return {
    title: italianTitle,
    description: italianDescription,
    alternates: { canonical: path },
    openGraph: {
      title: italianTitle,
      description: italianDescription,
      url: canonical,
      type: "website",
      locale: "it_IT",
      siteName: "AUREVIA",
      images: [{ url: socialImage, alt: italianTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: italianTitle,
      description: italianDescription,
      images: [socialImage],
    },
  };
}
