import Link from "next/link";
import { ArrowRight, Check, FileText, KeyRound, LineChart, ShieldCheck } from "lucide-react";
import { PageHero, CTA } from "@/components/PageHero";

const managementPhases = [
  {
    number: "01",
    label: "Mise en valeur",
    title: "Préparer un bien qui inspire immédiatement confiance",
    text: "Avant toute mise en location, nous examinons le positionnement, les équipements et le parcours d’arrivée. La présentation est construite pour valoriser les qualités réelles du bien sans créer de promesse artificielle.",
    image: "/images/owners/preparation-aurevia.png",
    items: ["Audit du bien et de son positionnement", "Conseils décoration et équipements", "Création ou optimisation de l’annonce", "Recommandations pour la séance photo"],
  },
  {
    number: "02",
    label: "Exécution",
    title: "Un niveau de préparation vérifié avant chaque séjour",
    text: "Ménage, linge, inventaire et consommables suivent un cadre précis. Les prestataires sont coordonnés, les points sensibles sont contrôlés et les anomalies sont signalées avant qu’elles ne deviennent un incident voyageur.",
    image: "/images/owners/controle-inventaire-aurevia.png",
    items: ["Coordination du ménage et du linge", "Contrôle visuel après intervention", "Suivi des stocks et de l’inventaire", "Organisation des maintenances nécessaires"],
  },
  {
    number: "03",
    label: "Pilotage",
    title: "Chaque décision expliquée, chaque performance suivie",
    text: "La gestion ne s’arrête pas à remplir un calendrier. Nous suivons les tarifs, l’occupation, les durées de séjour et les retours voyageurs afin d’ajuster la stratégie avec méthode et de rendre compte clairement au propriétaire.",
    image: "/images/owners/reporting-aurevia.png",
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
      <p className="eyebrow">Avant / avec AUREVIA</p>
      <h2>Passer d’une gestion dispersée à un pilotage structuré</h2>
      <div className="comparison owner-comparison-grid">
        <div><span>Gestion autonome</span><h3>Une charge quotidienne difficile à anticiper</h3><ul><li>Plusieurs interlocuteurs à coordonner</li><li>Disponibilité permanente pour les voyageurs</li><li>Tarifs ajustés de manière irrégulière</li><li>Incidents traités dans l’urgence</li><li>Peu de visibilité sur les actions réalisées</li></ul></div>
        <div><span>Gestion AUREVIA</span><h3>Un cadre clair et un responsable identifié</h3><ul><li>Un interlocuteur dédié pour l’ensemble du bien</li><li>Communication voyageurs sept jours sur sept</li><li>Tarification dynamique suivie régulièrement</li><li>Procédures définies pour les incidents</li><li>Suivi des performances et compte rendu</li></ul></div>
      </div>
    </div></section>

    <section className="section ivory owner-management"><div className="container">
      <div className="owner-management-heading"><p className="eyebrow dark">Ce que nous gérons</p><h2>De la première visite au rapport propriétaire</h2><p>Trois temps structurent notre accompagnement. Chaque étape possède ses contrôles, ses responsables et ses livrables.</p></div>
      <div className="owner-phases">{managementPhases.map((phase) => <article key={phase.number} className="owner-phase">
        <div className="owner-phase-image" style={{backgroundImage:`url(${phase.image})`}} role="img" aria-label={phase.title}/>
        <div className="owner-phase-content"><span>{phase.number} · {phase.label}</span><h3>{phase.title}</h3><p>{phase.text}</p><ul>{phase.items.map(item => <li key={item}><Check size={15}/>{item}</li>)}</ul></div>
      </article>)}</div>
    </div></section>

    <section className="section owner-transparency"><div className="container">
      <div className="owner-transparency-grid">
        <div><p className="eyebrow">Une relation transparente</p><h2>Vous savez toujours où en est votre propriété</h2></div>
        <div className="owner-deliverables">
          <div><span>Avant le lancement</span><p>Audit, recommandations, stratégie tarifaire et plan de préparation.</p></div>
          <div><span>Pendant l’exploitation</span><p>Suivi des réservations, signalement des incidents et coordination opérationnelle.</p></div>
          <div><span>À intervalles réguliers</span><p>Lecture des performances, actions menées et priorités à venir.</p></div>
        </div>
      </div>
      <p className="owner-note">Les estimations restent indicatives : aucun rendement n’est garanti. Ménage, linge, consommables et interventions techniques sont facturés au réel, sans marge.</p>
    </div></section>
    <CTA/>
  </>;
}
