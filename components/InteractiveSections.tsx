"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Star } from "lucide-react";

const method = [
  {title:"Révéler le potentiel du lieu",time:"Premier échange privé · 45 à 60 min",text:"Nous découvrons la propriété dans son ensemble : son caractère, ses usages, vos périodes d’occupation et vos ambitions. Cette lecture attentive pose un cadre fidèle au lieu comme à vos exigences.",points:["Lecture précise du potentiel","Inventaire des attentions essentielles","Définition d’un cadre de confiance"]},
  {title:"Construire une stratégie singulière",time:"Étude personnalisée · 2 à 4 jours",text:"Positionnement, calendrier, règles de séjour et stratégie tarifaire sont dessinés comme un ensemble cohérent. Chaque décision préserve la désirabilité du bien tout en soutenant sa performance.",points:["Analyse confidentielle du marché local","Tarification pensée selon chaque saison","Objectifs définis et suivis avec clarté"]},
  {title:"Mettre la propriété en scène",time:"Préparation dédiée · 1 à 3 semaines",text:"Nous préparons chaque détail qui façonne la première impression : présentation, équipements, linge, photographie et parcours d’accueil. La propriété devient immédiatement lisible, désirable et prête à recevoir.",points:["Plan de lancement entièrement personnalisé","Mise en valeur respectueuse de l’identité du lieu","Expérience voyageur pensée sans rupture"]},
  {title:"Orchestrer, suivre et valoriser",time:"Accompagnement continu",text:"Réservations, voyageurs, prestataires, incidents et performances sont pilotés par un interlocuteur unique. Vous conservez une vision claire de votre propriété sans avoir à en porter le quotidien.",points:["Optimisation attentive et régulière","Supervision discrète de chaque intervention","Compte rendu propriétaire clair et privilégié"]},
];

export function MethodJourney(){
  const [active,setActive]=useState(0);
  const shell=useRef<HTMLDivElement>(null);
  const item=method[active];
  useEffect(()=>{
    function update(){
      const element=shell.current;
      if(!element)return;
      const rect=element.getBoundingClientRect();
      const available=Math.max(1,element.offsetHeight-window.innerHeight);
      const progress=Math.min(1,Math.max(0,-rect.top/available));
      setActive(Math.min(3,Math.floor(progress*4)));
    }
    update();
    window.addEventListener("scroll",update,{passive:true});
    window.addEventListener("resize",update);
    return()=>{window.removeEventListener("scroll",update);window.removeEventListener("resize",update)};
  },[]);
  function goTo(index:number){
    const element=shell.current;
    if(!element)return;
    const top=window.scrollY+element.getBoundingClientRect().top;
    const available=element.offsetHeight-window.innerHeight;
    window.scrollTo({top:top+(available*(index+.08)/4),behavior:"smooth"});
  }
  return <div className="method-scroll-shell" ref={shell}>
    <div className="method-scroll">
      <div className="method-progress" aria-hidden="true">{method.map((_,index)=><i key={index} className={index===active?"active":""}/>)}</div>
      <div className="method-detail" role="tabpanel">
        <div className="method-index"><span>0{active+1}</span><small>/ 04</small></div>
        <span>{item.time}</span><h3>{item.title}</h3><p>{item.text}</p>
        <ul>{item.points.map(point=><li key={point}><Check size={15}/>{point}</li>)}</ul>
        <div className="method-controls"><button type="button" disabled={active===0} onClick={()=>goTo(active-1)}>Étape précédente</button><button type="button" disabled={active===3} onClick={()=>goTo(active+1)}>Étape suivante</button></div>
        <Link className="text-link" href="/valutazione">Échanger en toute confidentialité <ArrowRight size={15}/></Link>
      </div>
      <p className="method-hint">{active<3?"Poursuivez votre lecture pour découvrir l’étape suivante.":"Votre accompagnement peut maintenant commencer."}</p>
    </div>
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
  {title:"Discrétion",text:"Un bien privé exige une présence mesurée. Nous protégeons les habitudes du propriétaire, limitons les informations partagées et choisissons chaque interlocuteur avec soin.",proof:"Vous restez informé, jamais exposé."},
  {title:"Excellence",text:"La qualité ne dépend pas d’un grand geste ponctuel, mais d’un standard répété. Préparation, contrôle et suivi conservent la même exigence à chaque intervention.",proof:"Le niveau attendu devient une constance."},
  {title:"Attention",text:"Nous regardons ce qui pourrait devenir un problème avant qu’il ne le devienne : un équipement, une arrivée tardive, un détail de présentation ou un besoin particulier.",proof:"Chaque détail anticipé protège votre sérénité."},
  {title:"Fiabilité",text:"Une action n’a de valeur que si elle est réalisée, vérifiée et expliquée. Les décisions importantes sont coordonnées et restituées avec clarté.",proof:"Vous savez ce qui a été fait, quand et pourquoi."},
  {title:"Connaissance locale",text:"Gênes et la Ligurie ont leurs accès, leurs saisons, leurs usages et leurs artisans. Cette connaissance permet d’agir vite sans agir au hasard.",proof:"La bonne réponse vient du bon réseau, au bon moment."},
];

