import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { LocaleController } from "@/components/LocaleController";
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/500.css";
import "@fontsource/cinzel/600.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://aurevia-genova.com"),
  title: { default: "AUREVIA | Gestione di proprietà a Genova e in Liguria", template: "%s | AUREVIA" },
  description: "Gestione esclusiva di proprietà e ospitalità su misura a Genova e in Liguria.",
  openGraph: {
    url: "https://aurevia-genova.com",
    title: "AUREVIA",
    description: "L’arte di prendersi cura di ciò che conta.",
    type: "website",
    locale: "it_IT",
    images: [{
      url: "/images/home/hero-concierge.webp",
      width: 1680,
      height: 945,
      alt: "AUREVIA — Gestione esclusiva di proprietà a Genova e in Liguria",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AUREVIA",
    description: "Gestione esclusiva a Genova e in Liguria.",
    images: ["/images/home/hero-concierge.webp"],
  },
  icons: {
    icon: [{ url: "/favicon.png?v=3", type: "image/png" }],
    shortcut: "/favicon.png?v=3",
    apple: "/favicon.png?v=3",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://aurevia-genova.com/#organization",
        name: "AUREVIA",
        url: "https://aurevia-genova.com",
        logo: "https://aurevia-genova.com/images/brand/aurevia-logo-transparent-gold.png",
        email: "contatto@aurevia-genova.com",
        description: "Gestione esclusiva di proprietà e ospitalità su misura a Genova e in Liguria.",
        areaServed: ["Genova", "Liguria", "Riviera Ligure"],
      },
      {
        "@type": "WebSite",
        "@id": "https://aurevia-genova.com/#website",
        url: "https://aurevia-genova.com",
        name: "AUREVIA",
        inLanguage: "it",
        publisher: { "@id": "https://aurevia-genova.com/#organization" },
      },
    ],
  };
  return <html lang="it" className="locale-pending"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}}/><LocaleController><SiteShell>{children}</SiteShell></LocaleController><noscript><style>{`.locale-pending body{visibility:visible!important}`}</style></noscript></body></html>;
}
