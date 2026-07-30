import Link from "next/link";
import { PageHero, CTA } from "@/components/PageHero";
import { AboutStoryJourney, ValuesStory } from "@/components/InteractiveSections";

export default function Page() {
  return <>
    <PageHero label="À propos" title="Une histoire de présence, de confiance et de lumière" text="Sur la côte ligure, les plus belles propriétés ne demandent pas seulement à être gérées. Elles demandent à être comprises, protégées et racontées." image="/images/about/lighthouse.webp"/>

    <section className="section ivory about-opening"><div className="container about-opening-grid">
      <div><p className="eyebrow dark">Notre raison d’être</p><h2>Prendre soin de ce qui compte.</h2></div>
      <div className="about-opening-copy"><p className="about-lead">Le calme de ne plus avoir à y penser.</p><p>Votre bien continue de vivre en votre absence. Les saisons passent, les équipements évoluent, une arrivée se prépare et certains détails réclament une attention que la distance rend difficile. AUREVIA reste sur place, apprend les habitudes du lieu, remarque ce qui change et intervient avant qu’un simple détail ne devienne une contrainte. Vous restez pleinement maître de votre bien, sans avoir à en porter chaque préoccupation au quotidien.</p></div>
    </div></section>

    <section className="about-story"><div className="container">
      <div className="about-story-heading"><p className="eyebrow">L’histoire AUREVIA</p><h2>Tout commence lorsque vous fermez la porte.</h2><p>Il ne s’agit pas de raconter la naissance d’une entreprise. Il s’agit de raconter ce qui change lorsqu’un propriétaire cesse enfin d’emporter sa maison avec lui.</p></div>
      <AboutStoryJourney/>
    </div></section>

    <section className="section ivory about-territory"><div className="container split">
      <div className="image-placeholder image-photo about-genova"><span>Gênes, notre port d’attache</span></div>
      <div className="about-territory-copy"><p className="eyebrow dark">Un territoire vivant</p><h2>Gênes ne se visite pas. Elle se révèle.</h2><p>Il faut connaître ses ruelles, ses reliefs, ses saisons et ses artisans. Comprendre la lumière d’un appartement à Nervi, le caractère d’une demeure à Albaro, le calme d’une terrasse à Castelletto ou les exigences d’une arrivée dans le centre historique.</p><p>Cette connaissance locale nous permet d’agir avec justesse, d’entourer chaque propriété des bons partenaires et d’offrir aux voyageurs une hospitalité profondément génoise.</p><blockquote>« Être local, ce n’est pas seulement être présent. C’est savoir qui appeler, quoi anticiper et comment préserver l’âme d’un lieu. »</blockquote></div>
    </div></section>

    <section className="section about-promise"><div className="container"><p className="eyebrow">Notre promesse</p><div className="about-promise-grid"><h2>Rendre l’excellence presque invisible.</h2><div><p>Le véritable luxe ne se montre pas. Il se ressent dans la fluidité d’une arrivée, la précision d’un compte rendu et la sérénité d’un propriétaire qui n’a plus besoin de vérifier.</p><Link className="text-link" href="/proprietari">Découvrir notre accompagnement <span>→</span></Link></div></div></div></section>

    <section className="section about-values"><div className="container"><div className="about-values-heading"><p className="eyebrow">Ce que vous devez pouvoir ressentir</p><h2>La confiance ne se proclame pas. Elle se vit.</h2><p>Nos valeurs ne sont pas des mots choisis pour nous décrire. Elles sont ce que vous devez ressentir chaque fois que vous nous confiez une clé, une décision ou une part de votre tranquillité.</p></div><ValuesStory/></div></section>
    <CTA/>
  </>;
}
