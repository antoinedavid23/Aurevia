import { PageHero } from "@/components/public-site/PageHero";
import { ExperienceCategoryCard } from "@/components/public-site/Cards";
import { experienceCategories } from "@/data/public-site/experience-categories";
import type { Metadata } from "next";
import { ItalianContent } from "@/components/public-site/ItalianContent";
import { pageMetadata } from "@/lib/public-site/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Servizi per ospiti a Genova",
  description: "AUREVIA riunisce a Genova servizi utili e accessibili per gli ospiti: spostamenti, benessere, scoperte, pasti, attenzioni e bisogni pratici.",
  path: "/esperienze",
});

const commerceSteps = [
  { number: "01", title: "Proposer au bon moment", text: "L’option est présentée avant l’arrivée ou pendant le séjour, uniquement lorsqu’elle répond à un besoin réel." },
  { number: "02", title: "Préciser la demande", text: "AUREVIA recueille le nombre de personnes, le créneau, les préférences, les contraintes et le budget utile." },
  { number: "03", title: "Présenter une offre claire", text: "Contenu, disponibilité, prix et conditions sont annoncés séparément avant tout accord du voyageur." },
  { number: "04", title: "Coordonner jusqu’au bout", text: "Après validation, AUREVIA réserve, transmet les informations et suit la prestation jusqu’à sa réalisation." },
];

const ownerAdvantages = [
  { number: "01", title: "Une option, pas une promesse floue", text: "Le voyageur sait précisément ce qu’il achète, à quel prix et sous quelles conditions.", note: "Présentation transparente" },
  { number: "02", title: "Aucune organisation à reprendre", text: "AUREVIA sélectionne le prestataire, confirme la disponibilité et reste le point de contact.", note: "Coordination AUREVIA" },
  { number: "03", title: "Une dépense séparée du séjour", text: "La prestation additionnelle reste distincte du prix des nuits et n’alourdit pas l’offre principale.", note: "Facturation lisible" },
  { number: "04", title: "Une valeur partagée avec vous", text: "Lorsqu’une option coordonnée par AUREVIA génère un bénéfice net, 25 % vous sont reversés.", note: "Bénéfice net visible" },
];

export default function Page() {
  return <ItalianContent>
    <PageHero label="Des services utiles" title="Services voyageurs" text="AUREVIA aide les voyageurs à réserver le bon transport, la bonne activité ou le petit service pratique, sans leur imposer une dépense disproportionnée." image="/images/public-site/concierge/old-town-family-premium.webp" />

    <section className="section experience-catalog-section"><div className="container">
      <div className="catalog-intro catalog-intro-editorial watermark-heading watermark-heading--catalog">
        <p className="eyebrow section-watermark" aria-hidden="true">Options voyageurs</p>
        <div><p className="eyebrow">Pensé pour un budget de vacances</p><h2>Six besoins courants.<br /><em>Des solutions vraiment utiles.</em></h2></div>
        <div className="catalog-intro-note"><span>Pour un séjour à 80–120 € la nuit</span><p>Un couple consacre déjà son budget au logement, aux repas et aux visites. AUREVIA privilégie donc les options ponctuelles, accessibles et suffisamment utiles pour mériter leur prix.</p></div>
      </div>
      <div className="experience-category-grid" id="services-voyageurs">{experienceCategories.map((category) => <ExperienceCategoryCard key={category.slug} category={category} />)}</div>
    </div></section>

    <section className="traveler-commerce-section"><div className="container">
      <div className="traveler-commerce-heading section-heading-art section-heading-art--dark"><span className="section-heading-watermark" aria-hidden="true">PARCOURS</span><div><p className="eyebrow">Comment AUREVIA les propose</p><h2>Un besoin réel.<br/><em>Une dépense qui se justifie.</em></h2></div><p>AUREVIA ne pousse pas une prestation parce qu’elle semble haut de gamme. L’option apparaît lorsqu’elle évite une contrainte, fait gagner du temps ou améliore réellement le séjour.</p></div>
      <ol className="traveler-commerce-steps">{commerceSteps.map((step) => <li key={step.number}><span>{step.number}</span><strong>{step.title}</strong><p>{step.text}</p></li>)}</ol>
    </div></section>

    <section className="section traveler-extras-section"><div className="container">
      <div className="traveler-extras-heading section-heading-art section-heading-art--right"><span className="section-heading-watermark" aria-hidden="true">VALEUR AJOUTÉE</span><div><p className="eyebrow">Pour le propriétaire</p><h2>Plus de services,<br/>sans plus de gestion.</h2></div><p>Le service additionnel renforce l’expérience du séjour sans transformer votre bien en offre tout compris.</p></div>
      <div className="traveler-extras-grid">{ownerAdvantages.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><small>{item.note}</small></article>)}</div>
    </div></section>
  </ItalianContent>;
}
