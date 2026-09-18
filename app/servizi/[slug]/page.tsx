import { notFound } from "next/navigation";
import { ArrowDown, Check } from "lucide-react";
import Image from "@/components/public-site/SiteImage";
import { PageHero } from "@/components/public-site/PageHero";
import { ServiceJourney, type ServiceJourneyStep } from "@/components/public-site/ServiceJourney";
import { services } from "@/data/public-site/content";
import { pageMetadata } from "@/lib/public-site/site-metadata";
import type { Metadata } from "next";
import { ItalianContent } from "@/components/public-site/ItalianContent";
import { siteUrl } from "@/lib/public-site/site-metadata";

type ServiceDetail = {
  headline: string;
  accent: string;
  watermark: string;
  visual: string;
  included: string[];
  owner: string[];
  notIncluded: string[];
};

const detailMap: Record<string, ServiceDetail> = {
  "gestione-proprieta": { headline: "Un seul interlocuteur", accent: "pour tout votre bien.", watermark: "GESTION", visual: "/images/public-site/aurevia-services/gestion-proof.webp", included: ["Visite et prise en main du bien", "Calendrier et consignes réunis", "Réservations suivies", "Arrivées et départs coordonnés", "Prestataires organisés", "Nouvelles régulières au propriétaire"], owner: ["Un interlocuteur pour tout le bien", "Demandes et prestataires coordonnés", "Votre accord seulement quand il compte"], notIncluded: ["Ménage, linge et consommables facturés séparément", "Travaux engagés uniquement après validation selon le montant convenu"] },
  concierge: { headline: "Vos voyageurs accompagnés.", accent: "Vous, enfin libéré.", watermark: "CONCIERGERIE", visual: "/images/public-site/aurevia-services/conciergerie-proof.webp", included: ["Réponses sur le fonctionnement du bien", "Conseils adaptés au quartier", "Aide avec les équipements", "Informations sur les transports", "Prise en charge des imprévus", "Suivi jusqu’à la résolution"], owner: ["Les voyageurs savent qui appeler", "Les questions courantes ne vous reviennent plus", "Chaque imprévu est suivi jusqu’à sa résolution"], notIncluded: ["Achats, billets et réservations payés directement par le voyageur", "Pas de transport privé ni de restauration à domicile"] },
  "accoglienza-voyageurs": { headline: "Chaque arrivée rassure.", accent: "Chaque séjour commence bien.", watermark: "ACCUEIL", visual: "/images/public-site/aurevia-services/accueil-proof.webp", included: ["Message envoyé avant l’arrivée", "Accès et clés expliqués", "Bien contrôlé avant l’arrivée", "Accueil sur place ou à distance", "Équipements essentiels présentés", "Aide pendant l’installation"], owner: ["Les accès sont expliqués avant l’arrivée", "Les voyageurs s’installent sans vous appeler", "Une personne reste disponible au démarrage"], notIncluded: ["Transport et bagagerie non inclus", "Arrivées tardives organisées selon les conditions convenues"] },
  "pulizie-biancheria": { headline: "Un bien impeccable.", accent: "Prêt avant chaque arrivée.", watermark: "ENTRETIEN", visual: "/images/public-site/aurevia-services/entretien-proof.webp", included: ["Liste de contrôle pièce par pièce", "Ménage planifié entre les séjours", "Linge propre coordonné", "Résultat vérifié après le ménage", "Consommables complétés selon l’inventaire", "Anomalies signalées au propriétaire"], owner: ["Le ménage suit une liste de contrôle", "Linge et consommables sont vérifiés", "Le bien est contrôlé avant l’arrivée"], notIncluded: ["Ménage, linge et consommables facturés séparément", "Nettoyages spécifiques proposés selon le besoin"] },
  manutenzione: { headline: "Chaque imprévu devient", accent: "une action suivie.", watermark: "MAINTENANCE", visual: "/images/public-site/aurevia-services/maintenance-proof.webp", included: ["Problème identifié", "Artisan adapté recherché", "Devis soumis avant engagement", "Accès au bien organisé", "Intervention suivie sur place", "Compte rendu et justificatifs transmis"], owner: ["Le problème est qualifié avant toute dépense", "Vous validez le devis si nécessaire", "AUREVIA suit l’artisan jusqu’à la résolution"], notIncluded: ["Main-d’œuvre, pièces et matériaux facturés séparément", "Délais soumis à la disponibilité réelle des artisans"] },
  "revenue-management": { headline: "Louer au bon rythme.", accent: "Valoriser chaque période.", watermark: "PERFORMANCE", visual: "/images/public-site/aurevia-services/performance-proof.webp", included: ["Quartier et saison observés", "Tarifs adaptés aux périodes", "Durées minimales ajustées", "Réservations suivies", "Prix revus avec mesure", "Choix expliqués au propriétaire"], owner: ["Les tarifs suivent la saison", "Vos périodes restent prioritaires", "Chaque ajustement peut être expliqué"], notIncluded: ["Aucun revenu minimum garanti", "Toute projection reste indicative jusqu’à l’analyse du bien"] },
  sicurezza: { headline: "Votre bien reste visible.", accent: "Même à distance.", watermark: "SÉCURITÉ", visual: "/images/public-site/aurevia-services/securite-proof.webp", included: ["État initial du bien noté", "Clés et accès suivis", "Vérification après chaque séjour", "Écarts signalés", "Conduite à tenir en cas d’incident", "Équipements essentiels contrôlés"], owner: ["Les clés et les accès restent suivis", "Tout écart important vous est signalé", "La prochaine action est clairement identifiée"], notIncluded: ["AUREVIA ne remplace ni une assurance ni un service d’urgence", "Toute réparation payante est proposée avant engagement"] },
  amministrazione: { headline: "Tout le suivi réuni.", accent: "Rien d’important ne se perd.", watermark: "SUIVI", visual: "/images/public-site/aurevia-services/administration-proof.webp", included: ["Réservations regroupées", "Prestations enregistrées", "Justificatifs classés", "Activité résumée clairement", "Incidents conservés dans l’historique", "Décisions importantes retrouvables"], owner: ["Réservations, dépenses et interventions réunies", "Un point envoyé au rythme convenu", "L’historique reste facile à retrouver"], notIncluded: ["Conseil fiscal, comptable ou juridique non inclus", "Documents spécialisés à valider avec les professionnels concernés"] },
};

