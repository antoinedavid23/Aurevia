import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero, CTA } from "@/components/PageHero";
import type { Metadata } from "next";
import { experiences } from "@/data/content";

export const metadata: Metadata = {
  title: "Expériences et recommandations à Genova",
  description: "Parcours locaux, adresses et escapades faciles à proposer aux voyageurs à Genova.",
  alternates: { canonical: "/esperienze" },
};

export default function Page() {
  return <>
    <PageHero label="Expériences" title="Genova, avec les bons repères" text="Des idées locales, réalistes et faciles à intégrer au séjour : quartiers, promenades, tables et escapades adaptées au temps disponible." image="/images/about/genova-architecture.webp" />
    <section className="section"><div className="container experience-page-intro"><p className="eyebrow">Le guide Velyo</p><h2>Des recommandations utiles, pas un catalogue de prestige.</h2><p>Chaque suggestion peut être adaptée au quartier du logement, à la saison, à la mobilité et au rythme des voyageurs.</p></div><div className="container card-grid three mobile-two-grid">{experiences.map((experience) => <Link href={`/esperienze/${experience.slug}`} className={`service-card service-card-image experience-service-card experience-service-card-${experience.slug}`} style={{ backgroundImage: `linear-gradient(180deg,rgba(17,19,24,.04),rgba(17,19,24,.88)),url(${experience.image})` }} key={experience.slug}><div className="service-card-top"><span>GENOVA</span><ArrowUpRight /></div><div className="service-card-copy"><h3>{experience.title}</h3><p>{experience.short}</p><ul className="experience-card-details">{experience.details.map((detail) => <li key={detail}>{detail}</li>)}</ul><small>Découvrir le parcours</small></div></Link>)}</div><div className="container"><p className="demo-note">Les horaires, disponibilités, conditions et tarifs de partenaires doivent être vérifiés avant confirmation.</p></div></section>
    <CTA />
  </>;
}
