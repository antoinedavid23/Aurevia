import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PageHero({ label, title, text, image }: { label: string; title: string; text: string; image?: string }) {
  return (
    <section
      className={`page-hero velyo-page-hero ${image ? "page-hero-image" : ""}`}
      style={image ? { backgroundImage: `linear-gradient(90deg,rgba(17,19,24,.88),rgba(17,19,24,.28)),url(${image})` } : undefined}
    >
      <div className="container"><p className="eyebrow">{label}</p><h1>{title}</h1><p>{text}</p></div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="section final-cta velyo-final-cta">
      <p className="eyebrow">Première étape</p>
      <h2>Parlons de votre bien.</h2>
      <p>Un échange simple pour comprendre la propriété, la zone et ce que vous souhaitez déléguer.</p>
      <Link className="button" href="/valutazione">Demander une estimation <ArrowRight size={16} /></Link>
    </section>
  );
}
