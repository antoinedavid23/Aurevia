import Image from "@/components/public-site/SiteImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ItalianContent } from "@/components/public-site/ItalianContent";

export function PageHero({ label, title, text, image }: { label: string; title: string; text: string; image?: string }) {
  return (
    <ItalianContent><section key={`${label}-${title}-${image ?? "no-image"}`} className={`page-hero aurevia-page-hero ${image ? "page-hero-image" : "page-hero-no-image"}`}>
      {image && <Image className={`aurevia-page-hero-background${image.includes("genova-blue-hour-premium") ? " aurevia-page-hero-background-city" : ""}`} src={image} fill priority sizes="100vw" alt={`${label} — ${title}`} />}
      <div className="aurevia-page-hero-overlay" aria-hidden="true" />
      <div className="container aurevia-page-hero-layout">
        <div className={`aurevia-page-hero-copy${title.trim().startsWith("A") ? " title-starts-a" : ""}`}>
          <p className="eyebrow">{label}</p>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
      </div>
    </section></ItalianContent>
  );
}

export function CTA() {
  return (
    <ItalianContent><section className="site-footer-cta" id="confier-mon-bien" aria-label="Présenter votre bien à AUREVIA">
      <div className="container site-footer-cta-inner">
        <div className="site-footer-cta-copy">
          <p>Une gestion pensée pour votre bien</p>
          <h2>Votre bien mérite<br /><em>une gestion qui rassure.</em></h2>
          <span>Parlons de vos objectifs, de vos contraintes et du niveau de délégation souhaité. Vous recevrez une première orientation claire et sans engagement.</span>
        </div>
        <Link className="site-footer-cta-button" href="/valutazione">Confier mon bien <ArrowRight size={18} /></Link>
      </div>
    </section></ItalianContent>
  );
}
