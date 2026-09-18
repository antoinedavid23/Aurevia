import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/public-site/PageHero";
import { ServiceCard } from "@/components/public-site/Cards";
import { services } from "@/data/public-site/content";
import type { Metadata } from "next";
import { ItalianContent } from "@/components/public-site/ItalianContent";
import { pageMetadata } from "@/lib/public-site/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Servizi di gestione a Genova",
  description: "Découvrez la gestion complète AUREVIA à Genova : annonce, tarification, réservations, accueil, ménage, maintenance, sécurité et reporting propriétaire.",
  path: "/servizi",
});

const offers = [
  {
    number: "01",
    label: "Pour un logement",
    title: "Gestion complète",
    rate: "25 % TTC",
    rateNote: "des revenus locatifs effectivement encaissés, TVA comprise",
    promise: "Une gestion pensée pour les propriétaires qui veulent déléguer l’exploitation sans perdre la visibilité sur leur bien.",
    groups: [
      { title: "Lancement inclus", items: ["Audit du bien et de son positionnement", "Création ou optimisation de l’annonce", "Plan tarifaire de lancement", "Conseils de présentation et d’équipement", "Livret d’accueil numérique personnalisé", "Recommandations pour les photos"] },
      { title: "Gestion quotidienne incluse", items: ["Réservations et calendrier suivis", "Communication voyageurs 7j/7", "Tarifs et durée des séjours ajustés", "Arrivées et départs organisés", "Ménage et linge coordonnés", "Incidents suivis jusqu’à leur résolution", "Performances analysées et compte rendu"] },
    ],
    traveler: "Chez AUREVIA, nous pensons qu’une valeur créée autour de votre bien doit aussi vous revenir. Lorsqu’un voyageur choisit une option que nous avons sélectionnée et coordonnée, 25 % du bénéfice net vous est reversé. Ce fonctionnement nous paraît simplement plus juste : le prix, le coût du prestataire et la répartition restent toujours visibles.",
    separate: "Ménage, linge, consommables et interventions techniques sont détaillés et facturés séparément, selon le coût réel communiqué.",
    cta: "Confier mon bien",
    href: "/valutazione",
  },
  {
    number: "02",
    label: "Pour plusieurs biens ou un besoin particulier",
    title: "Gestion sur mesure",
    rate: "Sur devis",
    rateNote: "un cadre adapté à votre organisation",
    promise: "Un cadre construit bien par bien pour centraliser plusieurs locations, adapter le reporting et coordonner les services voyageurs.",
    groups: [
      { title: "Gestion multi-biens", items: ["Tous les services de la gestion complète", "Mise en place adaptée à chaque bien", "Conditions contractuelles multi-biens", "Pilotage centralisé du portefeuille"] },
      { title: "Organisation personnalisée", items: ["Services additionnels intégrés à la réservation", "Expériences voyageurs sélectionnées", "Organisation opérationnelle sur mesure", "Reporting consolidé"] },
    ],
    traveler: "La proposition précise, bien par bien, le niveau de présence, les services inclus, les validations nécessaires et les conditions de rémunération.",
    separate: "Les dépenses opérationnelles et les prestations externes restent détaillées séparément dans la proposition.",
    cta: "Présenter mon portefeuille",
    href: "/valutazione",
  },
];

export default function Page() {
  return <ItalianContent>
    <PageHero label="L’expertise au service de votre bien" title="Gestion complète" text="De la commercialisation au compte rendu propriétaire, AUREVIA réunit tout ce qu’une location courte durée exige à Genova." image="/images/public-site/aurevia-services/catalogue-hero.webp" />

    <section className="section service-catalog-section"><div className="container">
      <div className="catalog-intro catalog-intro-editorial watermark-heading watermark-heading--catalog">
        <p className="eyebrow section-watermark" aria-hidden="true">GESTION LOCATIVE</p>
        <div><p className="eyebrow">Huit expertises, une méthode</p><h2>Tout ce que la location exige.<br /><em>Sans tout porter vous-même.</em></h2></div>
        <div className="catalog-intro-note"><span>Un responsable pour l’ensemble du bien</span><p>Chaque service montre ce que AUREVIA exécute, comment le résultat est contrôlé et ce que le propriétaire n’a plus à coordonner.</p></div>
      </div>
      <div className="service-catalog-grid">{services.map((service) => <ServiceCard key={service.slug} service={service} />)}</div>
    </div></section>

    <section className="section management-offers-section" id="offres"><div className="container">
      <div className="management-offers-heading"><div className="watermark-heading watermark-heading--offset-right"><p className="eyebrow section-watermark" aria-hidden="true">PROPOSITION</p><p className="eyebrow">Un cadre clair avant de commencer</p><h2><span>Deux formats.</span><em>La même exigence de clarté.</em></h2></div><p>La gestion complète couvre l’exploitation d’un bien de bout en bout. Le sur-mesure adapte la méthode à plusieurs biens ou à une organisation particulière.</p></div>
      <div className="management-offers">{offers.map((offer) => <article className="management-offer" key={offer.number}>
        <div className="management-offer-top"><span>{offer.number}</span><small>{offer.label}</small></div>
        <h3>{offer.title}</h3>
        <div className="management-offer-rate"><strong>{offer.rate}</strong><small>{offer.rateNote}</small></div>
        <p>{offer.promise}</p>
        <div className="management-offer-groups">{offer.groups.map((group) => <div className="management-offer-group" key={group.title}>
          <h4>{group.title}</h4>
          <ul>{group.items.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
        </div>)}</div>
        <div className="management-offer-traveler"><span>{offer.number === "01" ? "Une valeur partagée, simplement" : "Cadre personnalisé"}</span><p>{offer.traveler}</p></div>
        <div className="management-offer-separate"><span>Facturation séparée</span><p>{offer.separate}</p></div>
        <div className="management-offer-footer"><Link className="button management-offer-cta" href={offer.href}>{offer.cta} <ArrowRight size={17} /></Link></div>
      </article>)}</div>
    </div></section>

  </ItalianContent>;
}
