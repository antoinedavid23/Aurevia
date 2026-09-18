import Image from "@/components/public-site/SiteImage";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Experience, Property, Service } from "@/data/public-site/content";
import type { ExperienceCategory } from "@/data/public-site/experience-categories";
import { ItalianContent } from "@/components/public-site/ItalianContent";

const homeServiceCopy: Record<string, { title: string; text: string }> = {
  "gestione-proprieta": {
    title: "Gestion intégrale du bien",
    text: "Calendrier, réservations et échanges voyageurs pilotés par un interlocuteur unique.",
  },
  "accoglienza-voyageurs": {
    title: "Accueil des voyageurs",
    text: "Accès, clés et informations pratiques préparés avant l’installation des voyageurs.",
  },
  "pulizie-biancheria": {
    title: "Entretien & linge",
    text: "Ménage, rotation du linge, réassort et contrôle final entre deux séjours.",
  },
};

export function ServiceCard({ service, variant = "catalog" }: { service: Service; variant?: "catalog" | "home" }) {
  if (variant === "home") {
    const copy = homeServiceCopy[service.slug] ?? { title: service.cardTitle ?? service.title, text: service.short };

    return <ItalianContent><Link className="home-service-card" href={`/servizi/${service.slug}`} aria-label={`Découvrir le service : ${service.title}`}>
      <div className="home-service-card-media">
        <Image src={service.image || "/images/public-site/concierge/home-preparation-premium.webp"} fill sizes="(max-width: 760px) 100vw, 33vw" alt={copy.title} />
        <span>{service.number}</span>
      </div>
      <div className="home-service-card-copy">
        <small>{service.category}</small>
        <h3>{copy.title}</h3>
        <p>{copy.text}</p>
        <span className="home-service-card-link">Découvrir le service <ArrowRight size={14} /></span>
      </div>
    </Link></ItalianContent>;
  }

  return <ItalianContent><Link className="catalog-card service-catalog-card" href={`/servizi/${service.slug}`} aria-label={`Découvrir le service : ${service.title}`}>
    <div className="catalog-card-media"><Image src={service.image || "/images/public-site/concierge/home-preparation-premium.webp"} fill sizes="(max-width: 760px) 100vw, 50vw" alt={service.title} /><span>{service.number}</span><small>{service.category}</small></div>
    <div className="catalog-card-content">
      <div className="catalog-card-heading"><h3>{service.title}</h3><ArrowUpRight aria-hidden="true" /></div>
      <p className="service-card-summary">{service.short}</p>
      <small className="catalog-card-link">Voir le détail <ArrowRight size={15} /></small>
    </div>
  </Link></ItalianContent>;
}

export function ExperienceCard({ experience }: { experience: Experience }) {
  return <ItalianContent><Link className="catalog-card experience-commerce-card" href={`/esperienze/${experience.slug}`} aria-label={`Découvrir : ${experience.title}`}>
    <div className="catalog-card-media"><Image src={experience.image} fill sizes="(max-width: 760px) 100vw, 50vw" alt={experience.title} /><span>{experience.number}</span><small>{experience.format}</small></div>
    <div className="catalog-card-content">
      <div className="catalog-card-heading"><h3>{experience.cardTitle ?? experience.title}</h3><ArrowUpRight aria-hidden="true" /></div>
      <p className="service-card-summary">{experience.short}</p>
      <small className="catalog-card-link">Voir le détail <ArrowRight size={15} /></small>
    </div>
  </Link></ItalianContent>;
}

export function ExperienceCategoryCard({ category }: { category: ExperienceCategory }) {
  return <ItalianContent><Link className="experience-category-card" href={`/esperienze/${category.slug}`} aria-label={category.title}>
    <div className="experience-category-card-media">
      <Image src={category.image} fill sizes="(max-width: 760px) 100vw, 50vw" alt={category.title} />
      <div className="experience-category-card-meta"><span>{category.number}</span><small>{category.format}</small></div>
    </div>
    <div className="experience-category-card-copy">
      <div className="experience-category-card-heading"><h3>{category.title}</h3><ArrowUpRight aria-hidden="true" /></div>
      <p>{category.short}</p>
      <span className="experience-category-card-link">Voir le détail <ArrowRight size={15} /></span>
    </div>
  </Link></ItalianContent>;
}
export function PropertyCard({property}:{property:Property}){return <ItalianContent><Link className="property-card property-editorial-card" href={`/proprieta/${property.slug}`} aria-label={`Découvrir ${property.name}`}>
  <div className={`property-image tone-${property.tone}`} style={{backgroundImage:`linear-gradient(180deg,rgba(7,16,25,.03),rgba(7,16,25,.66)),url(${property.image})`}}>
    <span className="property-card-location">{property.location}</span><span className="property-card-open" aria-hidden="true"><ArrowUpRight /></span>
  </div>
  <div className="property-card-copy">
    <p className="property-card-type">{property.propertyType || "Bien AUREVIA"}</p>
    <h3>{property.name}</h3>
    {property.shortDescription && <p className="property-card-description">{property.shortDescription}</p>}
    <div className="property-card-footer"><div className="facts"><span>{property.bedrooms} {property.bedrooms > 1 ? "chambres" : "chambre"}</span><span>{property.guests} voyageurs</span><span>{property.baths} {property.baths > 1 ? "salles de bain" : "salle de bain"}</span></div><small>Découvrir le bien</small></div>
  </div>
</Link></ItalianContent>}
