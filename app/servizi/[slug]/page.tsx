import { notFound } from "next/navigation";
import { Check, CircleDot, FileText, ShieldCheck } from "lucide-react";
import { CTA, PageHero } from "@/components/PageHero";
import { ServiceJourney, type ServiceJourneyStep } from "@/components/ServiceJourney";
import { services } from "@/data/content";
import type { Metadata } from "next";

const detailMap: Record<string, { challenge: string; included: string[]; owner: string[]; notIncluded: string[] }> = {
  "gestione-proprieta": { challenge: "À distance, le bien ne devrait pas devenir une succession de messages, de relances et d’imprévus à résoudre.", included: ["Visite initiale du logement", "Calendrier et règles centralisés", "Suivi des réservations", "Coordination des arrivées et départs", "Organisation des prestataires", "Compte rendu propriétaire"], owner: ["Une vision claire de l’activité", "Moins de décisions prises dans l’urgence", "Un interlocuteur pour tout coordonner"], notIncluded: ["Ménage, linge et consommables facturés séparément", "Travaux engagés après validation selon le cadre convenu"] },
  concierge: { challenge: "Une demande voyageur doit pouvoir être traitée sans déranger le propriétaire ni créer une chaîne de messages.", included: ["Qualification de la demande", "Recherche d’une option locale", "Présentation du tarif et des conditions", "Réservation après validation", "Coordination des horaires", "Suivi de la réalisation"], owner: ["Un seul point de contact", "Des conditions connues avant confirmation", "Une demande suivie jusqu’au bout"], notIncluded: ["Prestations des partenaires facturées séparément", "Services proposés selon disponibilité réelle"] },
  "accoglienza-voyageurs": { challenge: "L’arrivée doit être simple, claire et cohérente avec le fonctionnement du logement.", included: ["Messages avant séjour", "Instructions d’accès", "Contrôle avant arrivée", "Accueil sur place ou accompagné à distance", "Présentation des essentiels", "Assistance pendant l’installation"], owner: ["Des voyageurs mieux informés", "Moins d’appels directs", "Une arrivée suivie"], notIncluded: ["Transferts et bagagerie sur proposition", "Arrivées tardives selon les conditions convenues"] },
  "pulizie-biancheria": { challenge: "Le même standard doit être retrouvé entre chaque séjour, sans dépendre d’une consigne orale différente à chaque rotation.", included: ["Checklist par zone", "Planning des rotations", "Coordination du linge", "Contrôle après intervention", "Réassort selon inventaire", "Signalement des anomalies"], owner: ["Une préparation plus régulière", "Les écarts repérés rapidement", "Un logement prêt à recevoir"], notIncluded: ["Prestations facturées séparément", "Nettoyages spécifiques sur proposition"] },
  manutenzione: { challenge: "Un détail traité à temps évite souvent une urgence, une mauvaise expérience voyageur ou une dégradation plus coûteuse.", included: ["Qualification de l’anomalie", "Recherche de l’artisan adapté", "Devis présenté avant engagement", "Organisation de l’accès", "Suivi sur place", "Compte rendu avec justificatifs"], owner: ["Des options claires pour décider", "Un historique des interventions", "Des artisans coordonnés localement"], notIncluded: ["Main-d’œuvre, pièces et matériaux facturés séparément", "Disponibilité des artisans non garantie"] },
  "revenue-management": { challenge: "Le calendrier et les tarifs doivent évoluer avec la saison et la demande réelle, sans rendre la stratégie illisible.", included: ["Lecture du positionnement", "Tarifs selon les périodes", "Durées de séjour", "Suivi du rythme des réservations", "Ajustements réguliers", "Synthèse des performances"], owner: ["Une stratégie compréhensible", "Des décisions tarifaires expliquées", "Un potentiel suivi dans le temps"], notIncluded: ["Aucune promesse de revenu garanti", "Projections toujours indicatives"] },
  sicurezza: { challenge: "Protéger le bien commence par savoir qui y accède, ce qui a changé et comment agir lorsqu’un écart apparaît.", included: ["Inventaire de départ", "Suivi des clés et accès", "Vérification après séjour", "Signalement des écarts", "Procédure en cas d’incident", "Contrôle des équipements sensibles"], owner: ["Des accès mieux suivis", "Une information rapide", "Une réponse préparée"], notIncluded: ["Assurance et télésurveillance non comprises", "Équipements de sécurité sur proposition"] },
  amministrazione: { challenge: "Le propriétaire doit pouvoir comprendre la vie du bien sans rechercher l’information dans plusieurs conversations.", included: ["Réservations regroupées", "Prestations suivies", "Justificatifs classés", "Synthèse d’activité", "Historique des incidents", "Décisions conservées"], owner: ["L’essentiel accessible", "Un point régulier", "Une mémoire du bien"], notIncluded: ["Conseil fiscal, comptable ou juridique non compris", "Documents spécialisés à valider avec vos conseils"] },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return service ? { title: service.title, description: service.short, alternates: { canonical: `/servizi/${slug}` } } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const details = detailMap[slug] || detailMap["gestione-proprieta"];
  const steps: ServiceJourneyStep[] = [
    { title: "Comprendre le besoin", timing: "Premier échange", text: "Nous précisons le logement, les contraintes, les accès et ce que vous souhaitez réellement déléguer.", points: ["Situation actuelle", "Priorités", "Niveau de délégation"] },
    { title: "Définir le cadre", timing: "Proposition", text: "Responsabilités, validations, frais séparés et délais de réponse sont présentés dans une proposition lisible.", points: ["Périmètre documenté", "Seuils de validation", "Rythme du suivi"] },
    { title: "Mettre en place", timing: "Démarrage", text: "Les accès, contacts, supports et procédures sont installés avant le lancement du service.", points: ["Contacts réunis", "Procédures partagées", "Planning prêt"] },
    { title: "Suivre", timing: "En continu", text: "Velyo coordonne l’opérationnel, documente les décisions et vous informe sans multiplier les sollicitations.", points: ["Suivi local", "Gestion des écarts", "Compte rendu"] },
  ];
  return <>
    <PageHero label={service.title} title={service.cardTitle || service.title} text={service.short} image={service.image} />
    <section className="section ivory"><div className="container service-detail-intro"><div><p className="eyebrow dark">Le besoin</p><h2>{details.challenge}</h2></div><div><p className="service-lead">{service.short}</p><p>Le service est cadré avant le démarrage afin que chacun sache ce qui est pris en charge et quand une validation propriétaire est nécessaire.</p></div><div className="service-at-glance">{details.owner.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></article>)}</div></div></section>
    <section className="content-section service-journey-section"><div className="container"><div className="service-section-heading"><p className="eyebrow">Mise en place</p><h2>Un fonctionnement clair dès le départ.</h2><p>Les étapes restent identiques : comprendre, cadrer, installer et suivre.</p></div><ServiceJourney steps={steps} /></div></section>
    <section className="section"><div className="container service-detail-grid"><div><p className="eyebrow">Inclus</p><h2>Ce que Velyo coordonne.</h2><div className="detail-list-grid">{details.included.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></article>)}</div></div><aside className="service-quick-card"><ShieldCheck /><p className="eyebrow">Pour le propriétaire</p><ul>{details.owner.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></aside></div></section>
    <section className="section ivory"><div className="container transparency-grid"><div><p className="eyebrow dark">Transparence</p><h2>Ce qui reste séparé ou soumis à validation.</h2><ul>{details.notIncluded.map((item) => <li key={item}><CircleDot size={15} />{item}</li>)}</ul></div><div className="transparency-card"><FileText /><p className="eyebrow dark">Avant de commencer</p><h3>Une proposition récapitule le cadre.</h3><ul><li>Services retenus</li><li>Frais et prestations séparés</li><li>Seuils de validation</li><li>Délais et rythme d’information</li></ul></div></div></section>
    <CTA />
  </>;
}
