"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ItalianContent } from "@/components/public-site/ItalianContent";

const method = [
  {
    title: "Auditer le bien",
    time: "Découverte",
    text: "Nous visitons le bien, relevons ses caractéristiques et comprenons vos contraintes avant de définir le projet locatif.",
    outcome: "Le potentiel et les contraintes du bien sont connus avant toute proposition.",
    points: ["Visite complète", "Accès et équipements", "État et points d’attention", "Capacité d’accueil", "Périodes propriétaires", "Contraintes identifiées"],
  },
  {
    title: "Définir la stratégie",
    time: "Positionnement",
    text: "Le quartier, la saison, le type de voyageurs et les charges servent à établir un positionnement réaliste et une première projection.",
    outcome: "Le bien dispose d’un positionnement réaliste, expliqué et partagé.",
    points: ["Analyse du quartier", "Clientèle cible", "Tarif moyen envisagé", "Taux d’occupation cible", "Charges estimées", "Objectif de rentabilité"],
  },
  {
    title: "Préparer le bien",
    time: "Mise en place",
    text: "Nous réunissons les éléments nécessaires pour accueillir, vendre et exploiter le bien dans de bonnes conditions dès l’ouverture.",
    outcome: "Tout est prêt pour accueillir les voyageurs sans improvisation.",
    points: ["Équipements vérifiés", "Accès et clés organisés", "Ménage initial", "Linge et consommables", "Consignes du bien", "Prestataires référencés"],
  },
  {
    title: "Lancer la location",
    time: "Mise en marché",
    text: "L’annonce, le calendrier et le tarif de départ sont configurés pour obtenir les premières réservations sans dégrader le positionnement du bien.",
    outcome: "Le bien arrive sur le marché avec une annonce, un calendrier et un tarif cohérents.",
    points: ["Annonce structurée", "Photos et informations", "Calendrier ouvert", "Tarif de lancement", "Règles de séjour", "Canaux de réservation"],
  },
  {
    title: "Gérer les séjours",
    time: "Exploitation",
    text: "Chaque réservation suit un processus précis, de la confirmation au départ, avec un interlocuteur local pour les voyageurs.",
    outcome: "Chaque séjour suit le même cadre, du premier message au contrôle final.",
    points: ["Réservations suivies", "Messages voyageurs", "Préparation des arrivées", "Assistance sur place", "Ménage et linge", "Contrôle après départ"],
  },
  {
    title: "Lire les résultats",
    time: "Analyse",
    text: "Les données réelles remplacent progressivement les hypothèses afin d’identifier ce qui améliore le revenu, l’occupation et la qualité des séjours.",
    outcome: "Vous savez ce qui fonctionne, ce qui coûte et ce qui doit évoluer.",
    points: ["Taux d’occupation", "Prix moyen par nuit", "Revenu généré", "Coûts d’exploitation", "Avis voyageurs", "Incidents récurrents"],
  },
  {
    title: "Optimiser la gestion",
    time: "Régime stabilisé",
    text: "Tarifs, durées de séjour et tâches récurrentes sont ajustés puis automatisés, tout en conservant un contrôle humain sur le bien.",
    outcome: "La gestion gagne en efficacité sans perdre le contrôle humain.",
    points: ["Tarification ajustée", "Durées optimisées", "Messages automatisés", "Tâches planifiées", "Prestataires coordonnés", "Suivi propriétaire régulier"],
  },
];

