"use client";

import { usePathname } from "next/navigation";
import { SiteShell as OriginalSiteShell } from "./SiteShell";
import { SiteShell as PublicSiteShell } from "./public-site/SiteShell";

/** Private areas and the advertising audit keep their existing presentation. */
export function BrandSiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const preserved = ["/administration", "/connexion", "/audit"].some(
    route => pathname === route || pathname.startsWith(`${route}/`),
  );
  return preserved ? <OriginalSiteShell>{children}</OriginalSiteShell> : <PublicSiteShell>{children}</PublicSiteShell>;
}
