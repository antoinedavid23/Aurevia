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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://aurevia-private-concierge.grizz802.chatgpt.site"),
  title: { default: "AUREVIA | Gestione di proprietà a Genova e in Liguria", template: "%s | AUREVIA" },
  description: "Gestione esclusiva di proprietà e ospitalità su misura a Genova e in Liguria.",
  openGraph: {
    title: "AUREVIA",
    description: "L’arte di prendersi cura di ciò che conta.",
    type: "website",
    locale: "it_IT",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AUREVIA",
    description: "Gestione esclusiva a Genova e in Liguria.",
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon.png?v=3", type: "image/png" }],
    shortcut: "/favicon.png?v=3",
    apple: "/favicon.png?v=3",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="it" className="locale-pending"><body><LocaleController><SiteShell>{children}</SiteShell></LocaleController><noscript><style>{`.locale-pending body{visibility:visible!important}`}</style></noscript></body></html>;
}