export function MethodJourney() {
  const [active, setActive] = useState(0);

  const current = method[active];

  return (
    <ItalianContent><div className="method-light-journey method-editorial-journey">
      <div className="method-light-path method-seven-steps" role="tablist" aria-label="Les étapes de l’accompagnement AUREVIA">
        <span className="method-light-progress" style={{ width: `${active * (100 / (method.length - 1))}%` }} aria-hidden="true" />
        {method.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            id={`method-tab-${index}`}
            aria-selected={active === index}
            aria-controls="method-active-panel"
            className={`${index === active ? "is-active" : ""} ${index < active ? "is-complete" : ""}`}
            onClick={() => setActive(index)}
          >
            <i aria-hidden="true" />
            <span>0{index + 1}</span>
            <small>{item.time}</small>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>

      <div className="method-active-panel" id="method-active-panel" role="tabpanel" aria-labelledby={`method-tab-${active}`} key={current.title}>
        <span className="method-active-number" aria-hidden="true">0{active + 1}</span>
        <div className="method-active-copy">
          <p className="method-step-position"><span>Étape</span><b>0{active + 1} / 0{method.length}</b><i aria-hidden="true">·</i><em>{current.time}</em></p>
          <h3>{current.title}</h3>
          <p className="method-step-description">{current.text}</p>
          <div className="method-step-outcome"><span>Résultat de l’étape</span><strong>{current.outcome}</strong></div>
        </div>
        <div className="method-active-deliverables"><p>Ce qui est mis en place</p><ul>{current.points.map((point) => <li key={point}><Check size={15} />{point}</li>)}</ul></div>
      </div>

      <div className="method-light-footer">
        <div className="method-light-controls">
          <button className="method-nav-button" type="button" aria-label="Étape précédente" onClick={() => setActive((active - 1 + method.length) % method.length)}><ArrowLeft size={16} /><span>Précédente</span></button>
          <span className="method-light-count" aria-live="polite"><b>0{active + 1}</b><i aria-hidden="true">/</i><span>0{method.length}</span></span>
          <button className="method-nav-button" type="button" aria-label="Étape suivante" onClick={() => setActive((active + 1) % method.length)}><span>Suivante</span><ArrowRight size={16} /></button>
        </div>
        <Link className="text-link concierge-method-link" href="/valutazione">Confier mon bien <ArrowRight size={15} /></Link>
      </div>
    </div></ItalianContent>
  );
}

const ownerPromiseSteps = [
  { title: "Comprendre votre bien", time: "Diagnostic", text: "Nous visitons le bien, évaluons son potentiel locatif et relevons tout ce qui compte pour l’exploiter sans en perdre le caractère.", outcome: "Le potentiel et les contraintes du bien sont connus avant toute proposition.", points: ["État et équipements vérifiés", "Contraintes du lieu relevées", "Potentiel locatif étudié", "Priorités du propriétaire recueillies"] },
  { title: "Définir notre cadre", time: "Organisation", text: "Nous fixons ensemble ce que AUREVIA gère, ce que vous souhaitez conserver et les dépenses qui demandent votre validation.", outcome: "Les rôles, les contacts et la marche à suivre sont définis avant le premier séjour.", points: ["Services inclus détaillés", "Budget et seuils définis", "Périodes personnelles réservées", "Rythme des échanges choisi"] },
  { title: "Mettre le bien en marché", time: "Commercialisation", text: "L’annonce, les photographies, le calendrier et la stratégie tarifaire sont préparés pour lancer la location sur des bases solides.", outcome: "Le bien arrive sur le marché avec une annonce, un calendrier et un tarif cohérents.", points: ["Annonce créée ou optimisée", "Présentation du bien travaillée", "Tarif de lancement défini", "Calendrier configuré"] },
  { title: "Piloter les locations", time: "Exploitation", text: "Nous suivons les réservations, préparons les arrivées et accompagnons les voyageurs du premier message jusqu’au départ.", outcome: "Chaque séjour suit le même cadre, du premier message au contrôle final.", points: ["Réservations centralisées", "Arrivées coordonnées", "Voyageurs accompagnés", "Départs contrôlés"] },
  { title: "Prendre soin du bien", time: "Entretien", text: "Entre deux séjours, AUREVIA coordonne le ménage, le linge, les réassorts, les vérifications et les interventions nécessaires.", outcome: "Tout est prêt pour accueillir les voyageurs sans improvisation.", points: ["Ménage et linge suivis", "Consommables réapprovisionnés", "État du bien contrôlé", "Maintenance coordonnée"] },
  { title: "Suivre les comptes", time: "Administration", text: "Revenus, commissions, dépenses, factures et événements importants sont regroupés dans un suivi propriétaire facile à relire.", outcome: "Vous savez ce qui fonctionne, ce qui coûte et ce qui doit évoluer.", points: ["Revenus et occupation reportés", "Dépenses et justificatifs classés", "Écarts documentés", "Compte rendu périodique"] },
  { title: "Optimiser dans la durée", time: "Performance", text: "Nous utilisons les réservations, les retours voyageurs et les coûts réels pour améliorer les tarifs, l’organisation et la rentabilité du bien.", outcome: "La gestion gagne en efficacité sans perdre le contrôle humain.", points: ["Tarifs et durées ajustés", "Taux d’occupation suivi", "Coûts d’exploitation observés", "Actions d’amélioration proposées"] },
];

export function OwnerPromiseJourney() {
  const [active, setActive] = useState(0);

  const current = ownerPromiseSteps[active];

  return <ItalianContent><div className="method-light-journey method-editorial-journey owner-promise-journey">
    <div className="method-light-path method-seven-steps" role="tablist" aria-label="Les engagements de l’accompagnement AUREVIA">
      <span className="method-light-progress" style={{ width: `${active * (100 / (ownerPromiseSteps.length - 1))}%` }} aria-hidden="true" />
      {ownerPromiseSteps.map((item, index) => <button
        key={item.title}
        type="button"
        role="tab"
        id={`owner-promise-tab-${index}`}
        aria-selected={active === index}
        aria-controls="owner-promise-panel"
        className={`${index === active ? "is-active" : ""} ${index < active ? "is-complete" : ""}`}
        onClick={() => setActive(index)}
      ><i aria-hidden="true" /><span>0{index + 1}</span><small>{item.time}</small><strong>{item.title}</strong></button>)}
    </div>

    <div className="method-active-panel" id="owner-promise-panel" role="tabpanel" aria-labelledby={`owner-promise-tab-${active}`} key={current.title}>
      <span className="method-active-number" aria-hidden="true">0{active + 1}</span>
      <div className="method-active-copy">
        <p className="method-step-position"><span>Étape</span><b>0{active + 1} / 0{ownerPromiseSteps.length}</b><i aria-hidden="true">·</i><em>{current.time}</em></p>
        <h3>{current.title}</h3>
        <p className="method-step-description">{current.text}</p>
        <div className="method-step-outcome"><span>Résultat de l’étape</span><strong>{current.outcome}</strong></div>
      </div>
      <div className="method-active-deliverables"><p>Ce qui est mis en place</p><ul>{current.points.map((point) => <li key={point}><Check size={15} />{point}</li>)}</ul></div>
    </div>

    <div className="method-light-footer">
      <div className="method-light-controls">
        <button className="method-nav-button" type="button" aria-label="Engagement précédent" onClick={() => setActive((active - 1 + ownerPromiseSteps.length) % ownerPromiseSteps.length)}><ArrowLeft size={16} /><span>Précédente</span></button>
        <span className="method-light-count" aria-live="polite"><b>0{active + 1}</b><i aria-hidden="true">/</i><span>0{ownerPromiseSteps.length}</span></span>
        <button className="method-nav-button" type="button" aria-label="Engagement suivant" onClick={() => setActive((active + 1) % ownerPromiseSteps.length)}><span>Suivante</span><ArrowRight size={16} /></button>
      </div>
      <Link className="text-link concierge-method-link" href="/valutazione">Nous présenter le bien <ArrowRight size={15} /></Link>
    </div>
  </div></ItalianContent>;
}

const reviews = [
  { initials: "MG", place: "Genova", quote: "Je sais qui suit le bien, ce qui a été fait et quand une décision m’appartient." },
  { initials: "CL", place: "Nervi", quote: "Je ne passe plus d’un prestataire à l’autre : AUREVIA coordonne et revient vers moi avec une réponse claire." },
  { initials: "AR", place: "Castelletto", quote: "Même à distance, je reçois les informations importantes sans devoir surveiller chaque détail du séjour." },
  { initials: "SB", place: "Albaro", quote: "Les voyageurs ont un contact sur place et je ne suis sollicité que lorsque cela compte vraiment." },
];

export function ReviewCards() {
  const [active, setActive] = useState(0);
  const visible = [reviews[active], reviews[(active + 1) % reviews.length], reviews[(active + 2) % reviews.length]];

  return (
    <ItalianContent><div className="review-carousel aurevia-review-carousel">
      <button className="review-arrow review-arrow-left" type="button" onClick={() => setActive((active - 1 + reviews.length) % reviews.length)} aria-label="Avis précédents"><ArrowLeft /></button>
      <div className="review-grid" aria-live="polite">
        {visible.map((review, index) => <article className="review-card" key={`${review.initials}-${index}`}>
          <div className="review-head"><div className="review-avatar">{review.initials}</div><div><strong>Retour propriétaire</strong><span>{review.place}</span></div></div>
          <div className="review-stars" aria-label="5 étoiles">{Array.from({ length: 5 }).map((_, star) => <Star key={star} size={15} fill="currentColor" aria-hidden="true" />)}</div>
          <blockquote>“{review.quote}”</blockquote>
          <small>Témoignage de démonstration, en attente d’un avis vérifié.</small>
        </article>)}
      </div>
      <button className="review-arrow review-arrow-right" type="button" onClick={() => setActive((active + 1) % reviews.length)} aria-label="Avis suivants"><ArrowRight /></button>
    </div></ItalianContent>
  );
}

const clarityMoments = [
  { kicker: "Avant de commencer", title: "Tout est clair.", text: "Nous définissons par écrit les missions confiées à AUREVIA, les dépenses facturées séparément, vos périodes personnelles et le rythme des nouvelles. Chacun sait ainsi quoi faire avant la première réservation.", result: "Un cadre de gestion lisible, validé ensemble et facile à retrouver." },
  { kicker: "Pendant les séjours", title: "Nous prenons le relais.", text: "AUREVIA centralise les messages voyageurs, prépare les arrivées et coordonne les intervenants jusqu’au contrôle de départ. Vous n’avez plus à relancer plusieurs personnes pour faire avancer une situation.", result: "Un quotidien géré sur place, sans dispersion ni microgestion." },
  { kicker: "Quand il faut décider", title: "Vous gardez le dernier mot.", text: "Nous vérifions la situation, réunissons les faits et vous présentons les solutions avec leur coût et leur degré d’urgence. Aucune action importante n’est engagée sans un choix réellement éclairé.", result: "Des décisions rapides, documentées et toujours prises au bon niveau." },
  { kicker: "Dans la durée", title: "Vous savez où en est le bien.", text: "Réservations, revenus, interventions, dépenses et points d’attention sont regroupés dans une lecture propriétaire cohérente. Les informations utiles restent accessibles et servent à améliorer la gestion au fil des séjours.", result: "Une vision continue du bien, de son état et de sa performance." },
];

export function OwnerClarityJourney() {
  const [activeMoment, setActiveMoment] = useState(0);
  const scrollRoot = useRef<HTMLDivElement>(null);
  const { kicker, title, text, result } = clarityMoments[activeMoment];

  useEffect(() => {
    const root = scrollRoot.current;
    if (!root || window.matchMedia("(max-width: 800px)").matches) return;
    const triggers = Array.from(root.querySelectorAll<HTMLElement>("[data-clarity-step]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveMoment(Number((entry.target as HTMLElement).dataset.clarityStep));
      });
    }, { rootMargin: "-44% 0px -44% 0px", threshold: 0 });
    triggers.forEach((trigger) => observer.observe(trigger));
    return () => observer.disconnect();
  }, []);

  const chooseMoment = (index: number) => {
    setActiveMoment(index);
    const trigger = scrollRoot.current?.querySelector<HTMLElement>(`[data-clarity-step="${index}"]`);
    trigger?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  };

  return <ItalianContent><div className="owner-clarity-scroll" ref={scrollRoot}>
    <div className="owner-clarity-editorial" data-step={`0${activeMoment + 1}`}>
      <span className="journey-top-progress" style={{ "--journey-progress": `${(activeMoment + 1) / clarityMoments.length}` } as CSSProperties} aria-hidden="true" />
      <div className="owner-clarity-copy" id="owner-clarity-panel" role="tabpanel" aria-labelledby={`owner-clarity-tab-${activeMoment}`}>
        <p className="owner-clarity-overline">Ce que vous gardez</p>
        <p className="owner-clarity-kicker">{kicker}</p>
        <h2 key={`title-${activeMoment}`}>{title}</h2>
        <p className="owner-clarity-text" key={`text-${activeMoment}`}>{text}</p>
        <div className="owner-clarity-result" key={`result-${activeMoment}`}><span>Ce que cela change</span><strong>{result}</strong></div>
      </div>
      <div className="owner-clarity-nav" role="tablist" aria-label="Les moments de votre accompagnement">
        {clarityMoments.map(({ kicker: moment, title: momentTitle }, index) => <button
          type="button"
          role="tab"
          id={`owner-clarity-tab-${index}`}
          aria-controls="owner-clarity-panel"
          aria-selected={activeMoment === index}
          tabIndex={activeMoment === index ? 0 : -1}
          className={activeMoment === index ? "is-active" : ""}
          key={momentTitle}
          onClick={() => chooseMoment(index)}
          onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
            event.preventDefault();
            const direction = event.key === "ArrowDown" ? 1 : -1;
            const next = (index + direction + clarityMoments.length) % clarityMoments.length;
            chooseMoment(next);
            document.getElementById(`owner-clarity-tab-${next}`)?.focus({ preventScroll: true });
          }}
        >
          <span className="owner-clarity-number">0{index + 1}</span>
          <span className="owner-clarity-label"><small>{moment}</small>{momentTitle}</span>
          <span className="owner-clarity-mark" aria-hidden="true" />
        </button>)}
      </div>
    </div>
    <div className="owner-clarity-scroll-triggers" aria-hidden="true">
      {clarityMoments.map(({ title: momentTitle }, index) => <span data-clarity-step={index} key={momentTitle} />)}
    </div>
  </div></ItalianContent>;
}

