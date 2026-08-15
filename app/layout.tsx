import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { LocaleController } from "@/components/LocaleController";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "./globals.css";
import "./velyo.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const email = process.env.NEXT_PUBLIC_EMAIL || "contact@velyo.pm";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Velyo Property Manager | Gestion locative à Genova",
    template: "%s | Velyo Property Manager",
  },
  description: "Gestion locative, accueil voyageurs, entretien et suivi propriétaire à Genova.",
  openGraph: {
    url: siteUrl,
    title: "Velyo Property Manager",
    description: "Votre bien, bien géré. Vos voyageurs, bien accueillis.",
    type: "website",
    locale: "fr_FR",
    images: [{
      url: "/images/home/genova-night.webp",
      width: 1920,
      height: 960,
      alt: "Velyo Property Manager à Genova",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velyo Property Manager",
    description: "Property management local à Genova.",
    images: ["/images/home/genova-night.webp"],
  },
  icons: {
    icon: [{ url: "/images/brand/velyo-mark.svg", type: "image/svg+xml" }],
    shortcut: "/images/brand/velyo-mark.svg",
    apple: "/images/brand/velyo-mark.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Velyo Property Manager",
        url: siteUrl,
        logo: `${siteUrl}/images/brand/velyo-logo-dark.svg`,
        email,
        description: "Gestion locative et property management à Genova.",
        areaServed: ["Genova", "Gênes", "Ligurie"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Velyo Property Manager",
        inLanguage: "fr",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <html lang="fr">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <LocaleController><SiteShell>{children}</SiteShell></LocaleController>
      </body>
    </html>
  );
}
