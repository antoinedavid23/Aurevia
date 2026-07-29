import { notFound } from "next/navigation";
import { PageHero, CTA } from "@/components/PageHero";
import { services } from "@/data/content";

const specifics: Record<string,{challenge:string;included:string[];owner:string[];notIncluded:string[]}> = {
  "gestione-proprieta":{challenge:"Coordonner seul les voyageurs, le calendrier, les prestataires et les imprévus exige une disponibilité constante.",included:["Audit opérationnel du bien","Paramétrage du calendrier et des règles","Coordination des réservations","Suivi des arrivées et départs","Contrôle des prestations","Gestion des incidents","Compte rendu propriétaire","Interlocuteur unique"],owner:["Vision claire de l’activité","Décisions documentées","Disponibilité préservée"],notIncluded:["Ménage et linge facturés selon utilisation","Travaux et pièces sur validation préalable"]},
  "concierge":{challenge:"Les demandes particulières peuvent rapidement mobiliser plusieurs interlocuteurs et fragiliser l’expérience.",included:["Qualification de la demande","Recherche de solutions adaptées","Sélection des partenaires","Présentation des options et tarifs","Réservation après validation","Coordination des horaires","Suivi de la prestation","Assistance en cas d’ajustement"],owner:["Une réponse centralisée","Des coûts annoncés avant engagement","Un suivi jusqu’à la réalisation"],notIncluded:["Prestations tierces facturées séparément","Services soumis à disponibilité"]},
  "accoglienza-voyageurs":{challenge:"La première impression se joue avant même l’ouverture de la porte.",included:["Collecte des informations d’arrivée","Instructions personnalisées","Préparation des accès","Contrôle préalable du logement","Accueil ou arrivée autonome encadrée","Présentation des équipements","Disponibilité pendant l’installation","Suivi après l’arrivée"],owner:["Un parcours cohérent","Moins de sollicitations directes","Une image de marque maîtrisée"],notIncluded:["Transferts et bagagerie sur devis","Accueil tardif selon conditions convenues"]},
  "pulizie-biancheria":{challenge:"La régularité du ménage et du linge conditionne directement la satisfaction des voyageurs.",included:["Planning des rotations","Brief de préparation par pièce","Coordination des équipes","Contrôle visuel","Suivi du linge","Signalement des dégradations","Réassort selon inventaire","Correction des écarts identifiés"],owner:["Standards constants","Traçabilité des anomalies","Bien prêt à chaque arrivée"],notIncluded:["Ménage, blanchisserie et consommables facturés séparément","Nettoyages techniques sur devis"]},
  "manutenzione":{challenge:"Une petite anomalie non suivie peut devenir une intervention urgente et coûteuse.",included:["Registre des équipements","Contrôles préventifs convenus","Qualification des incidents","Recherche d’un intervenant","Présentation du devis","Planification après accord","Suivi de l’intervention","Compte rendu et justificatifs"],owner:["Décisions prises en connaissance de cause","Historique des interventions","Réseau local coordonné"],notIncluded:["Main-d’œuvre, pièces et matériaux facturés séparément","Urgences traitées selon disponibilité des artisans"]},
  "revenue-management":{challenge:"Un tarif fixe ne reflète ni la saison, ni la demande, ni les caractéristiques réelles du séjour.",included:["Analyse du positionnement","Segmentation des périodes","Tarifs par saison et événements","Règles de durée de séjour","Ajustements selon la demande","Suivi du rythme des réservations","Tests de présentation","Bilan périodique"],owner:["Stratégie compréhensible","Arbitrages expliqués","Potentiel suivi dans le temps"],notIncluded:["Aucun revenu n’est garanti","Les projections restent indicatives"]},
  "sicurezza":{challenge:"La protection du bien repose sur des procédures simples, connues et répétées.",included:["Inventaire initial","Gestion des accès","Consignes aux voyageurs","Contrôles après séjour","Signalement documenté","Coordination en cas d’incident","Suivi des équipements sensibles","Mise à jour des procédures"],owner:["Accès mieux maîtrisés","Incidents documentés","Cadre d’intervention clair"],notIncluded:["Assurance et télésurveillance non incluses","Équipements de sécurité sur devis"]},
  "amministrazione":{challenge:"Sans reporting structuré, le propriétaire manque de visibilité sur l’activité et les décisions prises.",included:["Centralisation des réservations","Suivi des prestations","Classement des justificatifs","Synthèse de l’activité","Historique des incidents","Relevé des décisions","Reporting consolidé","Préparation des éléments utiles au propriétaire"],owner:["Information accessible","Suivi régulier","Un historique exploitable"],notIncluded:["Conseil comptable, fiscal ou juridique non inclus","Documents à valider avec vos professionnels"]},
};

export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const service=services.find(item=>item.slug===slug);
  const detail=specifics[slug];
  if(!service||!detail)notFound();
  return <>
    <PageHero label="Services" title={service.title} text={service.short} image={service.image}/>
    <section className="content-section ivory"><div className="container service-detail-intro">
      <div><p className="eyebrow dark">L’enjeu</p><h2>Tout ce qui est pris en charge, clairement.</h2></div>
      <div><p className="service-lead">{detail.challenge}</p><p>AUREVIA définit avec vous le périmètre, les validations nécessaires et le niveau de compte rendu. Vous savez ce que nous faisons, quand nous intervenons et quels frais peuvent rester séparés.</p></div>
    </div></section>
    <section className="content-section"><div className="container">
      <p className="eyebrow">Prestations incluses</p><h2>Le détail de notre intervention</h2>
      <div className="detail-list-grid">{detail.included.map((item,index)=><article key={item}><span>{String(index+1).padStart(2,"0")}</span><p>{item}</p></article>)}</div>
    </div></section>
    <section className="content-section ivory"><div className="container transparency-grid">
      <div><p className="eyebrow dark">Ce que vous recevez</p><h2>De la visibilité, pas seulement un service.</h2><ul>{detail.owner.map(item=><li key={item}>{item}</li>)}</ul></div>
      <div className="transparency-card"><p className="eyebrow dark">À savoir avant de commencer</p><h3>Un cadre transparent</h3><ul>{detail.notIncluded.map(item=><li key={item}>{item}</li>)}</ul><p>Le périmètre définitif, les délais de réponse et les règles de validation sont précisés dans votre proposition.</p></div>
    </div></section>
    <section className="content-section"><div className="container"><p className="eyebrow">Déroulement</p><h2>Quatre étapes, aucun angle mort</h2><div className="steps">{["Visite et compréhension du besoin","Proposition et périmètre validés","Mise en place des standards","Pilotage et compte rendu"].map((item,index)=><div key={item}><span>0{index+1}</span><h3>{item}</h3></div>)}</div></div></section>
    <CTA/>
  </>;
}