const values = [
  { label: "Clarté", title: "Tout est clair.", text: "Le périmètre, les responsabilités, les frais séparés et les seuils de décision sont posés avant d’agir. Après chaque action importante, vous recevez les faits utiles sans jargon ni information dispersée.", result: "Vous comprenez ce qui est fait, pourquoi cela l’est et ce qui attend votre accord." },
  { label: "Réactivité", title: "Nous agissons vite.", text: "Un imprévu est d’abord vérifié sur place, puis confié au bon intervenant avec une consigne précise. AUREVIA suit ensuite la résolution et vous alerte immédiatement si une décision vous revient.", result: "Les petits sujets sont traités avant de devenir des urgences coûteuses." },
  { label: "Proximité", title: "Nous sommes sur place.", text: "Votre interlocuteur connaît Genova, les accès du bien, son fonctionnement et le réseau de personnes capables d’intervenir. Cette connaissance évite de repartir de zéro à chaque demande.", result: "Le bien est suivi par quelqu’un qui connaît réellement son contexte." },
  { label: "Fiabilité", title: "Chaque action est suivie.", text: "Toute demande reçoit un responsable, une prochaine étape et une confirmation de clôture. Contrôle, intervention ou information importante : rien ne disparaît entre deux messages ou deux séjours.", result: "Vous savez qui agit, où en est le sujet et comment il s’est terminé." },
  { label: "Simplicité", title: "Un seul interlocuteur.", text: "Voyageurs, ménage, maintenance, calendrier et imprévus convergent vers une même coordination. Vous échangez avec AUREVIA, qui organise ensuite les bonnes personnes sans vous exposer à toute la chaîne opérationnelle.", result: "Moins d’interlocuteurs, moins de relances et une lecture beaucoup plus simple." },
];

