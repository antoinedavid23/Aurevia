"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

const method = [
  { title: "Comprendre le bien", time: "Visite initiale", text: "Nous cadrons les usages, les accès, les équipements, vos périodes d’occupation et le niveau de délégation souhaité.", points: ["Priorités identifiées", "Contraintes documentées", "Périmètre défini"] },
  { title: "Installer le fonctionnement", time: "Mise en place", text: "Calendrier, règles, contacts, seuils de validation et supports voyageurs sont réunis dans un cadre simple.", points: ["Calendrier centralisé", "Procédures partagées", "Interlocuteur unique"] },
  { title: "Lancer la gestion", time: "Démarrage", text: "Les partenaires sont coordonnés, le logement est préparé et chaque étape du séjour est vérifiée avant ouverture.", points: ["Contrôle du bien", "Parcours voyageur", "Planning opérationnel"] },
  { title: "Suivre et ajuster", time: "En continu", text: "Velyo pilote les réservations, les interventions et les résultats, puis vous transmet l’information utile.", points: ["Suivi régulier", "Décisions expliquées", "Amélioration continue"] },
];

export function MethodJourney() {
  const [active, setActive] = useState(0);
  const item = method[active];
  return (
    <div className="method-scroll-shell velyo-method">
      <div className="method-scroll">
        <div className="method-progress">{method.map((_, index) => <button aria-label={`Étape ${index + 1}`} key={index} className={index === active ? "active" : ""} onClick={() => setActive(index)} />)}</div>
        <div className="method-detail">
          <div className="method-index"><span>0{active + 1}</span><small>/ 04</small></div>
          <span>{item.time}</span><h3>{item.title}</h3><p>{item.text}</p>
          <ul>{item.points.map((point) => <li key={point}><Check size={15} />{point}</li>)}</ul>
          <div className="method-controls"><button type="button" disabled={active === 0} onClick={() => setActive(active - 1)}>Précédent</button><button type="button" disabled={active === method.length - 1} onClick={() => setActive(active + 1)}>Suivant</button></div>
          <Link className="text-link" href="/valutazione">Présenter mon bien <ArrowRight size={15} /></Link>
        </div>
      </div>
    </div>
  );
}

const reviews = [
  { initials: "MG", place: "Genova", quote: "Un seul échange pour suivre les réservations, l’entretien et les décisions importantes." },
  { initials: "CL", place: "Nervi", quote: "Les informations sont plus claires et nous ne passons plus nos journées à relancer plusieurs personnes." },
  { initials: "AR", place: "Castelletto", quote: "Le bien reste suivi pendant notre absence et nous savons exactement quand notre validation est nécessaire." },
  { initials: "SB", place: "Albaro", quote: "Une équipe réactive, directe et vraiment présente sur place." },
];

export function ReviewCards() {
  const [active, setActive] = useState(0);
  const visible = [reviews[active], reviews[(active + 1) % reviews.length], reviews[(active + 2) % reviews.length]];
  return (
    <div className="review-carousel">
      <button className="review-arrow review-arrow-left" type="button" onClick={() => setActive((active - 1 + reviews.length) % reviews.length)} aria-label="Avis précédents"><ChevronLeft /></button>
      <div className="review-grid">{visible.map((review, index) => <article className="review-card" key={`${review.initials}-${index}`}><div className="review-head"><div className="review-avatar">{review.initials}</div><div><strong>Retour propriétaire</strong><span>{review.place}</span></div></div><div className="review-stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} fill="currentColor" />)}</div><blockquote>“{review.quote}”</blockquote><small>Texte de démonstration à remplacer par un avis vérifié.</small></article>)}</div>
      <button className="review-arrow review-arrow-right" type="button" onClick={() => setActive((active + 1) % reviews.length)} aria-label="Avis suivants"><ChevronRight /></button>
    </div>
  );
}

const clarityMoments = [
  ["Dès le départ", "Vous savez ce qui est pris en charge.", "Services, validations, frais séparés et rythme d’information sont posés avant la première réservation."],
  ["Au quotidien", "Vous n’avez plus à rester disponible.", "Voyageurs, prestataires et imprévus passent par Velyo. Vous recevez l’information utile, pas tout le bruit de l’exploitation."],
  ["Quand il faut décider", "Vous avez les faits, pas seulement l’urgence.", "La situation, les options et notre recommandation vous sont présentées clairement avant engagement."],
  ["Dans la durée", "Vous voyez ce qui a été fait.", "Actions, performances et points d’attention sont regroupés dans une lecture simple du bien."],
];

export function OwnerClarityJourney() {
  return <div className="owner-clarity-grid">{clarityMoments.map(([kicker, title, text], index) => <article key={title}><span>0{index + 1}</span><p className="eyebrow">{kicker}</p><h3>{title}</h3><p>{text}</p></article>)}</div>;
}

const values = [
  ["Clarté", "Vous savez qui fait quoi et pourquoi."],
  ["Réactivité", "Une réponse organisée lorsque la situation change."],
  ["Proximité", "Une présence à Genova, au contact du bien."],
  ["Fiabilité", "Les décisions et interventions importantes sont documentées."],
  ["Simplicité", "Un seul interlocuteur pour le quotidien."],
];

export function ValuesStory() {
  const [active, setActive] = useState(0);
  return <div className="values-manifest velyo-values"><div className="values-selector">{values.map(([title], index) => <button key={title} type="button" aria-selected={active === index} onClick={() => setActive(index)}><span>0{index + 1}</span><b>{title}</b></button>)}</div><div className="values-feature"><span>0{active + 1} / 05</span><p className="values-feature-name">{values[active][0]}</p><h3>{values[active][1]}</h3><p>Cette valeur se traduit dans la façon de répondre, d’organiser une intervention et de tenir le propriétaire informé.</p></div></div>;
}

const storyChapters = [
  ["Le constat", "Un bien à distance devient vite une suite de messages, de relances et de décisions prises dans l’urgence."],
  ["Le relais", "Velyo centralise le quotidien, apprend le fonctionnement du lieu et coordonne les bonnes personnes."],
  ["Le résultat", "Le propriétaire garde la maîtrise sans devoir porter chaque détail de l’exploitation."],
];

export function AboutStoryJourney() {
  return <div className="about-story-grid">{storyChapters.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>;
}
