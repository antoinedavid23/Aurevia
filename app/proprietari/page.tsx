import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/public-site/PageHero";
import type { Metadata } from "next";
import { OwnerClarityJourney, OwnerPromiseJourney } from "@/components/public-site/InteractiveSections";
import { ConciergeRhythm } from "@/components/public-site/ConciergeRhythm";
import { ItalianContent } from "@/components/public-site/ItalianContent";
import { pageMetadata } from "@/lib/public-site/site-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Gestione locativa a Genova",
  description: "Confiez votre location courte durée à un interlocuteur local à Genova. AUREVIA gère les voyageurs, les prestataires, le bien et votre reporting.",
  path: "/proprietari",
});

const ownerRelief = [
  ["Le quotidien est pris en charge", "Réservations, voyageurs, préparation du bien et interventions : le périmètre est posé clairement."],
  ["Chaque intervenant suit le même cadre", "Les rôles, les contacts et la marche à suivre sont définis avant le premier séjour."],
  ["Votre accord reste la règle", "Vos périodes, votre budget et les décisions qui demandent toujours votre accord."],
];

const tailoredOrganisation = [
  ["01", "Ce que nous gérons", "Réservations, voyageurs, préparation du bien et interventions : le périmètre est posé clairement."],
  ["02", "Ce que vous gardez", "Vos périodes, votre budget et les décisions qui demandent toujours votre accord."],
  ["03", "Comment nous agissons", "Les rôles, les contacts et la marche à suivre sont définis avant le premier séjour."],
  ["04", "Ce que vous recevez", "Des nouvelles au rythme choisi, avec les faits utiles et les décisions à prendre."],
];

export default function Page() {
  return <ItalianContent>
    <PageHero label="Déléguer sans disparaître" title="Votre bien, sous contrôle" text="AUREVIA prend en charge la location à Genova. Vous gardez la visibilité, vos règles et les décisions qui comptent." image="/images/public-site/concierge/owner-conversation-premium.webp" />
    <section className="section ivory owner-intro"><div className="container watermark-heading owner-page-watermark owner-page-watermark--left"><p className="section-watermark" aria-hidden="true">LA CONFIANCE SE CONSTRUIT</p>
      <p className="eyebrow dark">Des faits à chaque étape</p>
      <div className="owner-intro-editorial"><div><h2><span>Vous savez ce qui est fait.</span><em>Et pourquoi.</em></h2></div><div className="owner-intro-statement"><p>Du diagnostic à l’optimisation, chaque étape précise l’action menée, le résultat attendu et les informations que vous recevez.</p><Link className="text-link" href="/valutazione">Confier mon bien <ArrowRight size={16} /></Link></div></div>
      <OwnerPromiseJourney />
    </div></section>
    <section className="section owner-comparison"><div className="container watermark-heading owner-page-watermark owner-page-watermark--right"><p className="section-watermark" aria-hidden="true">VOTRE PLAN DE GESTION</p>
      <p className="eyebrow">Un cadre défini ensemble</p>
      <div className="owner-tailored-heading"><div><h2>Un cadre sur mesure. Pas d’improvisation.</h2></div><p>Avant le premier séjour, nous définissons le périmètre, les validations, le budget, vos périodes personnelles et le rythme des comptes rendus.</p></div>
      <div className="owner-tailored-composition">
        <article className="owner-tailored-plan">
          <div className="owner-tailored-plan-intro">
            <div className="owner-tailored-plan-copy"><h3>Chaque personne sait quoi faire.</h3><p>Le fonctionnement est défini, documenté puis appliqué au quotidien. AUREVIA peut agir rapidement sans redemander les mêmes consignes à chaque situation.</p></div>
          </div>
          <div className="owner-tailored-scope"><div className="owner-tailored-details">{tailoredOrganisation.map(([number, label, text]) => <article key={number} tabIndex={0}><span>{number}</span><div><strong>{label}</strong><p>{text}</p></div><i aria-hidden="true">+</i></article>)}</div></div>
        </article>
        <aside className="owner-tailored-relief">
          <div className="owner-tailored-relief-heading">
            <h3>Le quotidien avance.<br/><em>Vous gardez le cap.</em></h3>
            <p>Le cadre posé ensemble permet à AUREVIA d’agir sur le quotidien et de vous solliciter uniquement lorsque votre accord est nécessaire.</p>
            <Link className="owner-tailored-relief-link" href="/valutazione">Confier mon bien <ArrowRight size={15} /></Link>
          </div>
          <ol>{ownerRelief.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol>
        </aside>
      </div>
    </div></section>
    <section className="section ivory owner-management concierge-offer-section"><div className="container watermark-heading owner-page-watermark owner-page-watermark--center"><p className="section-watermark" aria-hidden="true">CHAQUE SÉJOUR SUIVI</p>
      <p className="eyebrow dark">Le cycle de chaque location</p>
      <div className="owner-management-heading"><div><h2>Chaque séjour prépare déjà le suivant.</h2></div><p>Nous préparons le bien, gérons le séjour et le remettons à niveau avant l’arrivée suivante.</p></div>
      <ConciergeRhythm />
    </div></section>
    <section className="owner-transparency"><div className="container"><OwnerClarityJourney /></div></section>
  </ItalianContent>;
}
