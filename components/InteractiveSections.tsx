"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Star } from "lucide-react";

const method = [
  {title:"Découverte de la propriété",time:"45 min",text:"Visite du bien, échange sur vos objectifs, vos périodes d’occupation et les contraintes opérationnelles.",points:["Analyse du potentiel","Inventaire des besoins","Cadre de collaboration"]},
  {title:"Définition de la stratégie",time:"2 à 4 jours",text:"Positionnement, calendrier, règles de séjour et scénario tarifaire sont construits autour de votre propriété.",points:["Étude du marché local","Tarifs par saison","Objectifs mesurables"]},
  {title:"Préparation et valorisation",time:"1 à 3 semaines",text:"Nous coordonnons la présentation, les équipements, le livret d’accueil et les standards de préparation.",points:["Plan de lancement","Mise en scène du bien","Parcours voyageur"]},
  {title:"Gestion et pilotage",time:"En continu",text:"Réservations, voyageurs, prestataires et performances sont suivis depuis un interlocuteur unique.",points:["Optimisation régulière","Suivi des incidents","Compte rendu propriétaire"]},
];

export function MethodJourney(){
  const [active,setActive]=useState(0);
  const wheelLock=useRef(0);
  const item=method[active];
  function wheel(event:React.WheelEvent){
    const now=Date.now();
    if(Math.abs(event.deltaY)<18||now-wheelLock.current<450)return;
    wheelLock.current=now;
    setActive(value=>Math.min(3,Math.max(0,value+(event.deltaY>0?1:-1))));
  }
  return <div className="method-scroll" onWheel={wheel}>
    <div className="method-progress" aria-hidden="true">{method.map((_,index)=><i key={index} className={index===active?"active":""}/>)}</div>
    <div className="method-detail" role="tabpanel">
      <div className="method-index"><span>0{active+1}</span><small>/ 04</small></div>
      <span>{item.time}</span><h3>{item.title}</h3><p>{item.text}</p>
      <ul>{item.points.map(point=><li key={point}><Check size={15}/>{point}</li>)}</ul>
      <div className="method-controls"><button type="button" disabled={active===0} onClick={()=>setActive(value=>value-1)}>Monter</button><button type="button" disabled={active===3} onClick={()=>setActive(value=>value+1)}>Descendre</button></div>
      <Link className="text-link" href="/valutazione">Parler de mon bien <ArrowRight size={15}/></Link>
    </div>
    <p className="method-hint">Faites défiler pour parcourir les étapes 1 à 4.</p>
  </div>;
}

const reviews = [
  {initials:"MP",place:"Portofino",date:"Séjour pilote",quote:"La présentation, les informations voyageurs et le suivi sont enfin réunis dans un seul échange.",source:"Témoignage propriétaire à faire valider avant publication"},
  {initials:"CR",place:"Gênes",date:"Mise en gestion",quote:"Nous avons retrouvé de la visibilité sur les réservations, l’entretien et les décisions tarifaires.",source:"Témoignage propriétaire à faire valider avant publication"},
  {initials:"AL",place:"Riviera ligure",date:"Accompagnement",quote:"L’équipe anticipe les détails opérationnels et nous tient informés sans multiplier les messages.",source:"Témoignage propriétaire à faire valider avant publication"},
];

export function ReviewCards(){
  return <div className="review-grid">{reviews.map(review=><article className="review-card" key={review.initials}>
    <div className="review-head"><div className="review-avatar" aria-label={`Portrait temporaire de ${review.initials}`}>{review.initials}</div><div><strong>Propriétaire vérifié·e</strong><span>{review.place} · {review.date}</span></div></div>
    <div className="review-stars" aria-label="5 étoiles">{Array.from({length:5}).map((_,i)=><Star key={i} size={15} fill="currentColor"/>)}</div>
    <blockquote>“{review.quote}”</blockquote><small>{review.source}</small>
  </article>)}</div>;
}

const values = [
  ["Discrétion","Parce qu’un bien privé exige une présence mesurée. Nous partageons uniquement les informations nécessaires, au bon interlocuteur."],
  ["Excellence","Parce que la qualité se joue dans la répétition : mêmes standards, mêmes contrôles, même exigence à chaque séjour."],
  ["Attention","Parce qu’un détail anticipé évite souvent un incident. Nous observons, documentons et suivons chaque point sensible."],
  ["Fiabilité","Parce que le propriétaire doit savoir qui agit, quand et pourquoi. Chaque intervention est coordonnée et tracée."],
  ["Connaissance locale","Parce que Gênes et la Ligurie ont leurs rythmes, leurs accès et leurs saisons. Notre méthode s’adapte au territoire."],
];

export function ValuesStory(){
  return <div className="values-story"><div className="values-intro"><p>Nos valeurs ne sont pas des slogans. Elles sont nées des moments où un propriétaire a besoin de pouvoir compter sur quelqu’un — même à distance.</p></div><div className="values-accordion">{values.map(([title,text],i)=><details key={title} open={i===0}><summary><span>0{i+1}</span>{title}</summary><p>{text}</p></details>)}</div></div>;
}