export function ValuesStory(){
  const [active,setActive]=useState(0);
  const value=values[active];
  return <div className="values-manifest">
    <div className="values-feature">
      <span>0{active+1} / 05</span>
      <h3>{value.title}</h3>
      <p>{value.text}</p>
      <strong>{value.proof}</strong>
    </div>
    <div className="values-selector" role="tablist" aria-label="Valeurs AUREVIA">
      {values.map((item,index)=><button key={item.title} type="button" role="tab" aria-selected={active===index} onClick={()=>setActive(index)}><span>0{index+1}</span><b>{item.title}</b><i aria-hidden="true">→</i></button>)}
    </div>
  </div>;
}

const storyChapters = [
  {title:"La distance ne devrait jamais devenir une inquiétude",kicker:"Le point de départ",text:"Une propriété inoccupée ne cesse pas de vivre. Une météo change, un équipement fatigue, une arrivée se prépare. À distance, ces détails prennent une place immense. AUREVIA commence précisément là : lorsque le propriétaire veut retrouver de la sérénité sans perdre le lien avec son bien.",signature:"Remplacer l’incertitude par une présence fiable."},
  {title:"Comprendre le lieu avant de proposer une méthode",kicker:"L’écoute",text:"Chaque propriété possède son rythme, ses fragilités et son histoire. Nous observons les usages, les périodes d’occupation, les attentes et les contraintes avant de définir le cadre de gestion. La solution se construit autour du lieu — jamais l’inverse.",signature:"Écouter d’abord. Organiser ensuite."},
  {title:"Faire de l’invisible une véritable signature",kicker:"Le geste juste",text:"Une maison prête au bon moment. Une lumière accueillante. Un linge parfaitement disposé. Une intervention résolue sans bruit. Le luxe AUREVIA se trouve dans cette précision silencieuse qui protège le bien et rend chaque séjour naturellement fluide.",signature:"L’excellence se remarque surtout lorsqu’elle ne se voit pas."},
  {title:"Installer une confiance qui dure",kicker:"La continuité",text:"La confiance naît de la répétition : une information claire, une décision expliquée, un engagement tenu. Au fil du temps, AUREVIA devient le relais local du propriétaire — une présence constante, attentive et responsable sur la Riviera ligure.",signature:"Vous restez maître de votre bien, sans porter son quotidien."},
];

export function AboutStoryJourney(){
  const [active,setActive]=useState(0);
  const shell=useRef<HTMLDivElement>(null);
  const chapter=storyChapters[active];
  useEffect(()=>{
    function update(){
      const element=shell.current;
      if(!element)return;
      const rect=element.getBoundingClientRect();
      const available=Math.max(1,element.offsetHeight-window.innerHeight);
      const progress=Math.min(1,Math.max(0,-rect.top/available));
      setActive(Math.min(storyChapters.length-1,Math.floor(progress*storyChapters.length)));
    }
    update();
    window.addEventListener("scroll",update,{passive:true});
    window.addEventListener("resize",update);
    return()=>{window.removeEventListener("scroll",update);window.removeEventListener("resize",update)};
  },[]);
  return <div className="about-story-shell" ref={shell}>
    <div className="about-story-sticky">
      <div className="about-story-progress" aria-hidden="true">{storyChapters.map((_,index)=><i key={index} className={index===active?"active":""}/>)}</div>
      <article className="about-story-card">
        <div className="about-story-number"><span>0{active+1}</span><small>/ 04</small></div>
        <p className="eyebrow">{chapter.kicker}</p>
        <h3>{chapter.title}</h3>
        <p>{chapter.text}</p>
        <blockquote>{chapter.signature}</blockquote>
      </article>
      <p className="about-story-hint">{active<3?"Faites défiler pour poursuivre l’histoire.":"La confiance est installée — poursuivez la découverte."}</p>
    </div>
  </div>;
}
