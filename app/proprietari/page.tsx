import Link from "next/link";
import { ArrowRight, Check, FileText, KeyRound, LineChart, ShieldCheck } from "lucide-react";
import { PageHero, CTA } from "@/components/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestione immobiliare per proprietari",
  description: "Un interlocutore unico per valorizzare, proteggere e gestire la Sua proprietà a Genova e sulla Riviera Ligure, anche a distanza.",
  alternates: { canonical: "/proprietari" },
};
import { OwnerClarityJourney } from "@/components/InteractiveSections";

const managementPhases = [
  {
    number: "01",
    label: "Mise en valeur",
    title: "Préparer un bien qui inspire immédiatement confiance",
    text: "Avant toute mise en location, nous examinons le positionnement, les équipements et le parcours d’arrivée. La présentation est construite pour valoriser les qualités réelles du bien sans créer de promesse artificielle.",
    image: "/images/owners/preparation-aurevia.webp",
    items: ["Audit du bien et de son positionnement", "Conseils décoration et équipements", "Création ou optimisation de l’annonce", "Recommandations pour la séance photo"],
  },
  {
    number: "02",
    label: "Exécution",
    title: "Un niveau de préparation vérifié avant chaque séjour",
    text: "Ménage, linge, inventaire et consommables suivent un cadre précis. Les prestataires sont coordonnés, les points sensibles sont contrôlés et les anomalies sont signalées avant qu’elles ne deviennent un incident voyageur.",
    image: "/images/owners/controle-inventaire-aurevia.webp",
    items: ["Coordination du ménage et du linge", "Contrôle visuel après intervention", "Suivi des stocks et de l’inventaire", "Organisation des maintenances nécessaires"],
  },
  {
    number: "03",
    label: "Pilotage",
    title: "Chaque décision expliquée, chaque performance suivie",
    text: "La gestion ne s’arrête pas à remplir un calendrier. Nous suivons les tarifs, l’occupation, les durées de séjour et les retours voyageurs afin d’ajuster la stratégie avec méthode et de rendre compte clairement au propriétaire.",
    image: "/images/owners/reporting-aurevia.webp",
    items: ["Tarification dynamique et calendrier", "Suivi de l’occupation et des séjours", "Compte rendu propriétaire régulier", "Recommandations d’amélioration documentées"],
  },
];

export default function Page() {
  return <>
    <PageHero label="Pour les propriétaires" title="Votre propriété pilotée avec méthode, même à distance" text="AUREVIA coordonne la mise en valeur, les voyageurs, les prestataires et les performances depuis un interlocuteur unique." image="/images/owners/property-care.webp"/>

    <section className="section ivory owner-intro"><div className="container">
      <div className="owner-intro-grid">
        <div><p className="eyebrow dark">Une gestion lisible</p><h2>Moins de contraintes. Plus de maîtrise.</h2></div>
        <div><p>Vous conservez la vision et les décisions importantes. Nous prenons en charge l’exécution quotidienne, avec un cadre défini ensemble et une communication régulière.</p><Link className="text-link" href="/valutazione">Étudier ma propriété <ArrowRight size={16}/></Link></div>
      </div>
      <div className="owner-pillars">
        <div><KeyRound/><span>Un interlocuteur unique</span><p>Pour coordonner voyageurs, prestataires et imprévus.</p></div>
        <div><LineChart/><span>Une stratégie active</span><p>Pour ajuster prix, occupation et durées de séjour.</p></div>
        <div><ShieldCheck/><span>Un bien suivi</span><p>Pour contrôler la préparation et documenter les incidents.</p></div>
        <div><FileText/><span>Des comptes rendus clairs</span><p>Pour savoir ce qui a été fait, quand et pourquoi.</p></div>
      </div>
    </div></section>

    <section className="section owner-comparison"><div className="container">
      <p className="eyebrow">Ce qui change pour vous</p>
      <h2>Votre propriété ne dicte plus votre quotidien.</h2>
      <p className="owner-comparison-intro">Vous gardez les décisions qui comptent. Nous absorbons tout ce qui mobilise votre temps, votre attention et votre disponibilité.</p>
      <div className="comparison owner-comparison-grid">
        <div><span>Lorsque vous gérez seul</span><h3>Votre bien reste toujours dans un coin de votre tête.</h3><ul><li>Vous surveillez les messages, même lorsque vous devriez décrocher</li><li>Vous coordonnez plusieurs personnes sans savoir qui relancer</li><li>Vous prenez des décisions rapides avec une information incomplète</li><li>Un imprévu suffit à désorganiser votre journée</li><li>Vous vous demandez régulièrement si tout est vraiment sous contrôle</li></ul><strong>Votre propriété devient une responsabilité permanente.</strong></div>
        <div><span>Avec AUREVIA</span><h3>Vous savez que quelqu’un veille, décide et agit.</h3><ul><li>Une seule personne connaît votre bien et porte chaque sujet</li><li>Vous êtes informé au bon moment, sans être sollicité pour chaque détail</li><li>Les voyageurs, prestataires et incidents sont gérés sans interrompre votre quotidien</li><li>Chaque décision importante vous est présentée clairement</li><li>Vous retrouvez votre propriété prête, suivie et préservée</li></ul><strong>Vous gardez la maîtrise. Vous retrouvez l’esprit libre.</strong></div>
      </div>
    </div></section>

    <section className="section ivory owner-management"><div className="container">
      <div className="owner-management-heading"><p className="eyebrow dark">Ce que nous gérons</p><h2>De la première visite au rapport propriétaire</h2><p>Trois temps structurent notre accompagnement. Chaque étape possède ses contrôles, ses responsables et ses livrables.</p></div>
      <div className="owner-phases">{managementPhases.map((phase) => <article key={phase.number} className="owner-phase">
        <div className="owner-phase-image" style={{backgroundImage:`url(${phase.image})`}} role="img" aria-label={phase.title}/>
        <div className="owner-phase-content"><span>{phase.number} · {phase.label}</span><h3>{phase.title}</h3><p>{phase.text}</p><ul>{phase.items.map(item => <li key={item}><Check size={15}/>{item}</li>)}</ul></div>
      </article>)}</div>
    </div></section>

    <section className="owner-transparency"><div className="container"><OwnerClarityJourney/></div></section>
    <CTA/>
  </>;
}
