import { notFound } from "next/navigation";
import { PageHero, CTA } from "@/components/PageHero";
import { ServiceJourney, type ServiceJourneyStep } from "@/components/ServiceJourney";
import { experiences } from "@/data/content";

export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const experience=experiences.find(item=>item.slug===slug);
  if(!experience)notFound();
  const steps:ServiceJourneyStep[]=[
    {title:"Préciser vos envies",timing:"Premier échange",text:"Date, participants, rythme et préférences sont réunis dans une demande claire.",points:["Vos priorités","Le cadre souhaité","Les contraintes utiles"]},
    {title:"Choisir votre option",timing:"Proposition ciblée",text:"Nous présentons une sélection courte avec contenu, tarif et conditions.",points:["Disponibilités vérifiées","Budget annoncé","Conditions lisibles"]},
    {title:"Tout coordonner",timing:"Après validation",text:"Partenaires, horaires, accès et transferts sont confirmés par un interlocuteur unique.",points:["Réservations centralisées","Planning confirmé","Détails partagés"]},
    {title:"Profiter pleinement",timing:"Le jour venu",text:"Nous suivons la prestation et restons disponibles si un ajustement est nécessaire.",points:["Suivi discret","Assistance dédiée","Expérience sans friction"]},
  ];
  return <>
    <PageHero label="Expérience sur mesure" title={experience.title} text={experience.short} image={experience.image}/>
    <section className="section ivory"><div className="container service-detail-intro">
      <div><p className="eyebrow dark">L’essentiel</p><h2>Votre expérience, simplement orchestrée.</h2></div>
      <div><p className="service-lead">{experience.short}</p><p>Vous choisissez. AUREVIA vérifie, réserve et coordonne chaque détail. Rien n’est engagé sans votre validation.</p></div>
      <div className="service-at-glance">{experience.details.map((item,index)=><article key={item}><span>{String(index+1).padStart(2,"0")}</span><strong>{item}</strong></article>)}</div>
    </div></section>
    <section className="content-section service-journey-section"><div className="container"><div className="service-section-heading"><p className="eyebrow">Comment cela se passe</p><h2>Quatre étapes. Aucun flou.</h2><p>Sélectionnez une étape pour voir précisément ce que nous prenons en charge.</p></div><ServiceJourney steps={steps}/></div></section>
    <section className="section"><div className="container"><p className="eyebrow">Dans le détail</p><h2>Ce que nous coordonnons</h2><div className="detail-list-grid">{[...experience.details,"Vérification des disponibilités","Présentation des tarifs et conditions","Confirmation écrite de la réservation","Suivi jusqu’au jour de l’expérience"].map((item,index)=><article key={item}><span>{String(index+1).padStart(2,"0")}</span><p>{item}</p></article>)}</div></div></section>
    <section className="section ivory"><div className="container transparency-grid"><div><p className="eyebrow dark">Déroulement</p><h2>Vous validez à chaque étape.</h2><ul><li>Votre demande est qualifiée avec précision</li><li>Une ou plusieurs options vous sont présentées</li><li>Vous validez le budget et les conditions</li><li>AUREVIA coordonne les partenaires et horaires</li><li>Vous recevez une confirmation récapitulative</li></ul></div><div className="transparency-card"><p className="eyebrow dark">Conditions</p><h3>Clair avant de réserver</h3><ul><li>Prestation soumise à disponibilité</li><li>Tarifs des partenaires communiqués avant validation</li><li>Conditions d’annulation précisées pour chaque proposition</li><li>Demandes spéciales étudiées au cas par cas</li></ul></div></div></section>
    <CTA/>
  </>;
}
