import Link from "next/link";
import { PageHero, CTA } from "@/components/PageHero";
import { ValuesStory } from "@/components/InteractiveSections";

const chapters = [
  { number: "01", title: "Tout commence par une absence", text: "Une résidence reste silencieuse plusieurs semaines. À distance, le moindre détail devient une question : la maison est-elle prête, entretenue, protégée ? AUREVIA est née de cette réalité. Être la présence fiable qui veille lorsque le propriétaire n’est pas là." },
  { number: "02", title: "Puis vient la rencontre", text: "Nous ne commençons jamais par un forfait. Nous découvrons un lieu, son histoire, ses usages et les attentes de ceux qui y sont attachés. Cette écoute transforme une simple gestion en accompagnement véritablement personnel." },
  { number: "03", title: "Le détail devient une signature", text: "Une lumière allumée avant une arrivée tardive. Un linge parfaitement préparé. Un incident résolu sans bruit. Ce sont ces gestes, souvent invisibles, qui préservent la valeur d’un bien et donnent à chaque séjour une impression d’évidence." },
  { number: "04", title: "La confiance s’installe", text: "Elle se construit dans la constance : une information claire, un interlocuteur disponible, une décision expliquée. Notre ambition n’est pas seulement de gérer une propriété, mais de devenir le prolongement naturel de son propriétaire en Ligurie." },
];

export default function Page() {
  return <>
    <PageHero label="À propos" title="Une histoire de présence, de confiance et de lumière" text="Sur la côte ligure, les plus belles propriétés ne demandent pas seulement à être gérées. Elles demandent à être comprises, protégées et racontées." image="/images/about/lighthouse.webp"/>

    <section className="section ivory about-opening"><div className="container about-opening-grid">
      <div><p className="eyebrow dark">Notre raison d’être</p><h2>Prendre soin de ce qui compte, même à distance.</h2></div>
      <div className="about-opening-copy"><p className="about-lead">Entre la pierre et la mer, une propriété porte toujours davantage qu’une valeur immobilière. Elle abrite des souvenirs, un projet, parfois une histoire familiale.</p><p>AUREVIA est née pour offrir aux propriétaires cette tranquillité rare : savoir qu’une présence attentive veille sur leur bien, anticipe les besoins et protège chaque détail avec la même exigence qu’eux.</p></div>
    </div></section>

    <section className="about-story"><div className="container">
      <div className="about-story-heading"><p className="eyebrow">L’histoire AUREVIA</p><h2>De l’absence à la confiance.</h2><p>Notre histoire ne se résume pas à une date. Elle se raconte à travers quatre convictions devenues notre manière d’agir.</p></div>
      <div className="about-chapters">{chapters.map((chapter)=><article key={chapter.number} className="about-chapter"><span>{chapter.number}</span><div><h3>{chapter.title}</h3><p>{chapter.text}</p></div></article>)}</div>
    </div></section>

    <section className="section ivory about-territory"><div className="container split">
      <div className="image-placeholder image-photo about-genova"><span>Gênes, notre port d’attache</span></div>
      <div className="about-territory-copy"><p className="eyebrow dark">Un territoire vivant</p><h2>La Ligurie ne se visite pas. Elle se révèle.</h2><p>Il faut connaître ses ruelles, ses reliefs, ses saisons et ses artisans. Comprendre la lumière d’un appartement à Nervi, le rythme d’une villa à Portofino ou les exigences d’une arrivée à Gênes.</p><p>Cette connaissance locale nous permet d’agir avec justesse, d’entourer chaque propriété des bons partenaires et d’offrir aux voyageurs une hospitalité enracinée dans le lieu.</p><blockquote>« Être local, ce n’est pas seulement être présent. C’est savoir qui appeler, quoi anticiper et comment préserver l’âme d’un lieu. »</blockquote></div>
    </div></section>

    <section className="section about-promise"><div className="container"><p className="eyebrow">Notre promesse</p><div className="about-promise-grid"><h2>Rendre l’excellence presque invisible.</h2><div><p>Le véritable luxe ne se montre pas. Il se ressent dans la fluidité d’une arrivée, la précision d’un compte rendu et la sérénité d’un propriétaire qui n’a plus besoin de vérifier.</p><Link className="text-link" href="/proprietari">Découvrir notre accompagnement <span>→</span></Link></div></div></div></section>

    <section className="section about-values"><div className="container"><p className="eyebrow">Nos valeurs</p><h2>Les principes qui donnent du sens à chaque geste.</h2><ValuesStory/></div></section>
    <CTA/>
  </>;
}
