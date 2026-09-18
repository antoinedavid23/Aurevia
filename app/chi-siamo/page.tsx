import Link from "next/link";
import { PageHero } from "@/components/public-site/PageHero";
import type { Metadata } from "next";
import { AboutStoryJourney, ValuesStory } from "@/components/public-site/InteractiveSections";
import { ItalianContent } from "@/components/public-site/ItalianContent";
import { pageMetadata } from "@/lib/public-site/site-metadata";

export const metadata: Metadata = pageMetadata({ title: "AUREVIA, property manager a Genova", description: "Découvrez la méthode AUREVIA : une présence locale à Genova pour gérer les locations, coordonner les intervenants et protéger chaque bien.", path: "/chi-siamo" });

export default function Page() {
  return <ItalianContent>
    <PageHero label="Pourquoi AUREVIA existe" title="À propos" text="Une personne sur place pour gérer la location, suivre le bien et vous tenir informé." image="/images/public-site/concierge/owner-conversation-premium.webp" />

    <section className="section about-intro-new"><div className="container">
      <div className="about-intro-heading"><div><p className="eyebrow dark">Pourquoi AUREVIA existe</p><h2>Un bien se gère aussi sur place.</h2></div><div><p className="about-intro-lead">À distance, tout finit par revenir au propriétaire.</p><p>AUREVIA réunit les voyageurs, les prestataires et le suivi du bien auprès d’une personne qui connaît réellement le lieu.</p></div></div>
      <div className="about-intro-visuals"><figure className="about-intro-main"><div role="img" aria-label="Une conversation entre une propriétaire et son interlocutrice AUREVIA" /><figcaption><span>01</span><span className="about-intro-caption-text">Nous commençons par comprendre le bien et vos règles.</span></figcaption></figure><aside><p>Notre rôle</p><blockquote>Faire avancer le quotidien sans vous retirer les décisions importantes.</blockquote><span>Présence locale · Gestion suivie · Informations utiles</span></aside><figure className="about-intro-detail"><div role="img" aria-label="Préparation attentive d’un bien avant l’arrivée" /><figcaption><span>02</span><span className="about-intro-caption-text">Chaque séjour est préparé, suivi puis contrôlé.</span></figcaption></figure></div>
    </div></section>

    <section className="section about-story-new"><div className="container"><div className="about-story-new-heading"><div><p className="eyebrow">L’origine de AUREVIA</p><h2><span>Le constat :</span><em>tout revient au propriétaire.</em></h2></div><p>Messages, prestataires, clés et imprévus réclament une personne capable d’agir sur place.</p></div><AboutStoryJourney /></div></section>

    <section className="about-local-new"><div className="about-local-image" role="img" aria-label="Genova au bleu du soir"><div><span>Genova</span><p>Notre terrain de jeu, chaque jour.</p></div></div><div className="about-local-copy"><p className="eyebrow dark">Une présence locale</p><h2>Connaître Genova permet d’agir plus juste.</h2><p>Le centre historique n’a pas les mêmes accès que Nervi. Une arrivée tardive, un artisan disponible ou un épisode de pluie ne s’organisent pas de la même façon selon le quartier.</p><p>Cette connaissance n’est pas un supplément d’image. Elle permet de préparer juste, d’intervenir plus vite et de donner au propriétaire une réponse ancrée dans la réalité.</p><blockquote>Être local, c’est transformer un problème vague en prochaine étape claire.</blockquote></div></section>

    <section className="section about-commitment-new"><div className="container"><div className="about-commitment-heading"><div><p className="eyebrow dark">Notre engagement</p><h2>Vous savez qui fait quoi.</h2></div><div><p>Nous décidons ensemble de notre rôle, de ce qui demande votre accord et de la façon dont vous souhaitez être informé.</p><Link className="text-link" href="/proprietari">Voir comment nous gérons <span>→</span></Link></div></div><ul><li><span>01</span><strong>Tout est défini avant de commencer.</strong><p>Services, dépenses, validations et fréquence des nouvelles sont posés ensemble.</p></li><li><span>02</span><strong>Vous savez toujours qui appeler.</strong><p>Un interlocuteur connaît le bien, coordonne les intervenants et suit chaque demande.</p></li><li><span>03</span><strong>Vous gardez le dernier mot.</strong><p>Nous transmettons les faits utiles et demandons votre accord uniquement lorsqu’il compte.</p></li></ul></div></section>

    <section className="section about-values-new" id="principes-aurevia"><div className="container"><div className="about-values-new-heading"><div><p className="eyebrow">Cinq principes concrets</p><h2>Cinq principes guident chaque intervention.</h2></div><p>Ils se voient dans nos réponses, nos visites et la manière dont nous vous tenons informé.</p></div><ValuesStory /></div></section>
  </ItalianContent>;
}
