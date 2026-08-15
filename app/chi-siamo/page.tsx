import Link from "next/link";
import { PageHero, CTA } from "@/components/PageHero";
import type { Metadata } from "next";
import { AboutStoryJourney, ValuesStory } from "@/components/InteractiveSections";

export const metadata: Metadata = { title: "À propos de Velyo", description: "Une approche locale, claire et humaine du property management à Genova.", alternates: { canonical: "/chi-siamo" } };

export default function Page() {
  return <>
    <PageHero label="À propos" title="Le sérieux d’une gestion structurée, sans mise en scène excessive" text="Velyo conserve la profondeur d’un service complet et l’exprime avec un ton plus direct, plus accessible et plus proche du quotidien." image="/images/about/lighthouse.webp" />
    <section className="section ivory about-opening"><div className="container about-opening-grid"><div><p className="eyebrow dark">Notre raison d’être</p><h2>Bien gérer, c’est rendre les choses plus simples.</h2></div><div className="about-opening-copy"><p className="about-lead">Une présence locale quand la distance complique tout.</p><p>Un logement continue de vivre entre les séjours. Les accès, les voyageurs, l’entretien et les petits incidents demandent une coordination régulière. Velyo réunit cette organisation auprès d’un même interlocuteur à Genova.</p></div></div></section>
    <section className="about-story"><div className="container"><div className="about-story-heading"><p className="eyebrow">L’histoire Velyo</p><h2>Du quotidien dispersé à une gestion lisible.</h2><p>La marque est née d’un besoin simple : permettre au propriétaire de garder la maîtrise sans rester disponible pour chaque détail.</p></div><AboutStoryJourney /></div></section>
    <section className="section ivory about-territory"><div className="container split"><div className="image-placeholder image-photo about-genova"><span>Genova, notre terrain de travail</span></div><div className="about-territory-copy"><p className="eyebrow dark">Un ancrage local</p><h2>Connaître la ville change la façon de gérer.</h2><p>Accès du centre historique, rythme de Nervi, contraintes de stationnement, artisans de proximité et saisonnalité : une présence locale permet d’agir plus vite et plus justement.</p><p>Cette connaissance sert d’abord la fluidité des opérations et la qualité des informations transmises au propriétaire.</p><blockquote>« Être local, c’est savoir qui appeler, quoi anticiper et comment éviter qu’un détail devienne un problème. »</blockquote></div></div></section>
    <section className="section about-promise"><div className="container"><p className="eyebrow">Notre promesse</p><div className="about-promise-grid"><h2>Rendre le fonctionnement clair et fiable.</h2><div><p>Pas de superlatif ni de boîte noire : des responsabilités définies, des réponses organisées et une information utile au bon moment.</p><Link className="text-link" href="/proprietari">Découvrir l’accompagnement <span>→</span></Link></div></div></div></section>
    <section className="section about-values"><div className="container"><div className="about-values-heading"><p className="eyebrow">Nos repères</p><h2>Clarté, proximité et fiabilité dans les actes.</h2><p>Ces valeurs doivent se retrouver dans la façon de répondre, d’organiser une intervention et de suivre le bien.</p></div><ValuesStory /></div></section>
    <CTA />
  </>;
}