export function ValuesStory() {
  const [active, setActive] = useState(0);
  const scrollRoot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scrollRoot.current;
    if (!root || window.matchMedia("(max-width: 980px)").matches) return;
    const triggers = Array.from(root.querySelectorAll<HTMLElement>("[data-value-step]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.valueStep));
      });
    }, { rootMargin: "-44% 0px -44% 0px", threshold: 0 });
    triggers.forEach((trigger) => observer.observe(trigger));
    return () => observer.disconnect();
  }, []);

  const chooseValue = (index: number) => {
    setActive(index);
    const trigger = scrollRoot.current?.querySelector<HTMLElement>(`[data-value-step="${index}"]`);
    trigger?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  };

  return <ItalianContent><div className="about-values-scroll" ref={scrollRoot}>
    <div className="about-values-editorial" id="principes-aurevia-scroll" data-step={`0${active + 1}`}>
      <span className="journey-top-progress" style={{ "--journey-progress": `${(active + 1) / values.length}` } as CSSProperties} aria-hidden="true" />
      <div className="about-value-panel" id="value-panel" role="tabpanel" aria-labelledby={`value-tab-${active}`}>
        <span>0{active + 1} — 05</span><p>{values[active].label}</p><h3 key={`value-${active}`}>{values[active].title}</h3><div className="about-value-detail" key={`detail-${active}`}><p>{values[active].text}</p><div className="about-value-result"><span>Ce que cela change</span><strong>{values[active].result}</strong></div></div>
      </div>
      <div className="about-value-nav" role="tablist" aria-label="Les repères AUREVIA">{values.map(({ label: title, title: statement }, index) => <button
        key={title}
        id={`value-tab-${index}`}
        type="button"
        role="tab"
        aria-selected={active === index}
        aria-controls="value-panel"
        tabIndex={active === index ? 0 : -1}
        className={active === index ? "is-active" : ""}
        onClick={() => chooseValue(index)}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          const direction = event.key === "ArrowDown" ? 1 : -1;
          const next = (index + direction + values.length) % values.length;
          chooseValue(next);
          document.getElementById(`value-tab-${next}`)?.focus({ preventScroll: true });
        }}
      ><span>0{index + 1}</span><span><b>{title}</b><small>{statement}</small></span><i aria-hidden="true" /></button>)}</div>
    </div>
    <div className="about-values-scroll-triggers" aria-hidden="true">
      {values.map(({ label: title }, index) => <span data-value-step={index} key={title} />)}
    </div>
  </div></ItalianContent>;
}

const storyChapters = [
  ["01", "Pourquoi agir", "À distance, tout repose sur vous", "Sans personne sur place, chaque question, chaque prestataire et chaque imprévu finit par interrompre votre journée."],
  ["02", "Pourquoi AUREVIA", "Un relais évite que tout devienne urgent", "Une même personne connaît le bien, coordonne les intervenants et règle les sujets avant qu’ils ne s’accumulent."],
  ["03", "Pourquoi cela compte", "Vous restez propriétaire, pas gestionnaire", "Vous gardez les choix importants, sans devoir porter les messages, les relances et l’organisation de chaque séjour."],
];

export function AboutStoryJourney() {
  return <ItalianContent><div className="about-story-journey">{storyChapters.map(([number, label, title, text]) => <article key={title}><span>{number}</span><div><small>{label}</small><h3>{title}</h3><p>{text}</p></div></article>)}</div></ItalianContent>;
}
