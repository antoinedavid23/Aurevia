"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  FileLock2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useLocale } from "@/components/LocaleController";
import { AuditLanguageMenu } from "@/components/AuditLanguageMenu";
import type { Locale } from "@/lib/i18n";
import { AuditLocationSummary } from "./AuditLocationSummary";
import { AuditPortfolioSummary } from "./AuditPortfolioSummary";
import { portfolioCopy } from "@/lib/audit-portfolio";
import { AUDIT_APPOINTMENT_PATH } from "@/lib/audit-booking";
import { distributionCopy } from "@/lib/audit-distribution";
import { getAuditSession, getServerAuditSession, subscribeAuditSession, type StoredAudit } from "@/lib/audit-session";
import styles from "./AuditThankYou.module.css";

const thanks = {
  it: {
    label: "Diagnosi completata", title: "Ecco la Sua diagnosi",
    hello: "Grazie", intro: "La Sua analisi è disponibile qui. AUREVIA ha ricevuto il dossier completo per preparare il Suo appuntamento.",
    missingTitle: "La Sua diagnosi", missingText: "Completi il questionario per visualizzare la Sua analisi personale.", restart: "Inizia la diagnosi",
    fit: "Compatibilità AUREVIA", metrics: ["Potenziale ricavi", "Efficienza operativa", "Protezione del bene", "Priorità del progetto"],
    today: "Situazione dichiarata", potential: "Potenziale AUREVIA", gross: "Ricavi lordi annui",
    ownerNet: "Netto proprietario stimato", gain: "Miglioramento netto potenziale", monthly: "Media lorda mensile",
    nightly: "Tariffa media", occupancy: "Occupazione", nights: "Notti vendute", scenarios: "Tre scenari di ricavo lordo",
    prudent: "Prudente", central: "Centrale", high: "Alto", assumptions: "Perimetro della simulazione",
    days: "giorni disponibili", costs: "costi operativi", platform: "commissioni portali", management: "gestione AUREVIA",
    summaryKicker: "Lettura esecutiva", summaryTitle: "Cosa spiega la differenza?",
    summaryIntro: "Variazione delle notti e della tariffa: due effetti sui ricavi lordi. Il netto tiene poi conto delle commissioni e dei costi, prima delle imposte. Il risultato può aumentare o diminuire.",
    findings: ["Il calendario attuale lascia una parte della domanda non monetizzata.", "Il passaggio a una gestione coordinata può aumentare il netto nonostante le commissioni.", "Il bene presenta un profilo compatibile con un pilotaggio premium locale."],
    callNow: "Confrontare questa diagnosi con un esperto",
    comparisonKicker: "Diagnosi finanziaria", comparisonTitle: "Situazione attuale e scenario AUREVIA",
    comparisonIntro: "Tariffa dichiarata +20% e occupazione obiettivo, poi ipotesi di distribuzione AUREVIA all’8% e gestione al 25%. Senza tariffa attuale, si usa una stima iniziale del bene. I costi attuali dipendono dai canali dichiarati.",
    indicator: "Indicatore", declared: "Oggi", model: "Scenario", variation: "Variazione",
    seasonKicker: "Proiezione annuale", seasonTitle: "Come si distribuirebbe il potenziale",
    seasonIntro: "Ricavi indicativi per trimestre. Il dettaglio mensile e le tariffe da adottare saranno approfonditi durante l’analisi rapida.",
    months: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
    pricingLocked: "Calendario tariffario riservato", pricingLockedText: "Prezzo notte, soggiorno minimo ed eventi, mese per mese.",
    diagnosisKicker: "Diagnosi operativa", diagnosisTitle: "Dove intervenire in priorità",
    diagnosisIntro: "Il punteggio non valuta soltanto il rendimento. Misura anche la capacità del sistema di assorbire ospiti, imprevisti, controlli e reporting senza ricadere sul proprietario.",
    statusStrong: "Leva forte", statusWatch: "Da consolidare", statusPriority: "Priorità",
    diagnosisNotes: ["Domanda e disponibilità consentono un riposizionamento progressivo.", "La coordinazione locale è la principale leva di semplificazione.", "Controlli documentati e referente unico riducono l’esposizione.", "Il timing commerciale influenza direttamente la prima stagione."],
    recommended: "Percorso consigliato", serenity: "Gestione Serenità", privilege: "Soluzione Privilegio",
    serenityText: "Gestione completa, strategia tariffaria e un unico referente locale.",
    privilegeText: "Struttura su misura, pilotaggio centralizzato e reporting consolidato per il portafoglio.",
    priorities: "Le 3 leve prioritarie",
    items: ["Riposizionare tariffa e calendario per stagione", "Ridurre le inefficienze che erodono il netto", "Proteggere il bene con controlli e reporting documentati"],
    appendixKicker: "Appendice strategica", appendixTitle: "La diagnosi continua oltre questa simulazione",
    appendixIntro: "Tre parti restano volontariamente riservate: dipendono da dati locali che validiamo durante l’appuntamento per evitare una raccomandazione generica.",
    lockedCards: ["Benchmark comparabili locali", "Calendario tariffario mensile", "Piano operativo 30 / 60 / 90 giorni"],
    lockedDescriptions: ["Prestazioni di immobili comparabili, posizionamento e soglia di prezzo.", "Tariffe, soggiorno minimo, picchi, eventi e finestre di disponibilità.", "Azioni, responsabilità, controlli e sequenza di messa in gestione."],
    locked: "Lettura strategica riservata", lockedText: "Durante l’appuntamento, un referente AUREVIA verifica le ipotesi, chiarisce i punti aperti e definisce con Lei i prossimi passi.",
    cta: "Parli con AUREVIA", calendar: "Scelga l’orario del Suo appuntamento",
    bookingLabel: "Prenota un appuntamento con AUREVIA",
    openingNote: "I numeri sono disponibili. La strategia si definisce insieme.",
    nextTitle: "Da approfondire insieme",
    nextTopics: ["Posizionamento nel quartiere", "Tariffe e calendario", "Azioni prioritarie"],
    available: "Incluso nel Suo audit", availableText: "Ricavi, netto, commissioni e ipotesi restano consultabili senza appuntamento.",
    reserved: "Da approfondire in appuntamento", reveal: "Approfondire con AUREVIA",
    financeCallTitle: "Cosa cambia davvero per Lei?", financeCallText: "Verifichiamo costi, disponibilità e ipotesi prima di definire una strategia.",
    quarters: ["Gen – Mar", "Apr – Giu", "Lug – Set", "Ott – Dic"],
    operationPreviews: ["Controlli, rischi e punti da verificare.", "Tempistiche e condizioni di avvio."],
    priorityPreviews: ["Ottimizzazione dei costi", "Protezione e controlli"],
    finalTitle: "Dai numeri alle decisioni.",
    note: "Simulazione indicativa basata sui dati dichiarati e su ipotesi generali di domanda. Non costituisce una garanzia di rendimento. Tariffe, fiscalità, costi e calendario saranno affinati dopo verifica del bene e del mercato.",
    back: "Torna al sito",
  },
  en: {
    label: "Diagnosis complete", title: "Here is your assessment",
    hello: "Thank you", intro: "Your analysis is available here. AUREVIA has received the complete dossier to prepare your appointment.",
    missingTitle: "Your assessment", missingText: "Complete the questionnaire to view your personal analysis.", restart: "Start my assessment",
    fit: "AUREVIA fit", metrics: ["Revenue potential", "Operational efficiency", "Property protection", "Project priority"],
    today: "Declared position", potential: "AUREVIA potential", gross: "Annual gross revenue",
    ownerNet: "Estimated owner net", gain: "Potential net improvement", monthly: "Average monthly gross",
    nightly: "Average nightly rate", occupancy: "Occupancy", nights: "Nights sold", scenarios: "Three gross revenue scenarios",
    prudent: "Prudent", central: "Central", high: "High", assumptions: "Simulation scope",
    days: "available days", costs: "operating costs", platform: "platform fees", management: "AUREVIA management",
    summaryKicker: "Executive reading", summaryTitle: "What explains the difference?",
    summaryIntro: "Changes in booked nights and pricing: two effects on gross revenue. Net income then accounts for fees and costs, before tax. The result can increase or decrease.",
    findings: ["The current calendar leaves part of the demand unmonetised.", "Coordinated management may improve owner net despite fees.", "The property profile is compatible with premium local oversight."],
    callNow: "Review this diagnosis with an expert",
    comparisonKicker: "Financial diagnosis", comparisonTitle: "Current position and AUREVIA scenario",
    comparisonIntro: "Declared rate +20% and target occupancy, then an 8% AUREVIA distribution assumption and 25% management. Without a current rate, an initial property estimate is used. Current costs reflect the declared channels.",
    indicator: "Indicator", declared: "Today", model: "Scenario", variation: "Change",
    seasonKicker: "Annual projection", seasonTitle: "How the potential could be distributed",
    seasonIntro: "Indicative revenue by quarter. The monthly breakdown and recommended rates will be reviewed during your quick analysis.",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    pricingLocked: "Private pricing calendar", pricingLockedText: "Nightly price, minimum stay and event strategy, month by month.",
    diagnosisKicker: "Operational diagnosis", diagnosisTitle: "Where to act first",
    diagnosisIntro: "The score does not assess returns alone. It also measures how well the system can absorb guests, incidents, inspections and reporting without burdening the owner.",
    statusStrong: "Strong lever", statusWatch: "To consolidate", statusPriority: "Priority",
    diagnosisNotes: ["Demand and availability support progressive repositioning.", "Local coordination is the main simplification lever.", "Documented checks and one point of contact reduce exposure.", "Commercial timing directly affects the first season."],
    recommended: "Recommended path", serenity: "Serenity Management", privilege: "Privilege Solution",
    serenityText: "Complete management, pricing strategy and one local point of contact.",
    privilegeText: "A bespoke structure, central oversight and consolidated portfolio reporting.",
    priorities: "Your 3 priority levers",
    items: ["Reposition pricing and availability by season", "Remove inefficiencies eroding owner net", "Protect the property with documented checks and reporting"],
    appendixKicker: "Strategic appendix", appendixTitle: "The diagnosis continues beyond this simulation",
    appendixIntro: "Three sections remain deliberately private: they depend on local data we validate during the call to avoid a generic recommendation.",
    lockedCards: ["Local comparable benchmark", "Monthly pricing calendar", "30 / 60 / 90-day operating plan"],
    lockedDescriptions: ["Comparable property performance, positioning and price threshold.", "Rates, minimum stay, peaks, events and availability windows.", "Actions, responsibilities, checks and management onboarding sequence."],
    locked: "Private strategic reading", lockedText: "During your appointment, an AUREVIA advisor checks the assumptions, clarifies open questions and agrees the next steps with you.",
    cta: "Speak with AUREVIA", calendar: "Choose a time for your appointment",
    bookingLabel: "Book an appointment with AUREVIA",
    openingNote: "Your figures are ready. We define the strategy together.",
    nextTitle: "What we’ll review together",
    nextTopics: ["Neighbourhood positioning", "Rates and availability", "Priority actions"],
    available: "Included in your audit", availableText: "Revenue, net income, fees and assumptions remain available without an appointment.",
    reserved: "To review at your appointment", reveal: "Review with AUREVIA",
    financeCallTitle: "What does this mean for you?", financeCallText: "We check costs, availability and assumptions before defining a strategy.",
    quarters: ["Jan – Mar", "Apr – Jun", "Jul – Sep", "Oct – Dec"],
    operationPreviews: ["Checks, risks and points to verify.", "Timing and conditions for launch."],
    priorityPreviews: ["Cost optimisation", "Property protection and checks"],
    finalTitle: "Turn figures into decisions.",
    note: "Indicative simulation based on declared information and general demand assumptions. It is not a guarantee of returns. Rates, taxation, costs and calendar will be refined after reviewing the property and market.",
    back: "Back to website",
  },
  fr: {
    label: "Diagnostic terminé", title: "Voici votre audit",
    hello: "Merci", intro: "Votre analyse est disponible ici. AUREVIA a reçu le dossier complet pour préparer votre rendez-vous.",
    missingTitle: "Votre audit", missingText: "Complétez le questionnaire pour afficher votre analyse personnelle.", restart: "Commencer mon audit",
    fit: "Compatibilité AUREVIA", metrics: ["Potentiel de revenus", "Efficacité opérationnelle", "Protection du bien", "Priorité du projet"],
    today: "Situation déclarée", potential: "Potentiel AUREVIA", gross: "Revenus bruts annuels",
    ownerNet: "Net propriétaire estimé", gain: "Gain net potentiel", monthly: "Moyenne brute mensuelle",
    nightly: "Tarif moyen", occupancy: "Occupation", nights: "Nuits vendues", scenarios: "Trois scénarios de revenus bruts",
    prudent: "Prudent", central: "Central", high: "Haut", assumptions: "Périmètre de la simulation",
    days: "jours disponibles", costs: "charges opérationnelles", platform: "commissions plateformes", management: "gestion AUREVIA",
    summaryKicker: "Lecture exécutive", summaryTitle: "D’où vient l’écart ?",
    summaryIntro: "Variation des nuits vendues et du tarif : deux effets sur le brut. Le net tient ensuite compte des commissions et des charges, avant fiscalité. Le résultat peut augmenter ou diminuer.",
    findings: ["Le calendrier actuel laisse une partie de la demande non monétisée.", "Une gestion coordonnée peut améliorer le net malgré les commissions.", "Le bien présente un profil compatible avec un pilotage local premium."],
    callNow: "Relire ce diagnostic avec un expert",
    comparisonKicker: "Diagnostic financier", comparisonTitle: "Situation actuelle et scénario AUREVIA",
    comparisonIntro: "Tarif déclaré +20 % et occupation cible, puis hypothèse de distribution AUREVIA à 8 % et gestion à 25 %. Sans tarif actuel, une estimation de départ du bien est utilisée. Les frais actuels dépendent des canaux déclarés.",
    indicator: "Indicateur", declared: "Aujourd’hui", model: "Scénario", variation: "Écart",
    seasonKicker: "Projection annuelle", seasonTitle: "Comment le potentiel pourrait se répartir",
    seasonIntro: "Revenus indicatifs par trimestre. Le détail mensuel et les tarifs à adopter seront approfondis pendant l’analyse rapide.",
    months: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"],
    pricingLocked: "Calendrier tarifaire confidentiel", pricingLockedText: "Prix à la nuit, séjour minimum et stratégie événementielle, mois par mois.",
    diagnosisKicker: "Diagnostic opérationnel", diagnosisTitle: "Où agir en priorité",
    diagnosisIntro: "Le score ne mesure pas uniquement le rendement. Il évalue aussi la capacité du système à absorber voyageurs, imprévus, contrôles et reporting sans retomber sur le propriétaire.",
    statusStrong: "Levier fort", statusWatch: "À consolider", statusPriority: "Priorité",
    diagnosisNotes: ["La demande et la disponibilité autorisent un repositionnement progressif.", "La coordination locale est le principal levier de simplification.", "Des contrôles documentés et un interlocuteur unique réduisent l’exposition.", "Le calendrier commercial influence directement la première saison."],
    recommended: "Parcours recommandé", serenity: "Gestion Sérénité", privilege: "Solution Privilège",
    serenityText: "Gestion complète, stratégie tarifaire et un interlocuteur local unique.",
    privilegeText: "Organisation sur mesure, pilotage centralisé et reporting consolidé du portefeuille.",
    priorities: "Vos 3 leviers prioritaires",
    items: ["Repositionner les tarifs et le calendrier selon les saisons", "Réduire les frictions qui érodent le net", "Protéger le bien avec des contrôles et un reporting documentés"],
    appendixKicker: "Annexe stratégique", appendixTitle: "Le diagnostic continue au-delà de cette simulation",
    appendixIntro: "Trois parties restent volontairement confidentielles : elles dépendent de données locales que nous validons pendant l’appel pour éviter une recommandation générique.",
    lockedCards: ["Benchmark des biens comparables", "Calendrier tarifaire mensuel", "Plan opérationnel 30 / 60 / 90 jours"],
    lockedDescriptions: ["Performance des comparables, positionnement et seuil de prix.", "Tarifs, séjour minimum, pics, événements et fenêtres de disponibilité.", "Actions, responsabilités, contrôles et séquence de mise en gestion."],
    locked: "Lecture stratégique confidentielle", lockedText: "Lors du rendez-vous, un conseiller AUREVIA vérifie les hypothèses, clarifie les points ouverts et définit avec vous la suite.",
    cta: "Échanger avec AUREVIA", calendar: "Choisissez le créneau de votre rendez-vous",
    bookingLabel: "Prendre rendez-vous avec AUREVIA",
    openingNote: "Les chiffres sont là. La stratégie se précise ensemble.",
    nextTitle: "À approfondir ensemble",
    nextTopics: ["Positionnement dans le quartier", "Tarifs et calendrier", "Actions prioritaires"],
    available: "Inclus dans votre audit", availableText: "Revenus, net, frais et hypothèses restent consultables sans rendez-vous.",
    reserved: "À approfondir en rendez-vous", reveal: "Approfondir avec AUREVIA",
    financeCallTitle: "Ce que ces chiffres changent pour vous", financeCallText: "Vérifions les coûts, les disponibilités et les hypothèses avant de définir une stratégie.",
    quarters: ["Jan – Mar", "Avr – Juin", "Juil – Sept", "Oct – Déc"],
    operationPreviews: ["Contrôles, risques et points à vérifier.", "Calendrier et conditions de démarrage."],
    priorityPreviews: ["Optimisation des charges", "Protection et contrôles"],
    finalTitle: "Des chiffres aux décisions.",
    note: "Simulation indicative fondée sur les informations déclarées et des hypothèses générales de demande. Elle ne constitue pas une garantie de rendement. Tarifs, fiscalité, charges et calendrier seront affinés après vérification du bien et du marché.",
    back: "Retour au site",
  },
} satisfies Record<Locale, Record<string, string | string[]>>;

