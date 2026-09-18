import { notFound, redirect } from "next/navigation";
import { ArrowDown, Check } from "lucide-react";
import Image from "@/components/public-site/SiteImage";
import { PageHero } from "@/components/public-site/PageHero";
import { ServiceJourney, type ServiceJourneyStep } from "@/components/public-site/ServiceJourney";
import { experienceCategories, experienceCategoryAliases } from "@/data/public-site/experience-categories";
import { pageMetadata } from "@/lib/public-site/site-metadata";
import type { Metadata } from "next";
import { ItalianContent } from "@/components/public-site/ItalianContent";
import { siteUrl } from "@/lib/public-site/site-metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = experienceCategoryAliases[slug] ?? slug;
  const category = experienceCategories.find((item) => item.slug === canonicalSlug);
  return category ? pageMetadata({ title: category.title, description: category.short, path: `/esperienze/${canonicalSlug}`, image: category.image }) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const canonicalSlug = experienceCategoryAliases[slug] ?? slug;
  if (canonicalSlug !== slug) redirect(`/esperienze/${canonicalSlug}`);
  const category = experienceCategories.find((item) => item.slug === canonicalSlug);
  if (!category) notFound();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${siteUrl}/esperienze/${canonicalSlug}#service`,
        name: category.title,
        description: category.short,
        url: `${siteUrl}/esperienze/${canonicalSlug}`,
        areaServed: { "@type": "City", name: "Genova" },
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: "Servizio aggiuntivo per gli ospiti",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Servizi ospiti", item: `${siteUrl}/esperienze` },
          { "@type": "ListItem", position: 3, name: category.title, item: `${siteUrl}/esperienze/${canonicalSlug}` },
        ],
      },
    ],
  };

  const steps: ServiceJourneyStep[] = [
    { title: "Proposer l’option", timing: "01 · Le bon moment", text: "AUREVIA présente le service lorsqu’un besoin réel apparaît dans les échanges avec le voyageur ou dans la préparation du séjour. L’option reste distincte de la réservation et n’est jamais poussée sans contexte.", result: "Une proposition utile, formulée au moment où elle apporte réellement de la valeur.", points: ["Moment adapté", "Besoin réel", "Option distincte du séjour"] },
    { title: "Préciser la demande", timing: "02 · Le besoin", text: "Nous reformulons la demande puis vérifions les préférences, le nombre de personnes, les contraintes, les horaires et le budget. Cette étape évite les devis génériques et les mauvaises surprises.", result: "Un besoin complet que le prestataire peut chiffrer et confirmer sans ambiguïté.", points: ["Préférences recueillies", "Contraintes vérifiées", "Budget précisé"] },
    { title: "Construire l’offre", timing: "03 · La proposition", text: "Nous sélectionnons une solution cohérente et réunissons le contenu, le prestataire, le créneau, le prix et les conditions. Le voyageur reçoit une proposition comparable à sa demande, pas un simple intitulé de service.", result: "Une offre lisible avec un contenu, une disponibilité et un prix réellement confirmés.", points: ["Contenu détaillé", "Disponibilité réelle", "Prix annoncé"] },
    { title: "Obtenir l’accord", timing: "04 · La validation", text: "Le voyageur voit ce qui est inclus, ce qui reste à sa charge et les éventuelles conditions d’annulation avant de décider. Aucune dépense ni réservation n’est engagée sans son accord explicite.", result: "Un choix libre et traçable, séparé du prix de l’hébergement.", points: ["Choix libre", "Conditions acceptées", "Paiement séparé"] },
    { title: "Coordonner le service", timing: "05 · La réalisation", text: "AUREVIA reconfirme le prestataire, transmet les informations utiles et reste le point de contact jusqu’à la fin de la prestation. En cas de changement, nous reprenons immédiatement la coordination.", result: "Un service suivi de la confirmation jusqu’à sa réalisation effective.", points: ["Prestataire reconfirmé", "Informations centralisées", "Suivi jusqu’au bout"] },
  ];

  const aureviaCoordination = [
    "Demande du voyageur reformulée et vérifiée",
    "Prestataire adapté recherché ou sélectionné",
    "Disponibilité et faisabilité confirmées",
    "Prix et conditions présentés avant accord",
    "Réservation et informations centralisées",
    "Suivi assuré jusqu’à la réalisation",
  ];

  return <ItalianContent>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <PageHero label={category.format} title={category.title} text={category.short} image={category.image} />

    <section className="detail-page-opening service-detail-opening option-detail-opening"><div className="container service-opening-shell">
      <div className="service-opening-heading">
        <p className="section-watermark" aria-hidden="true">{category.watermark}</p>
        <div className="detail-opening-copy"><p className="eyebrow">L’offre côté propriétaire</p><h2>{category.headline}<br/><em>{category.accent}</em></h2></div>
        <div className="service-opening-lead"><span>La promesse AUREVIA</span><p>{category.short}</p></div>
      </div>
      <div className="service-proof-stage" id="benefices-proprietaire">
        <div className="service-proof-image"><Image src={category.image} fill sizes="(max-width: 900px) 100vw, 66vw" alt={category.title}/><div className="service-proof-caption"><span>Sur place à Genova</span><strong>AUREVIA fait avancer chaque détail.</strong></div></div>
        <div className="detail-impact-strip service-proof-cards">
          <article><span>01</span><div><small>Ce que vous gagnez</small><strong>{category.ownerValue}</strong></div></article>
          <article><span>02</span><div><small>Ce que vous gagnez</small><strong>Proposé{" "}{category.moment.toLowerCase()}</strong></div></article>
          <article><span>03</span><div><small>Ce que vous gagnez</small><strong>Prix confirmé avant tout engagement</strong></div></article>
        </div>
      </div>
    </div></section>

    <section className="detail-process-section"><div className="container detail-process-heading">
      <div className="detail-process-title"><p className="eyebrow">Comment AUREVIA le propose</p><h2>Un besoin exprimé.<br/><em>Une solution au bon prix.</em></h2></div>
      <div className="detail-process-intro"><span aria-hidden="true">01—05</span><p>L’option n’est jamais ajoutée automatiquement. AUREVIA la présente au bon moment, précise le contenu, obtient l’accord puis coordonne la réalisation.</p></div>
    </div><ServiceJourney steps={steps} label="Étapes de commercialisation" /></section>

    <section className="detail-scope-section option-possibilities-section" id="possibilites-gerees"><div className="container detail-scope-grid">
      <div><p className="eyebrow">Toutes les prestations de cette catégorie</p><h2>Un besoin courant.<br/><em>Plusieurs réponses raisonnables.</em></h2><p className="detail-section-intro">AUREVIA sélectionne d’abord la solution la plus simple qui répond réellement au besoin. Le contenu, la disponibilité et le prix total sont vérifiés avant toute proposition.</p><div className="option-possibilities-budget"><span>Pensé pour un budget de vacances réel</span><p>{category.budget}{" "}AUREVIA confirme toujours le prix total avant réservation.</p></div><div className="detail-scope-list service-scope-list">{category.possibilities.map((item, index) => <article key={item.title} tabIndex={0}><span>{String(index + 1).padStart(2, "0")}</span><div><p>{item.title}</p><small>{item.text}</small></div><i aria-hidden="true">+</i></article>)}</div></div>
      <aside className="detail-value-panel"><p className="eyebrow">Ce que AUREVIA prend en charge</p><h3>Une seule coordination, de la demande au service terminé.</h3><ul>{aureviaCoordination.map((item) => <li key={item}><Check size={16}/>{item}</li>)}</ul></aside>
    </div></section>

    <section className="detail-clarity-section service-clarity-conclusion option-clarity-conclusion" id="conclusion-option"><div className="container service-conclusion-grid">
      <div className="service-conclusion-copy"><span className="service-conclusion-watermark" aria-hidden="true">PROPOSITION</span><p className="eyebrow">Une proposition lisible</p><h2>Tout est clair.<br/><em>Vous pouvez décider.</em></h2><p>Le prix des nuits et le service additionnel restent séparés. Le voyageur choisit librement, tandis que AUREVIA porte toute l’organisation.</p><div className="service-conclusion-promise"><span>Pour votre bien</span><p><strong>Une valeur partagée avec vous</strong>.{" "}{category.ownerValue}</p></div></div>
      <div className="service-price-card">
        <div className="service-price-card-head"><span>Votre proposition AUREVIA</span><small>Sur mesure</small></div>
        <div className="service-price-card-main"><p>Un cadre commercial lisible</p><strong>Une valeur ajoutée,<br/><em>jamais une promesse floue.</em></strong><p>{category.commercial}</p></div>
        <div className="service-commercial-rules"><article><span>01</span><div><small>Promesse voyageur</small><strong>{category.short}</strong></div></article><article><span>02</span><div><small>Conditions de vente</small><strong>{category.commercial}</strong></div></article><article><span>03</span><div><small>Valeur partagée</small><strong>Lorsque l’option génère un bénéfice net, 25 % vous sont reversés avec une lecture claire du prix et du coût prestataire.</strong></div></article><article><span>04</span><div><small>Pour votre bien</small><strong>{category.ownerValue}</strong></div></article></div>
        <div className="service-price-next"><span>La prochaine étape</span><strong>Présenter votre bien à AUREVIA</strong><ArrowDown size={18}/></div>
      </div>
    </div></section>

  </ItalianContent>;
}