const scopeDetailMap: Record<string, string[]> = {
  "gestione-proprieta": [
    "Nous relevons les accès, les équipements, les habitudes du lieu et les priorités à respecter.",
    "Disponibilités, règles du bien et informations utiles sont réunies dans un cadre unique.",
    "Chaque confirmation, modification ou point de vigilance est suivi jusqu’au départ.",
    "Accès, préparation, arrivée et sortie sont coordonnés avec les personnes concernées.",
    "Le bon intervenant est contacté, briefé puis relancé jusqu’au résultat attendu.",
    "Vous recevez l’essentiel : ce qui a été fait, ce qui change et ce qui demande votre accord.",
  ],
  concierge: [
    "Un contact identifié répond aux questions pratiques sans vous solliciter à chaque demande.",
    "Les recommandations tiennent compte du quartier, du séjour et des attentes réelles.",
    "Le fonctionnement du logement est expliqué simplement, avec les bonnes consignes.",
    "Trajets, horaires et solutions locales sont vérifiés avant d’être communiqués.",
    "La situation est qualifiée rapidement puis orientée vers la personne capable d’agir.",
    "La demande reste suivie jusqu’à sa résolution, avec une information claire si nécessaire.",
  ],
  "accoglienza-voyageurs": [
    "Les informations essentielles sont envoyées au bon moment avant le déplacement.",
    "Le parcours d’entrée est expliqué pour éviter hésitations, attentes et appels tardifs.",
    "Propreté, accès et éléments indispensables sont vérifiés avant l’installation.",
    "Le format d’accueil est choisi selon le bien, l’horaire et les contraintes du séjour.",
    "Les équipements utiles sont présentés sans transformer l’arrivée en visite interminable.",
    "Une personne reste joignable pendant les premiers instants si un ajustement est nécessaire.",
  ],
  "pulizie-biancheria": [
    "Chaque pièce suit des points de contrôle définis avec le propriétaire.",
    "Le passage est calé entre deux réservations avec le temps réellement nécessaire.",
    "Les quantités, la rotation et la disponibilité du linge sont suivies avant l’arrivée.",
    "Le résultat est relu après le passage et les écarts sont repris ou signalés.",
    "Les essentiels convenus sont contrôlés pour éviter les manques au début du séjour.",
    "Toute casse, usure ou anomalie visible est documentée puis transmise avec la prochaine action.",
  ],
  manutenzione: [
    "Nous distinguons l’urgence, l’usage normal et le besoin de réparation avant d’engager une action.",
    "Le professionnel est choisi selon le problème, sa disponibilité et le niveau d’intervention requis.",
    "Le coût et le périmètre sont présentés avant toute dépense nécessitant votre validation.",
    "Clés, présence et consignes sont organisées pour que l’intervention puisse réellement avoir lieu.",
    "Nous suivons le rendez-vous, les éventuels retards et la bonne exécution sur place.",
    "Photos, justificatifs et résultat obtenu sont regroupés dans un retour facile à relire.",
  ],
  "revenue-management": [
    "Nous observons le quartier, les événements, la saison et la demande réellement disponible.",
    "Les prix évoluent par période, sans casser la cohérence ni la valeur du bien.",
    "Les durées minimales sont ajustées pour mieux remplir le calendrier sans le bloquer.",
    "Le rythme des demandes et les espaces disponibles sont relus régulièrement.",
    "Les changements restent mesurés et reliés à une raison commerciale compréhensible.",
    "Vous savez ce qui a été ajusté, pourquoi et quel effet est recherché.",
  ],
  sicurezza: [
    "Un état de référence permet de repérer plus facilement ce qui a réellement changé.",
    "La circulation des clés et les conditions d’accès restent connues et organisées.",
    "Les points sensibles sont regardés après le séjour avant la prochaine arrivée.",
    "Un écart important est photographié, qualifié puis communiqué sans attendre.",
    "La marche à suivre est préparée selon le niveau du problème et les personnes à contacter.",
    "Les éléments essentiels au bon usage du bien sont intégrés aux vérifications régulières.",
  ],
  amministrazione: [
    "Les séjours et leurs changements restent regroupés dans une chronologie cohérente.",
    "Chaque prestation est rattachée au bon séjour ou à la bonne intervention.",
    "Factures, reçus et éléments transmis restent accessibles sans recherche dispersée.",
    "Vous recevez une lecture synthétique de l’activité plutôt qu’une succession de messages.",
    "Les problèmes rencontrés et les réponses apportées restent consultables dans le temps.",
    "Les validations et choix importants peuvent être retrouvés lorsqu’une question revient.",
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return service ? pageMetadata({ title: service.title, description: service.short, path: `/servizi/${slug}`, image: service.image }) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const details = detailMap[slug] || detailMap["gestione-proprieta"];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${siteUrl}/servizi/${slug}#service`,
        name: service.title,
        description: service.short,
        url: `${siteUrl}/servizi/${slug}`,
        areaServed: { "@type": "City", name: "Genova" },
        provider: { "@id": `${siteUrl}/#organization` },
        serviceType: service.category,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Servizi", item: `${siteUrl}/servizi` },
          { "@type": "ListItem", position: 3, name: service.title, item: `${siteUrl}/servizi/${slug}` },
        ],
      },
    ],
  };
  const steps: ServiceJourneyStep[] = [
    { title: "Auditer le bien", timing: "01 · Découverte", text: "Nous parcourons le bien comme un voyageur et comme un gestionnaire : accès, équipements, contraintes, habitudes et points sensibles. Cette visite permet de comprendre son fonctionnement réel avant de promettre quoi que ce soit.", result: "Un diagnostic documenté et des priorités classées avant la proposition.", points: ["Accès et équipements vérifiés", "Habitudes du lieu notées", "Priorités du propriétaire recueillies"] },
    { title: "Cadrer le service", timing: "02 · Organisation", text: "Nous transformons le diagnostic en règles de fonctionnement : missions confiées, dépenses séparées, seuils d’accord, contacts et fréquence des nouvelles. Le cadre est adapté au bien et à votre niveau de délégation.", result: "Un périmètre écrit où chacun connaît son rôle et ses limites.", points: ["Périmètre écrit", "Budget et seuils définis", "Rythme des nouvelles choisi"] },
    { title: "Préparer l’exploitation", timing: "03 · Mise en place", text: "Accès, consignes, calendrier, contacts et intervenants sont réunis avant l’arrivée des premiers voyageurs. Nous testons le parcours afin que l’équipe sache agir sans improviser.", result: "Un bien prêt à être exploité avec des consignes partagées et vérifiables.", points: ["Intervenants coordonnés", "Consignes centralisées", "Premier séjour préparé"] },
    { title: "Piloter les séjours", timing: "04 · Au quotidien", text: "AUREVIA suit la réservation, prépare l’arrivée, répond aux voyageurs et coordonne les actions sur place jusqu’au contrôle de départ. Les demandes sont centralisées pour conserver une vue complète du séjour et du bien.", result: "Chaque séjour avance selon le même cadre, avec un responsable clairement identifié.", points: ["Voyageurs accompagnés", "Prestataires suivis", "Imprévus traités"] },
    { title: "Mesurer et ajuster", timing: "05 · Optimisation", text: "Nous relisons l’occupation, les revenus, les coûts, les incidents et les retours voyageurs. Ces données servent à corriger les tarifs, l’organisation et les points d’accueil qui freinent la performance.", result: "Des améliorations justifiées par les faits, et non par des intuitions isolées.", points: ["Activité relue", "Tarifs et processus ajustés", "Compte rendu utile"] },
  ];
  return <ItalianContent>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <PageHero label={service.category} title={service.title} text={service.short} image={service.image} />
    <section className="detail-page-opening service-detail-opening"><div className="container service-opening-shell">
      <div className="service-opening-heading">
        <p className="section-watermark" aria-hidden="true">{details.watermark}</p>
        <div className="detail-opening-copy"><p className="eyebrow">Ce que AUREVIA prend en charge</p><h2>{details.headline}<br /><em>{details.accent}</em></h2></div>
        <div className="service-opening-lead"><span>La promesse AUREVIA</span><p>{service.short}</p></div>
      </div>
      <div className="service-proof-stage" id="benefices-proprietaire">
        <div className="service-proof-image"><Image src={details.visual} fill sizes="(max-width: 900px) 100vw, 66vw" alt={`${service.title} coordonné par AUREVIA`} /><div className="service-proof-caption"><span>Sur place à Genova</span><strong>AUREVIA fait avancer chaque détail.</strong></div></div>
        <div className="detail-impact-strip service-proof-cards">{details.owner.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><div><small>Ce que vous gagnez</small><strong>{item}</strong></div></article>)}</div>
      </div>
    </div></section>
    <section className="detail-process-section"><div className="container detail-process-heading"><div className="detail-process-title"><p className="eyebrow">Notre méthode</p><h2>Du diagnostic<br/><em>à la performance.</em></h2></div><div className="detail-process-intro"><span aria-hidden="true">01—07</span><p>Sept étapes structurent la prise en charge : comprendre le bien, préparer sa mise en location, piloter les séjours, suivre les résultats et améliorer ce qui doit l’être.</p></div></div><ServiceJourney steps={steps} /></section>
    <section className="detail-scope-section" id="perimetre-service"><div className="container detail-scope-grid"><div><p className="eyebrow">Le périmètre concret</p><h2>Chaque action produit un résultat vérifiable.</h2><p className="detail-section-intro">Survolez chaque point pour voir concrètement comment AUREVIA le prend en charge.</p><div className="detail-scope-list service-scope-list">{details.included.map((item, index) => <article key={item} tabIndex={0}><span>{String(index + 1).padStart(2, "0")}</span><div><p>{item}</p><small>{scopeDetailMap[slug]?.[index] ?? "Le point est cadré, suivi puis restitué clairement au propriétaire."}</small></div><i aria-hidden="true">+</i></article>)}</div></div><aside className="detail-value-panel"><p className="eyebrow">Pour vous</p><h3>La gestion avance sans vous retirer les décisions.</h3><ul>{details.owner.map((item) => <li key={item}><Check size={16}/>{item}</li>)}</ul></aside></div></section>
    <section className="detail-clarity-section service-clarity-conclusion" id="conclusion-service"><div className="container service-conclusion-grid">
      <div className="service-conclusion-copy"><span className="service-conclusion-watermark" aria-hidden="true">PROPOSITION</span><p className="eyebrow">Une proposition lisible</p><h2>Tout est clair.<br/><em>Vous pouvez décider.</em></h2><p>AUREVIA sépare ses honoraires, les dépenses d’exploitation et les actions qui nécessitent votre accord. Aucun montant important n’apparaît sans explication.</p><div className="service-conclusion-promise"><span>Avant de commencer</span><p><strong>Une visite.</strong> Puis une proposition adaptée au bien, à son rythme et aux services réellement nécessaires.</p></div></div>
      <div className="service-price-card">
        <div className="service-price-card-head"><span>Votre proposition AUREVIA</span><small>Sur mesure</small></div>
        <div className="service-price-card-main"><p>Honoraires de gestion</p><strong>Un prix ajusté<br/><em>à votre bien.</em></strong><p>Le montant exact est présenté après la visite, avec un périmètre clair et les éventuels frais séparés.</p></div>
        <div className="service-commercial-rules"><article><span>01</span><div><small>Compris dans la gestion</small><strong>Organisation, coordination, suivi et compte rendu</strong></div></article><article><span>02</span><div><small>Facturé séparément</small><strong>{details.notIncluded[0]}</strong></div></article><article><span>03</span><div><small>Selon la situation</small><strong>{details.notIncluded[1]}</strong></div></article><article><span>04</span><div><small>Votre décision</small><strong>Vous validez toute dépense ou action importante.</strong></div></article></div>
        <div className="service-price-next"><span>La prochaine étape</span><strong>Présenter votre bien à AUREVIA</strong><ArrowDown size={18}/></div>
      </div>
    </div></section>
  </ItalianContent>;
}
