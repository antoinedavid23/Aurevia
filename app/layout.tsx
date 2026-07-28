import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "AUREVIA | Gestion de propriétés à Gênes et en Ligurie", template: "%s | AUREVIA" },
  description: "Gestion exclusive de propriétés et hospitalité sur mesure à Gênes et en Ligurie.",
  openGraph: {
    title: "AUREVIA",
    description: "L’art de prendre soin de ce qui compte.",
    type: "website",
    locale: "fr_FR",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AUREVIA",
    description: "Gestion exclusive à Gênes et en Ligurie.",
    images: ["/og.png"],
  },
  icons: { icon: "/images/brand/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body className={`${serif.variable} ${sans.variable}`}><SiteShell>{children}</SiteShell></body></html>;
}