export function AuditThankYou() {
  const stored = useSyncExternalStore(subscribeAuditSession, getAuditSession, getServerAuditSession);
  const { locale } = useLocale();
  const t = thanks[locale];
  if (!stored) return <div className="audit-shell audit-result-shell" data-no-translate>
    <header className="audit-header"><Link href="/" className="audit-logo" aria-label="AUREVIA"><img src="/images/brand/aurevia-logo-transparent-gold.png" width={280} height={280} alt="AUREVIA"/></Link><AuditLanguageMenu/></header>
    <main className="audit-result"><section className="audit-result-head"><div><h1>{t.missingTitle}</h1><p>{t.missingText}</p><Link className="audit-primary" href="/audit">{t.restart}<ArrowRight size={18}/></Link></div></section></main>
  </div>;
  return <AuditReport stored={stored}/>;
}

function AuditReport({ stored }: { stored: StoredAudit }) {
  const { locale } = useLocale();
  const t = thanks[locale];
  const pc = portfolioCopy[locale];
  const dc = distributionCopy[locale];
  const result = stored.result;
  const finance = stored.finance;
  const bookingLink = { href: AUDIT_APPOINTMENT_PATH, "aria-label": `${t.cta} — ${t.bookingLabel}` };
  const money = (value: number | null) => value === null ? "—" : new Intl.NumberFormat(
    locale === "it" ? "it-IT" : locale === "fr" ? "fr-FR" : "en-GB",
    { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 2 },
  ).format(value);
  const pctGain = result.currentNet !== null && result.currentNet > 0 && result.annualGain !== null ? Math.round((result.annualGain / result.currentNet) * 100) : null;
  const signedMoney = (value: number | null) => `${value !== null && value > 0 ? "+" : ""}${money(value)}`;
  const currentNightly = result.currentNightly;
  const currentOccupancy = result.currentOccupancy;
  const metrics = useMemo(() => [result.revenue, result.operations, result.protection, result.urgency], [result]);
  const quarterlyProjection = Array.from({ length: 4 }, (_, quarter) =>
    result.monthlyPlan.slice(quarter * 3, quarter * 3 + 3)
      .reduce((total, month) => total + Math.round(month.projectedGrossPortfolio * 100), 0) / 100,
  );
  const signed = (value: number) => `${value > 0 ? "+" : ""}${value}`;
  const comparisonRows = [
    { label: t.nightly as string, current: money(currentNightly), target: money(result.targetNightly), delta: currentNightly > 0 ? `${signed(Math.round(((result.targetNightly / currentNightly) - 1) * 100))}%` : "—" },
    { label: t.occupancy as string, current: `${currentOccupancy}%`, target: `${result.targetOccupancy}%`, delta: `${signed(result.targetOccupancy - currentOccupancy)} pts` },
    { label: `${t.nights} · ${pc.perProperty}`, current: String(result.perProperty.currentBookedNights), target: String(result.perProperty.targetBookedNights), delta: signed(result.perProperty.targetBookedNights - result.perProperty.currentBookedNights) },
    { label: t.gross as string, current: money(result.currentGross), target: money(result.projectedGross), delta: result.currentGross > 0 ? `${signed(Math.round(((result.projectedGross / result.currentGross) - 1) * 100))}%` : "—" },
    { label: dc.current, current: result.currentPlatformRate === null ? "—" : `${result.currentPlatformRate}%`, target: `${result.platformRate}%`, delta: result.currentPlatformRate === null ? "—" : `${signed(Math.round((result.platformRate - result.currentPlatformRate) * 10000) / 10000)} pts` },
    { label: t.ownerNet as string, current: money(result.currentNet), target: money(result.projectedNet), delta: signedMoney(result.annualGain) },
  ];

  const statusFor = (score: number) => score >= 84 ? t.statusStrong : score >= 77 ? t.statusWatch : t.statusPriority;
  const findings = [
    `${pc.occupancyLever} : ${signedMoney(result.occupancyContribution)}`,
    `${pc.pricingLever} : ${signedMoney(result.pricingContribution)}`,
    `${pc.grossGain} : ${signedMoney(result.grossGain)}`,
  ];

  return <div className={`audit-shell audit-result-shell ${styles.report}`} data-no-translate>
    <header className="audit-header">
      <Link href="/" className="audit-logo" aria-label="AUREVIA">
        <img src="/images/brand/aurevia-logo-transparent-gold.png" width={280} height={280} alt="AUREVIA" />
      </Link>
      <span className="audit-header-label">{t.label}</span>
      <AuditLanguageMenu />
    </header>

    <main className="audit-result">
      <section className="audit-result-head">
        <div>
          <h1>{t.title}</h1>
          <p>{stored?.name ? `${t.hello}, ${stored.name}. ` : ""}{t.intro}</p>
          <div className={styles.openingAction}>
            <Link className={`audit-primary ${styles.bookingAction}`} {...bookingLink}>{t.cta}<ArrowRight size={18} aria-hidden="true" /></Link>
            <small><CalendarDays size={15} aria-hidden="true" />{t.calendar}</small>
          </div>
        </div>
        <aside className={styles.openingPreview}>
          <h2>{t.nextTitle}</h2>
          <p>{t.openingNote}</p>
          <ul>{t.nextTopics.map(topic => <li key={topic}><LockKeyhole size={15} aria-hidden="true" /><span>{topic}</span><span className={styles.redacted} aria-hidden="true" /></li>)}</ul>
          <a href="#audit-strategy" className={styles.previewLink}>{t.reveal}<ArrowRight size={16} aria-hidden="true" /></a>
        </aside>
      </section>

      <div className={styles.included}><Check size={18} aria-hidden="true" /><p><strong>{t.available}</strong> — {t.availableText}</p></div>
      <aside className={styles.evidence}><strong>{dc.evidence}</strong><p>{dc.evidenceNote}</p></aside>
      <AuditPortfolioSummary result={result} locale={locale}/>

      <p>{result.portfolio > 1 ? `${pc.total} · ${result.portfolio} ${pc.properties}` : pc.perProperty}</p>
      <section className="audit-finance-summary">
        <div className="audit-finance-column"><p>{t.today}</p><div><span>{t.gross}</span><strong>{money(result.currentGross)}</strong></div><div><span>{t.ownerNet}</span><strong>{money(result.currentNet)}</strong></div></div>
        <div className="audit-finance-arrow"><ArrowRight /></div>
        <div className="audit-finance-column is-potential"><p>{t.potential}</p><div><span>{t.gross}</span><strong>{money(result.projectedGross)}</strong></div><div><span>{t.ownerNet}</span><strong>{money(result.projectedNet)}</strong></div></div>
        <div className="audit-finance-gain"><TrendingUp size={20} /><span>{t.gain}</span><strong>{signedMoney(result.annualGain)}</strong>{pctGain !== null && pctGain > 0 ? <small>+{pctGain}%</small> : null}</div>
      </section>

      <section className="audit-executive">
        <div className="audit-section-copy">
          <h2>{t.summaryTitle}</h2>
          <p>{t.summaryIntro}</p>
        </div>
        <div className="audit-executive-findings">
          {findings.map((finding, index) => <article key={finding}><span>0{index + 1}</span><p>{finding}</p></article>)}
        </div>
        <Link className="audit-text-cta" {...bookingLink} aria-label={`${t.callNow} — ${t.bookingLabel}`}>{t.callNow}<ArrowRight size={16} aria-hidden="true" /></Link>
      </section>

      <section className="audit-finance-detail">
        {result.location && <AuditLocationSummary location={result.location} locale={locale} detailed/>}
        <div className="audit-kpi-strip">
          <div><span>{t.monthly} · {result.portfolio > 1 ? pc.total : pc.perProperty}</span><strong>{money(result.monthlyGross)}</strong>{result.portfolio > 1 && <small>{money(result.perProperty.monthlyGross)} · {pc.perProperty}</small>}</div>
          <div><span>{t.nightly}</span><strong>{money(result.targetNightly)}</strong><small>{money(currentNightly)} → {money(result.targetNightly)}</small></div>
          <div><span>{t.occupancy}</span><strong>{result.targetOccupancy}%</strong><small>{currentOccupancy}% → {result.targetOccupancy}%</small></div>
          <div><span>{t.nights} · {pc.perProperty}</span><strong>{result.perProperty.targetBookedNights}</strong><small>{result.perProperty.currentBookedNights} → {result.perProperty.targetBookedNights}</small></div>
        </div>
        <div className="audit-scenarios"><h2>{t.scenarios}</h2><div><span>{t.prudent}<b>{money(result.low)}</b></span><span className="active">{t.central}<b>{money(result.projectedGross)}</b></span><span>{t.high}<b>{money(result.high)}</b></span></div></div>
        <div className="audit-assumptions"><span>{t.assumptions}</span><p>{finance.days} {t.days} {result.portfolio > 1 ? `(${pc.perProperty})` : ""} · {money(result.annualCosts)} {t.costs} {result.portfolio > 1 ? `(${pc.total})` : ""} · {result.platformRate}% {dc.target} · {result.aureviaFeeRate}% {t.management}</p><p>{pc.optimizationRule}</p><p>{dc.note}</p></div>
      </section>

      <section className="audit-comparison">
        <div className="audit-section-heading">
          <div><h2>{t.comparisonTitle}</h2></div>
          <p>{t.comparisonIntro}</p>
        </div>
        <div className="audit-comparison-table">
          <div className="audit-comparison-row is-head"><span>{t.indicator}</span><span>{t.declared}</span><span>{t.model}</span><span>{t.variation}</span></div>
          {comparisonRows.map((row) => <div className="audit-comparison-row" key={row.label}><strong>{row.label}</strong><span>{row.current}</span><span>{row.target}</span><b>{row.delta}</b></div>)}
        </div>
        <div className={styles.inlineBooking}>
          <div><h3>{t.financeCallTitle}</h3><p>{t.financeCallText}</p></div>
          <Link className={`audit-primary ${styles.bookingAction}`} {...bookingLink}>{t.cta}<ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="audit-season">
        <div className="audit-section-heading">
          <div><h2>{t.seasonTitle}</h2></div>
          <p>{t.seasonIntro}</p>
        </div>
        <dl className={styles.quarters}>
          {quarterlyProjection.map((value, index) => <div key={t.quarters[index]}><dt>{t.quarters[index]}</dt><dd>{money(value)}</dd></div>)}
        </dl>
        <div className="audit-pricing-lock">
          <div className="audit-pricing-ghost" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
          <div><LockKeyhole size={20} /><strong>{t.pricingLocked}</strong><p>{t.pricingLockedText}</p><Link {...bookingLink}>{t.cta}<ArrowRight size={14} aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section className="audit-operations">
        <div className="audit-section-heading">
          <div><h2>{t.diagnosisTitle}</h2></div>
          <p>{t.diagnosisIntro}</p>
        </div>
        <div className="audit-operation-grid">
          {(t.metrics as string[]).map((label, index) => index < 2 ? <article key={label}>
            <div><span>0{index + 1}</span><b>{metrics[index]}/100</b></div>
            <h3>{label}</h3><p>{(t.diagnosisNotes as string[])[index]}</p>
            <div className="audit-operation-meter"><i style={{ width: `${metrics[index]}%` }} /></div>
            <small>{statusFor(metrics[index])}</small>
          </article> : <article key={label} className={styles.reservedOperation}>
            <div><span>0{index + 1}</span><LockKeyhole size={18} aria-hidden="true" /></div>
            <h3>{label}</h3><p>{t.operationPreviews[index - 2]}</p>
            <div className={styles.redactedLines} aria-hidden="true"><i /><i /><i /></div>
            <small>{t.reserved}</small>
            <Link className={styles.previewLink} {...bookingLink} aria-label={`${t.reveal} — ${t.bookingLabel}`}>{t.reveal}<ArrowRight size={16} aria-hidden="true" /></Link>
          </article>)}
        </div>
      </section>

      <section className="audit-result-grid">
        <div className="audit-report">
          <div className="audit-recommendation"><span>{t.recommended}</span><h2>{result.offer === "privilege" ? t.privilege : t.serenity}</h2><p>{result.offer === "privilege" ? t.privilegeText : t.serenityText}</p><div><ShieldCheck size={18} /><span>AUREVIA · Genova &amp; Liguria</span></div></div>
          <div className="audit-priorities"><h3>{t.priorities}</h3>{(t.items as string[]).map((item, index) => <div key={item}><span>0{index + 1}</span>{index === 0 ? <><p>{item}</p><Check size={16} /></> : <><p>{t.priorityPreviews[index - 1]}<span className={styles.priorityRedacted} aria-hidden="true" /><small className={styles.priorityLabel}>{t.reserved}</small></p><LockKeyhole size={16} aria-hidden="true" /></>}</div>)}</div>
        </div>
        <aside className="audit-unlock">
          <div className="audit-blurred" aria-hidden="true"><span /><span /><span /><span /><span /></div>
          <div className="audit-unlock-content"><LockKeyhole size={30} /><h2>{t.locked}</h2><p>{t.lockedText}</p><Link className="audit-primary" {...bookingLink}>{t.cta}<ArrowRight size={18} aria-hidden="true" /></Link><small><CalendarDays size={14} />{t.calendar}</small></div>
        </aside>
      </section>

      <section className="audit-appendix" id="audit-strategy" tabIndex={-1}>
        <div className="audit-section-copy"><h2>{t.appendixTitle}</h2><p>{t.appendixIntro}</p></div>
        <div className="audit-locked-grid">
          {(t.lockedCards as string[]).map((title, index) => <article key={title}>
            <div className="audit-locked-icon"><FileLock2 size={21} /><span>0{index + 1}</span></div>
            <h3>{title}</h3><p>{(t.lockedDescriptions as string[])[index]}</p>
            <div className="audit-locked-lines" aria-hidden="true"><i /><i /><i /></div>
            <Link className={styles.appendixLink} {...bookingLink} aria-label={`${t.reveal} — ${t.bookingLabel}`}>{t.reveal}<ArrowRight size={16} aria-hidden="true" /></Link>
          </article>)}
        </div>
        <div className="audit-final-call">
          <Sparkles size={22} />
          <div><h2>{t.finalTitle}</h2><p className={styles.finalText}>{t.financeCallText}</p><small><CalendarDays size={14} />{t.calendar}</small></div>
          <Link className="audit-primary" {...bookingLink}>{t.cta}<ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>

      <p className="audit-disclaimer">{t.note}</p>
      <Link className="audit-back-link" href="/">{t.back}<ArrowRight size={14} /></Link>
    </main>
  </div>;
}
