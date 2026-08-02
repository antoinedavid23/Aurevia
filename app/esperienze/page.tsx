import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero, CTA } from "@/components/PageHero";
import { experiences } from "@/data/content";

export default function Page() {
  return <>
    <PageHero label="Expériences" title="Des moments exclusifs, organisés sur mesure" text="Le meilleur de la Ligurie, orchestré avec soin et discrétion." image="/images/experiences/yacht.webp" />
    <section className="section">
      <div className="container card-grid three mobile-two-grid">
        {experiences.map((experience) =>
          <Link
            href={`/esperienze/${experience.slug}`}
            className={`service-card service-card-image experience-service-card experience-service-card-${experience.slug}`}
            style={{ backgroundImage: `linear-gradient(180deg,rgba(7,16,25,.04),rgba(7,16,25,.9)),url(${experience.image})` }}
            key={experience.slug}
          >
            <div className="service-card-top"><span>SUR DEMANDE</span><ArrowUpRight /></div>
            <div className="service-card-copy">
              <h3>{experience.title}</h3>
              <p>{experience.short}</p>
              <ul className="experience-card-details">
                {experience.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
              <small>Découvrir l’expérience</small>
            </div>
          </Link>
        )}
      </div>
      <div className="container"><p className="demo-note">Les expériences sont organisées sur demande et sous réserve de disponibilité.</p></div>
    </section>
    <CTA />
  </>;
}
