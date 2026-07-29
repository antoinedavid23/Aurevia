import { notFound } from "next/navigation";
import { PageHero, CTA } from "@/components/PageHero";
import { experiences } from "@/data/content";

export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const experience=experiences.find(item=>item.slug===slug);
  if(!experience)notFound();
  return <>
    <PageHero label="Expérience sur mesure" title={experience.title} text={experience.short} image={experience.image}/>
    <section className="section ivory"><div className="container service-detail-intro">
      <div><p className="eyebrow dark">Votre demande</p><h2>Une expérience conçue autour de votre rythme.</h2></div>
      <div><p className="service-lead">Nous partons de votre date, du nombre de participants, de vos préférences et de vos contraintes pour construire une proposition lisible.</p><p>Chaque option est présentée avec son contenu, ses conditions, son tarif et les éléments restant à confirmer. Rien n’est réservé sans votre validation.</p></div>
    </div></section>
    <section className="section"><div className="container"><p className="eyebrow">Ce que nous coordonnons</p><h2>Une prise en charge de bout en bout</h2><div className="detail-list-grid">{[...experience.details,"Vérification des disponibilités","Présentation des tarifs et conditions","Confirmation écrite de la réservation","Suivi jusqu’au jour de l’expérience"].map((item,index)=><article key={item}><span>{String(index+1).padStart(2,"0")}</span><p>{item}</p></article>)}</div></div></section>
    <section className="section ivory"><div className="container transparency-grid"><div><p className="eyebrow dark">Déroulement</p><h2>Vous validez à chaque étape.</h2><ul><li>Votre demande est qualifiée avec précision</li><li>Une ou plusieurs options vous sont présentées</li><li>Vous validez le budget et les conditions</li><li>AUREVIA coordonne les partenaires et horaires</li><li>Vous recevez une confirmation récapitulative</li></ul></div><div className="transparency-card"><p className="eyebrow dark">Conditions</p><h3>Clair avant de réserver</h3><ul><li>Prestation soumise à disponibilité</li><li>Tarifs des partenaires communiqués avant validation</li><li>Conditions d’annulation précisées pour chaque proposition</li><li>Demandes spéciales étudiées au cas par cas</li></ul></div></div></section>
    <CTA/>
  </>;
}
