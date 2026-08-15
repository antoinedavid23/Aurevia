import { notFound } from "next/navigation";
import { PageHero, CTA } from "@/components/PageHero";
import { ServiceJourney, type ServiceJourneyStep } from "@/components/ServiceJourney";
import { experiences } from "@/data/content";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const experience = experiences.find((item) => item.slug === slug);
  return experience ? { title: experience.title, description: experience.short, alternates: { canonical: `/esperienze/${slug}` } } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const experience = experiences.find((item) => item.slug === slug);
  if (!experience) notFound();
  const steps: ServiceJourneyStep[] = [
    { title: "Adapter au séjour", timing: "Avant l’arrivée", text: "Nous tenons compte du quartier, du groupe, de la mobilité et du temps réellement disponible.", points: ["Profil des voyageurs", "Durée disponible", "Contraintes pratiques"] },
    { title: "Préparer les repères", timing: "Sélection", text: "Un petit nombre d’options cohérentes est retenu, avec les horaires, accès et informations utiles.", points: ["Itinéraire réaliste", "Accès expliqués", "Plan B possible"] },
    { title: "Vérifier", timing: "Avant confirmation", text: "Les horaires, tarifs ou disponibilités des partenaires sont contrôlés lorsqu’une réservation est nécessaire.", points: ["Conditions vérifiées", "Tarifs annoncés", "Réservation confirmée"] },
    { title: "Transmettre simplement", timing: "Pendant le séjour", text: "Le voyageur reçoit une information courte et actionnable, sans devoir trier une longue liste de recommandations.", points: ["Message clair", "Contacts utiles", "Assistance Velyo"] },
  ];
  return <>
    <PageHero label="Expérience à Genova" title={experience.title} text={experience.short} image={experience.image} />
    <section className="section ivory"><div className="container service-detail-intro"><div><p className="eyebrow dark">Le principe</p><h2>Une idée facile à intégrer au séjour.</h2></div><div><p className="service-lead">{experience.short}</p><p>Velyo prépare les repères utiles et peut coordonner les réservations lorsque l’expérience le nécessite.</p></div><div className="service-at-glance">{experience.details.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></article>)}</div></div></section>
    <section className="content-section service-journey-section"><div className="container"><div className="service-section-heading"><p className="eyebrow">Préparation</p><h2>Du conseil général à un parcours réellement utile.</h2><p>Le bon niveau d’information dépend du logement, du quartier et des voyageurs.</p></div><ServiceJourney steps={steps} /></div></section>
    <section className="section"><div className="container"><p className="eyebrow">Le dispositif</p><h2>Ce que Velyo peut préparer</h2><div className="detail-list-grid">{[...experience.details, "Vérification des horaires", "Accès et transport", "Alternative en cas de météo défavorable", "Message prêt à envoyer aux voyageurs"].map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></article>)}</div></div></section>
    <section className="section ivory"><div className="container transparency-grid"><div><p className="eyebrow dark">Avant confirmation</p><h2>Les conditions réelles restent prioritaires.</h2><ul><li>Disponibilités vérifiées lorsque nécessaire</li><li>Tarifs annoncés avant réservation</li><li>Aucun engagement sans confirmation</li><li>Coordination selon les horaires du partenaire</li></ul></div><div className="transparency-card"><p className="eyebrow dark">Pour le propriétaire</p><h3>Une expérience qui complète l’accueil sans compliquer la gestion.</h3><p>Les recommandations peuvent être intégrées au livret d’accueil et adaptées au positionnement du logement.</p></div></div></section>
    <CTA />
  </>;
}
