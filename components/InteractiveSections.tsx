"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Star } from "lucide-react";
import { useLocale } from "@/components/LocaleController";
import { translate } from "@/lib/i18n";

const method = [
  {title:"Révéler le potentiel du lieu",time:"Premier échange privé · 45 à 60 min",text:"Nous découvrons la propriété dans son ensemble : son caractère, ses usages, vos périodes d’occupation et vos ambitions. Cette lecture attentive pose un cadre fidèle au lieu comme à vos exigences.",points:["Lecture précise du potentiel","Inventaire des attentions essentielles","Définition d’un cadre de confiance"]},
  {title:"Construire une stratégie singulière",time:"Étude personnalisée · 2 à 4 jours",text:"Positionnement, calendrier, règles de séjour et stratégie tarifaire sont dessinés comme un ensemble cohérent. Chaque décision préserve la désirabilité du bien tout en soutenant sa performance.",points:["Analyse confidentielle du marché local","Tarification pensée selon chaque saison","Objectifs définis et suivis avec clarté"]},
  {title:"Mettre la propriété en scène",time:"Préparation dédiée · 1 à 3 semaines",text:"Nous préparons chaque détail qui façonne la première impression : présentation, équipements, linge, photographie et parcours d’accueil. La propriété devient immédiatement visible, désirable et prête à recevoir.",points:["Plan de lancement entièrement personnalisé","Mise en valeur respectueuse de l’identité du lieu","Expérience voyageur pensée sans rupture"]},
  {title:"Orchestrer, suivre et valoriser",time:"Accompagnement continu",text:"Réservations, voyageurs, prestataires, incidents et performances sont pilotés par un interlocuteur unique. Vous conservez une vision claire de votre propriété sans avoir à en porter le quotidien.",points:["Optimisation attentive et régulière","Supervision discrète de chaque intervention","Compte rendu propriétaire clair et privilégié"]},
];

