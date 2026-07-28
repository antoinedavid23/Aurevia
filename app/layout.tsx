import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

const serif = Cinzel({subsets:["latin"],variable:"--font-serif",weight:["400","500","600"]});
const sans = Montserrat({subsets:["latin"],variable:"--font-sans",weight:["300","400","500","600"]});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {default:"AUREVIA Private Concierge | Genova & Liguria",template:"%s | AUREVIA"},
  description:"Gestione esclusiva di proprietà e ospitalità su misura a Genova e in Liguria.",
  openGraph:{title:"AUREVIA Private Concierge",description:"L’arte di prendersi cura di ciò che conta.",type:"website",locale:"it_IT",images:["/og.png"]},
  twitter:{card:"summary_large_image",title:"AUREVIA Private Concierge",description:"Gestione esclusiva a Genova e in Liguria.",images:["/og.png"]},
  icons:{icon:"/images/brand/favicon.svg"}
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="it"><body className={`${serif.variable} ${sans.variable}`}><SiteShell>{children}</SiteShell></body></html>
}
