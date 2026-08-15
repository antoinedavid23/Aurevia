import Link from "next/link";
import { ArrowRight, Check, FileText, KeyRound, LineChart, ShieldCheck } from "lucide-react";
import { PageHero, CTA } from "@/components/PageHero";
import type { Metadata } from "next";
import { OwnerClarityJourney } from "@/components/InteractiveSections";

export const metadata: Metadata = {
  title: "Accompagnement des propriétaires à Genova",
  description: "Un interlocuteur local pour gérer les réservations, les voyageurs, les prestataires et le suivi du bien.",
  alternates: { canonical: "/proprietari" },
};

const managementPhases = [
  { number: "01", label: "Cadrage", title: "Comprendre le bien et ce que vous souhaitez déléguer", text: "Avant le démarrage, nous étudions les usages, les accès, le calendrier, les équipements et vos périodes d’occupation.", image: "/images/owners/preparation-aurevia.webp", items: ["Visite du bien", "Niveau de délégation", "Règles de validation", "Priorités d’amélioration"] },
  { number: "02", label: "Mise en place", title: "Installer un fonctionnement simple pour tous", text: "Les supports voyageurs, les partenaires, les accès et les procédures sont préparés avant la première réservation.", image: "/images/owners/controle-inventaire-aurevia.webp", items: ["Calendrier centralisé", "Checklist du logement", "Organisation ménage et linge", "Contacts et procédures"] },
  { number: "03", label: "Pilotage", title: "Suivre le quotidien sans vous surcharger", text: "Velyo coordonne les réservations, les incidents, les interventions et les points de performance puis vous transmet l’essentiel.", image: "/images/owners/reporting-aurevia.webp", items: ["Suivi des réservations", "Coordination locale", "Compte rendu propriétaire", "Ajustements documentés"] },
];

export default function Page() {
  return <>
    <PageHero label="Pour les propriétaires" title="Vous gardez la visibilité. Nous gérons le quotidien." text="Velyo coordonne les voyageurs, les prestataires, les réservations et les imprévus depuis un interlocuteur local." image="/images/owners/property-care.webp" />
    <section className="section ivory owner-intro"><div className="container"><div className="owner-intro-grid"><div><p className="eyebrow dark">Une gestion lisible</p><h2>Moins de contraintes. Plus de maîtrise.</h2></div><div><p>Vous conservez les décisions qui comptent. Nous prenons en charge l’exécution quotidienne avec un cadre défini ensemble.</p><Link className="text-link" href="/valutazione">Étudier mon bien <ArrowRight size={16} /></Link></div></div><div className="owner-pillars"><div><KeyRound /><span>Un interlocuteur unique</span><p>Pour coordonner voyageurs, prestataires et imprévus.</p></div><div><LineChart /><span>Une stratégie compréhensible</span><p>Pour ajuster tarifs et calendrier sans boîte noire.</p></div><div><ShieldCheck /><span>Un bien suivi</span><p>Pour contrôler la préparation et documenter les écarts.</p></div><div><FileText /><span>Des comptes rendus utiles</span><p>Pour savoir ce qui a été fait et ce qui demande votre accord.</p></div></div></div></section>
    <section className="section owner-comparison"><div className="container"><p className="eyebrow">Ce qui change pour vous</p><h2>Le bien ne dicte plus votre quotidien.</h2><p className="owner-comparison-intro">Vous gardez les décisions importantes. Velyo absorbe l’organisation courante.</p><div className="comparison owner-comparison-grid"><div><span>Lorsque vous gérez seul</span><h3>Vous restez disponible pour chaque détail.</h3><ul><li>Messages voyageurs à surveiller</li><li>Plusieurs prestataires à relancer</li><li>Décisions rapides avec peu d’informations</li><li>Imprévus qui interrompent la journée</li><li>Historique dispersé entre plusieurs canaux</li></ul><strong>Le bien devient une responsabilité permanente.</strong></div><div><span>Avec Velyo</span><h3>Un interlocuteur connaît le bien et porte chaque sujet.</h3><ul><li>Les demandes passent par Velyo</li><li>Les prestataires sont coordonnés</li><li>Les options sont présentées clairement</li><li>Les écarts sont documentés</li><li>Le suivi est regroupé</li></ul><strong>Vous gardez la maîtrise sans porter tout le quotidien.</strong></div></div></div></section>
    <section className="section ivory owner-management"><div className="container"><div className="owner-management-heading"><p className="eyebrow dark">Ce que nous gérons</p><h2>De la première visite au point propriétaire.</h2><p>Trois temps structurent l’accompagnement, avec des contrôles et des responsabilités identifiées.</p></div><div className="owner-phases">{managementPhases.map((phase) => <article key={phase.number} className="owner-phase"><div className="owner-phase-image" style={{ backgroundImage: `url(${phase.image})` }} role="img" aria-label={phase.title} /><div className="owner-phase-content"><span>{phase.number} · {phase.label}</span><h3>{phase.title}</h3><p>{phase.text}</p><ul>{phase.items.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div></article>)}</div></div></section>
    <section className="owner-transparency"><div className="container"><OwnerClarityJourney /></div></section>
    <CTA />
  </>;
}
