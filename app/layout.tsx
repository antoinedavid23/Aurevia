import type { Metadata } from "next";
import { Cinzel, Manrope } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import { LocaleController } from "@/components/LocaleController";
import "./globals.css";

const serif = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
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
  return <html lang="it"><body className={`${serif.variable} ${sans.variable}`}><LocaleController><SiteShell>{children}</SiteShell></LocaleController></body></html>;
}