function useScrollStage<T extends HTMLElement>(count: number, mobileOnly = false) {
  const shell = useRef<T>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback((index: number) => {
    const element = shell.current;
    if (!element) return;
    const viewport = window.visualViewport?.height ?? window.innerHeight;
    const top = window.scrollY + element.getBoundingClientRect().top;
    const available = Math.max(1, element.offsetHeight - viewport);
    const target = Math.min(count - 1, Math.max(0, index));
    window.scrollTo({
      top: top + available * ((target + 0.5) / count),
      behavior: "smooth",
    });
  }, [count]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (mobileOnly && !window.matchMedia("(max-width: 767px)").matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const element = shell.current;
        if (!element) return;
        const viewport = window.visualViewport?.height ?? window.innerHeight;
        const rect = element.getBoundingClientRect();
        const available = Math.max(1, element.offsetHeight - viewport);
        const travelled = Math.min(available, Math.max(0, -rect.top));
        const next = Math.min(count - 1, Math.floor((travelled / available) * count));
        setActive((current) => current === next ? current : next);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    window.visualViewport?.addEventListener("scroll", update, { passive: true });
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      window.visualViewport?.removeEventListener("scroll", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [count, mobileOnly]);

  return { shell, active, setActive, goTo };
}

export function MethodJourney(){
  const {locale}=useLocale();
  const tr=(text:string)=>translate(text,locale);
  const {shell,active,goTo}=useScrollStage<HTMLDivElement>(method.length);
  const item=method[active];
  return <div className="method-scroll-shell" ref={shell} data-no-translate>
    <div className="method-scroll">
      <div className="method-progress" aria-hidden="true">{method.map((_,index)=><i key={index} className={index===active?"active":""}/>)}</div>
      <div className="method-detail" role="tabpanel" key={`method-${active}`} aria-live="polite">
        <div className="method-index"><span>0{active+1}</span><small>/ 04</small></div>
        <span>{tr(item.time)}</span><h3>{tr(item.title)}</h3><p>{tr(item.text)}</p>
        <ul>{item.points.map(point=><li key={point}><Check size={15}/>{tr(point)}</li>)}</ul>
        <div className="method-controls"><button type="button" disabled={active===0} onClick={()=>goTo(active-1)}>{tr("Étape précédente")}</button><button type="button" disabled={active===3} onClick={()=>goTo(active+1)}>{tr("Étape suivante")}</button></div>
        <Link className="text-link" href="/valutazione">{tr("Échanger en toute confidentialité")} <ArrowRight size={15}/></Link>
      </div>
      <p className="method-hint">{tr(active<3?"Poursuivez votre lecture pour découvrir l’étape suivante.":"Votre accompagnement peut maintenant commencer.")}</p>
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

const clarityMoments = [
  {kicker:"Dès le départ",title:"Vous savez où nous allons.",text:"Nous posons le cadre, les priorités et les règles de décision avant la première réservation. Vous savez ce qui sera pris en charge, ce qui vous sera soumis et comment votre propriété sera suivie.",signature:"Une direction claire avant la première action."},
  {kicker:"Au quotidien",title:"Vous n’avez plus à rester disponible.",text:"Les voyageurs, les prestataires et les imprévus passent par AUREVIA. Vous ne recevez plus le bruit de l’exploitation : seulement l’information utile, au moment où elle compte.",signature:"Le quotidien avance sans interrompre le vôtre."},
  {kicker:"Quand il faut décider",title:"Vous avez les faits, pas l’urgence.",text:"Lorsqu’une dépense, un incident ou un arbitrage exige votre accord, nous vous présentons la situation, les options et notre recommandation. Vous décidez avec une vision complète.",signature:"Votre décision reste souveraine. La pression disparaît."},
  {kicker:"Dans la durée",title:"Vous voyez ce qui a été fait et pourquoi.",text:"Les actions menées, les performances et les points d’attention sont réunis dans une lecture simple. Vous gardez une vision nette de votre propriété sans reconstituer vous-même son activité.",signature:"Rien à surveiller. Rien à deviner."},
];

export function OwnerClarityJourney(){
  const {locale}=useLocale();
  const tr=(text:string)=>translate(text,locale);
  const {shell,active}=useScrollStage<HTMLDivElement>(clarityMoments.length);
  const moment=clarityMoments[active];
  return <div className="owner-clarity-shell" ref={shell} data-no-translate>
    <div className="owner-clarity-sticky">
      <div className="owner-clarity-heading">
        <p className="eyebrow">{tr("Votre tranquillité, concrètement")}</p>
        <h2>{tr("Vous n’avez pas besoin de tout suivre pour tout savoir.")}</h2>
        <p>{tr("AUREVIA filtre le bruit, porte le quotidien et vous rend la bonne information au bon moment.")}</p>
        <p className="owner-note">{tr("Les estimations restent indicatives : aucun rendement n’est garanti. Ménage, linge, consommables et interventions techniques sont facturés au réel, sans marge.")}</p>
      </div>
      <div className="owner-clarity-progress" aria-hidden="true">{clarityMoments.map((_,index)=><i key={index} className={index===active?"active":""}/>)}</div>
      <article className="owner-clarity-card" key={`clarity-${active}`} aria-live="polite">
        <div><span>0{active+1}</span><small>/ 04</small></div>
        <p className="eyebrow">{tr(moment.kicker)}</p>
        <h3>{tr(moment.title)}</h3>
        <p>{tr(moment.text)}</p>
        <strong>{tr(moment.signature)}</strong>
      </article>
      <p className="owner-clarity-hint">{tr(active<3?"Continuez à faire défiler.":"Vous gardez la maîtrise, sans porter la gestion.")}</p>
    </div>
  </div>;
}

const values = [
  {title:"Discrétion",headline:"Vous nous confiez plus qu’une adresse.",text:"Derrière une porte, il y a vos habitudes, vos souvenirs et une part de votre intimité. Nous entrons dans cet univers avec retenue. Seules les personnes nécessaires savent ce qu’elles doivent savoir, et rien de plus.",feeling:"Votre vie privée reste exactement là où elle doit être : chez vous."},
  {title:"Excellence",headline:"Vous ne devriez pas avoir à vérifier.",text:"Une maison prête, un linge impeccable, une lumière allumée au bon moment : notre exigence se niche dans les détails que vous n’aurez jamais à réclamer. Nous contrôlons avant que vous ayez besoin de demander.",feeling:"Vous arrivez. Tout est à sa place."},
  {title:"Attention",headline:"Votre bien ne sera jamais un dossier parmi d’autres.",text:"Nous apprenons ce qui compte pour vous : la fragilité d’un meuble, la façon dont la maison doit être préparée, les attentions réservées à vos proches. Cette mémoire du lieu permet une gestion véritablement personnelle.",feeling:"Vous êtes compris sans devoir tout réexpliquer."},
  {title:"Fiabilité",headline:"Quand quelque chose arrive, quelqu’un répond.",text:"La confiance se construit lorsque la promesse tient aussi les jours compliqués. Nous prenons la situation en main, coordonnons les bonnes personnes et revenons vers vous avec une réponse claire — pas avec un problème de plus.",feeling:"Même à distance, vous n’êtes jamais seul face à l’imprévu."},
  {title:"Connaissance locale",headline:"À Gênes, savoir qui appeler change tout.",text:"Un artisan fiable à Castelletto, un accès délicat dans le centre historique, une urgence à Nervi : notre ancrage local donne à votre propriété les bons relais, sans tâtonnement ni intermédiaire inutile.",feeling:"Votre bien est entouré comme s’il était le nôtre."},
];

export function ValuesStory(){
  const {locale}=useLocale();
  const tr=(text:string)=>translate(text,locale);
  const [active,setActive]=useState(0);
  const value=values[active];
  return <div className="values-scroll-shell" data-no-translate>
    <div className="values-manifest">
      <div className="values-feature" key={`value-${active}`} aria-live="polite">
        <span>0{active+1} / 05</span>
        <p className="values-feature-name">{tr(value.title)}</p>
        <h3>{tr(value.headline)}</h3>
        <p>{tr(value.text)}</p>
        <p className="values-feeling">{tr(value.feeling)}</p>
      </div>
      <div className="values-selector" role="tablist" aria-label={tr("Valeurs AUREVIA")}>
        {values.map((item,index)=><button key={item.title} type="button" role="tab" aria-selected={active===index} onClick={()=>setActive(index)}><span>0{index+1}</span><b>{tr(item.title)}</b><i aria-hidden="true">→</i></button>)}
      </div>
    </div>
  </div>;
}

const storyChapters = [
  {title:"Quitter votre bien sans l’emporter avec vous",kicker:"Le départ",text:"À distance, la moindre question peut rester en tête. Votre bien mérite une présence capable de veiller, de vérifier et d’agir sur place.",signature:"Vous partez. Votre tranquillité reste intacte."},
  {title:"Ne plus subir chaque imprévu",kicker:"L’absence",text:"Voyageurs, équipements et prestataires demandent une attention continue. Nous absorbons cette charge avant qu’elle n’interrompe votre quotidien.",signature:"Votre bien reste suivi, sans devenir une préoccupation."},
  {title:"Confier sans perdre le contrôle",kicker:"Le relais",text:"Nous apprenons vos exigences et les particularités du lieu. Vous êtes informé lorsqu’une décision compte, sans être sollicité pour chaque détail.",signature:"Vous gardez la maîtrise. Nous portons le quotidien."},
  {title:"Retrouver votre bien, simplement",kicker:"Le retour",text:"À votre arrivée, tout est prêt, suivi et fidèle à vos attentes. Vous profitez de votre bien au lieu de reprendre sa gestion.",signature:"Vous revenez chez vous. Rien n’est à rattraper."},
];

export function AboutStoryJourney(){
  const {locale}=useLocale();
  const tr=(text:string)=>translate(text,locale);
  const {shell,active}=useScrollStage<HTMLDivElement>(storyChapters.length);
  const chapter=storyChapters[active];
  return <div className="about-story-shell" ref={shell} data-no-translate>
    <div className="about-story-sticky">
      <div className="about-story-progress" aria-hidden="true">{storyChapters.map((_,index)=><i key={index} className={index===active?"active":""}/>)}</div>
      <article className="about-story-card" key={`story-${active}`} aria-live="polite">
        <div className="about-story-number"><span>0{active+1}</span><small>/ 04</small></div>
        <p className="eyebrow">{tr(chapter.kicker)}</p>
        <h3>{tr(chapter.title)}</h3>
        <p>{tr(chapter.text)}</p>
        <blockquote>{tr(chapter.signature)}</blockquote>
      </article>
      <p className="about-story-hint">{tr(active<3?"Faites défiler pour poursuivre le récit.":"Vous êtes revenu chez vous.")}</p>
    </div>
  </div>;
}
