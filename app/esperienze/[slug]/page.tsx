import { notFound } from "next/navigation";
import { PageHero, CTA } from "@/components/PageHero";
import { ServiceJourney, type ServiceJourneyStep } from "@/components/ServiceJourney";
import { experiences } from "@/data/content";
import type { Metadata } from "next";
import { translate } from "@/lib/i18n";

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const experience=experiences.find(item=>item.slug===slug);
  if(!experience)return {};
  return {title:translate(experience.title,"it"),description:translate(experience.short,"it"),alternates:{canonical:`/esperienze/${slug}`}};
}

export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const experience=experiences.find(item=>item.slug===slug);
  if(!experience)notFound();
  const steps:ServiceJourneyStep[]=[
    {title:"Concevoir l’expérience",timing:"Définition de l’offre",text:"Nous déterminons ce qui sera proposé aux voyageurs, à quel moment et dans quelles conditions, en cohérence avec votre bien.",points:["Promesse claire","Public concerné","Niveau de service attendu"]},
    {title:"Sélectionner les partenaires",timing:"Mise en place",text:"Nous identifions les prestataires capables de tenir le niveau attendu, puis vérifions leurs tarifs, leurs disponibilités et leurs conditions.",points:["Prestataires vérifiés","Tarifs négociés","Solution de remplacement"]},
    {title:"L’intégrer à la réservation",timing:"Parcours voyageur",text:"La prestation est présentée au bon moment, avec une description simple, un prix connu et une procédure de validation précise.",points:["Présentation de l’offre","Modalités de commande","Confirmation écrite"]},
    {title:"Coordonner et suivre",timing:"À chaque demande",text:"AUREVIA transmet les informations utiles, suit la réalisation et recueille les retours afin d’améliorer le dispositif.",points:["Coordination opérationnelle","Contrôle de la prestation","Suivi des retours"]},
  ];
  return <>
    <PageHero label="Expérience proposée aux voyageurs" title={experience.title} text={experience.short} image={experience.image}/>
    <section className="section ivory"><div className="container service-detail-intro">
      <div><p className="eyebrow dark">Le principe</p><h2>Une expérience pensée comme un véritable service.</h2></div>
      <div><p className="service-lead">{experience.short}</p><p>AUREVIA transforme cette idée en une offre claire et exploitable : partenaires sélectionnés, conditions définies, parcours de réservation organisé et qualité suivie.</p></div>
      <div className="service-at-glance">{experience.details.map((item,index)=><article key={item}><span>{String(index+1).padStart(2,"0")}</span><strong>{item}</strong></article>)}</div>
    </div></section>
    <section className="content-section service-journey-section"><div className="container"><div className="service-section-heading"><p className="eyebrow">Mise en place</p><h2>De l’idée à une prestation réellement maîtrisée.</h2><p>Voici comment l’expérience est construite avant d’être proposée à vos voyageurs.</p></div><ServiceJourney steps={steps}/></div></section>
    <section className="section"><div className="container"><p className="eyebrow">Le dispositif</p><h2>Ce que nous mettons en place</h2><div className="detail-list-grid">{[...experience.details,"Vérification des disponibilités et des délais","Construction du tarif et des conditions","Intégration au parcours de réservation","Suivi de la qualité après réalisation"].map((item,index)=><article key={item}><span>{String(index+1).padStart(2,"0")}</span><p>{item}</p></article>)}</div></div></section>
    <section className="section ivory"><div className="container transparency-grid"><div><p className="eyebrow dark">Lorsqu’un voyageur réserve</p><h2>Une procédure connue de tous.</h2><ul><li>La demande est vérifiée avant toute confirmation</li><li>Le prix et les conditions sont communiqués au voyageur</li><li>Le partenaire reçoit uniquement les informations nécessaires</li><li>AUREVIA coordonne les horaires, les accès et les éventuels changements</li><li>La réalisation est suivie et consignée</li></ul></div><div className="transparency-card"><p className="eyebrow dark">Cadre commercial</p><h3>Une offre claire pour le propriétaire comme pour le voyageur</h3><ul><li>Prestation proposée selon les disponibilités réelles</li><li>Tarifs et conditions d’annulation définis à l’avance</li><li>Aucun engagement pris sans confirmation</li><li>Suivi des ventes additionnelles et rétrocommission propriétaire</li></ul></div></div></section>
    <CTA/>
  </>;
}
