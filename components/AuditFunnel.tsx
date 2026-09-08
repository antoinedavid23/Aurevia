"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Clock3 } from "lucide-react";
import { useLocale } from "@/components/LocaleController";
import { AuditLanguageMenu } from "@/components/AuditLanguageMenu";
import type { Locale } from "@/lib/i18n";
import { auditResult } from "@/lib/audit-model";
import { isAuditLocationComplete, locationCopy } from "@/lib/audit-location";
import { nextAuditScreen } from "@/lib/audit-navigation";
import { isAuditPortfolioComplete, portfolioCopy } from "@/lib/audit-portfolio";
import { isConfirmedAuditDelivery, saveAuditSession } from "@/lib/audit-session";
export { auditResult } from "@/lib/audit-model";

import { auditCopy as copy, financeCopy, initialAnswers as initial, initialFinance } from "./audit-content";
import { calculateAuditDistribution, distributionCopy } from "@/lib/audit-distribution";
import { isAuditFinanceComplete } from "@/lib/audit-model";
import { describeAuditObjectives } from "@/lib/audit-objectives";
import type { AuditAnswers as Answers, AuditFinance } from "./audit-content";
import { AuditQuestionnaire } from "./AuditQuestionnaire";
import { AuditServicesIntro } from "./AuditServicesIntro";
export type { AuditFinance } from "./audit-content";

const sales: Record<Locale, {eyebrow:string;title:string;text:string;cta:string;points:string[];details?:string[];note?:string}[]> = {
  it:[
    {eyebrow:"",title:"Ottenga l’audit gratuito del Suo immobile.",text:"Ricavi potenziali, costi e netto stimato. Un’analisi personalizzata AUREVIA, basata sulle Sue risposte.",cta:"Scopra l’audit gratuito",points:["Ricavi stimati","Costi dettagliati","Netto proprietario"]},
    {eyebrow:"",title:"I ricavi non raccontano tutto.",text:"Conta ciò che il Suo immobile Le lascia. In reddito netto. E in tempo per sé.",cta:"Ottenga il Suo audit gratuito",points:["Oggi, partiamo dalla Sua realtà.","Poi, esploriamo le possibilità.","Infine, decide Lei."],details:["Un quartiere, una tariffa, dei costi e le Sue esigenze. Il punto di partenza è il Suo immobile.","Notti valorizzate meglio, tariffe adeguate, una gestione da ripensare: simuliamo ciò che può cambiare.","Il Suo audit gratuito si apre qui. Legge i risultati, poi sceglie cosa approfondire con AUREVIA."],note:"3–4 min · Gratuito · Senza impegno"}
  ],
  en:[
    {eyebrow:"",title:"Get your free property audit.",text:"Potential revenue, costs and estimated net income. A personalised AUREVIA analysis, based on your answers.",cta:"Explore the free audit",points:["Estimated revenue","Detailed costs","Owner net income"]},
    {eyebrow:"",title:"Revenue is only part of the story.",text:"What matters is what your property leaves you. In net income. And in time for yourself.",cta:"Get my free audit",points:["First, your situation today.","Then, what could change.","The next move is yours."],details:["Your neighbourhood, nightly rate, costs and constraints. We start with the property you know.","Better-valued nights, adjusted pricing, a different way to manage: we put numbers to the possibilities.","Your free audit opens here. See the figures, then choose what to explore further with AUREVIA."],note:"3–4 min · Free · No commitment"}
  ],
  fr:[
    {eyebrow:"",title:"Obtenez l’audit gratuit de votre bien.",text:"Revenus potentiels, charges et net estimé. Une analyse personnalisée AUREVIA, à partir de vos réponses.",cta:"Découvrir l’audit gratuit",points:["Revenus estimés","Charges détaillées","Net propriétaire"]},
    {eyebrow:"",title:"Les revenus ne disent pas tout.",text:"Ce qui compte, c’est ce que votre bien vous laisse. En revenus nets. Et en temps pour vous.",cta:"Obtenir mon audit gratuit",points:["D’abord, votre réalité.","Puis, ce qui pourrait changer.","La suite vous appartient."],details:["Un quartier, un tarif, des charges et vos contraintes. Nous partons du bien que vous connaissez.","Des nuits mieux valorisées, un tarif ajusté, une gestion à repenser : nous chiffrons les possibilités.","Votre audit gratuit s’affiche ici. Vous voyez les chiffres, puis choisissez ce qu’il faut approfondir avec AUREVIA."],note:"3–4 min · Gratuit · Sans engagement"}
  ]
};


const internalMonths = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

function FunnelHeader({ label }: { label: string }) {
  return <header className="audit-header">
    <Link href="/" className="audit-logo" aria-label="AUREVIA"><img src="/images/brand/aurevia-logo-transparent-gold.png" width={280} height={280} alt="AUREVIA"/></Link>
    <span className="audit-header-label">{label}</span>
    <AuditLanguageMenu/>
  </header>;
}

export function AuditFunnel() {
  const { locale } = useLocale();
  const t = copy[locale];
  const router = useRouter();
  const [screen, setScreen] = useState(-2);
  const [answers, setAnswers] = useState<Answers>(initial);
  const [finance, setFinance] = useState<AuditFinance>(initialFinance);
  const [status, setStatus] = useState("");
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [tilt, setTilt] = useState({x:0,y:0});
  const submissionLock = useRef(false);
  useLayoutEffect(() => {
    // Scroll after React has replaced the old field, so focus/scroll anchoring
    // cannot leave the next question below the viewport.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [screen]);
  const result = useMemo(() => auditResult(answers,finance), [answers,finance]);
  const total = t.questions.length + 3;
  const fc=financeCopy[locale];

  function navigate(direction: -1 | 1) {
    setStatus("");
    setScreen(value => nextAuditScreen(value, screen, direction, total - 1));
  }
  function advance(){ navigate(1); }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const objectives = describeAuditObjectives(answers.objective, t.questions.find(q => q.key === "objective")?.options);
    if (!objectives.length) { setStatus(t.questions.find(q => q.key === "objective")!.hint); return; }
    if (!isAuditLocationComplete(answers)) { setStatus(locationCopy[locale].locationHint); return; }
    if (!isAuditPortfolioComplete(answers.portfolio, finance.propertyCount)) { setStatus(portfolioCopy[locale].missingCount); return; }
    const distribution = calculateAuditDistribution(answers.distribution, finance);
    if (!distribution.canContinue) { setStatus(distribution.inputMode === "average" ? distributionCopy[locale].invalidAverage : distributionCopy[locale].required); return; }
    if (!isAuditFinanceComplete(answers, finance)) { setStatus(financeCopy[locale].financialText); return; }
    if (submissionLock.current) return;
    submissionLock.current = true;
    setStatus(t.sending);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const optionLabel = (key: keyof Answers) => key === "objective" ? objectives.map(item => item.label).join(" · ")
      : t.questions.find(q => q.key === key)?.options?.find(o => o.value === answers[key])?.label || String(answers[key]);
    const internalAudit = {
      reportVersion: "AUREVIA-DIAGNOSTIC-1.8-OPTIONAL-CHANNEL-FEES",
      generatedAt: new Date().toISOString(),
      language: locale,
      qualification: {
        portfolio: { code: answers.portfolio, answer: optionLabel("portfolio"), exactPropertyCount: result.portfolio },
        currentSituation: { code: answers.status, answer: optionLabel("status") },
        objectives,
        distribution: { code: answers.distribution, answer: optionLabel("distribution") },
        location: { territory: optionLabel("area"), ...result.location },
        address: answers.address,
        compliance: { code: answers.compliance, answer: optionLabel("compliance") },
        ownerConstraint: answers.constraint,
        timing: { code: answers.timing, answer: optionLabel("timing") },
      },
      locationModel: result.location,
      evidenceAndLimits: result.evidence,
      distributionModel: result.distribution,
      portfolioProjection: {
        exactPropertyCount: result.portfolio,
        basis: result.basis,
        assumptions: portfolioCopy.fr.assumption,
        currentGrossRevenue: result.currentGross,
        currentOwnerNet: result.currentNet,
        projectedGrossRevenue: result.projectedGross,
        projectedOwnerNet: result.projectedNet,
        projectedNetGain: result.annualGain,
        annualOperatingCosts: result.annualCosts,
        availablePropertyNights: finance.days * result.portfolio,
      },
      perProperty: result.perProperty,
      declaredProperty: {
        scope: "One representative property; not the sum of all properties",
        propertyType: finance.propertyType,
        floorAreaM2: finance.area,
        bedrooms: finance.bedrooms,
        guestCapacity: finance.guests,
        finishLevel: finance.finish,
        availableDaysPerYear: finance.days,
        amenities: {
          seaView: finance.sea,
          poolType: finance.poolKind,
          terrace: finance.terrace,
          parking: finance.parking,
        },
      },
      declaredPerformance: {
        hasRentalHistory: result.hasRentalHistory,
        averageNightlyRate: result.currentNightly,
        occupancyRate: result.currentOccupancy,
        currentManagementFeeRate: result.currentManagementRate,
        platformFeeRate: result.currentPlatformRate,
        channelFeeMode: distribution.inputMode,
        averageChannelFee: distribution.inputMode === "average" ? distribution.effectiveRate : null,
        channelMix: distribution.inputMode === "detailed" ? finance.channelMix : null,
        period: "Last 12 months, accommodation revenue after discounts and before commissions; excluding cleaning and taxes",
        annualOperatingCostsPerProperty: finance.annualCosts,
        annualOperatingCostsPortfolio: result.annualCosts,
        calculatedBookedNights: result.currentBookedNights,
        calculatedGrossRevenue: result.currentGross,
        calculatedOwnerNet: result.currentNet,
      },
      aureviaCentralModel: {
        rateBasis: result.evidence.pricingBasis,
        occupancyBasis: result.evidence.occupancyBasis,
        nightRounding: "Whole sold nights, rounded to nearest integer",
        optimizationPerProperty: result.optimization,
        grossRevenueDriversPortfolio: { occupancy: result.occupancyContribution, pricing: result.pricingContribution, totalGrossGain: result.grossGain },
        targetOccupancyRate: result.targetOccupancy,
        platformFeeRate: result.platformRate,
        aureviaManagementFeeRate: result.aureviaFeeRate,
        targetAverageNightlyRate: result.targetNightly,
        targetBookedNights: result.targetBookedNights,
        projectedGrossRevenue: result.projectedGross,
        projectedOwnerNet: result.projectedNet,
        projectedOwnerNetGain: result.annualGain,
        prudentGrossScenario: result.low,
        centralGrossScenario: result.projectedGross,
        highGrossScenario: result.high,
      },
      internalScores: {
        overallFit: result.fit,
        revenuePotential: result.revenue,
        operationalEfficiency: result.operations,
        propertyProtection: result.protection,
        projectUrgency: result.urgency,
      },
      confidentialMonthlyPlan: {
        basis: "Indicative seasonal allocation, not observed bookings. Constant optimized average nightly rate from the shared simulator model. Availability distributed over a 365-day year; exact owner-use dates and minimum stays must be validated.",
        months: result.monthlyPlan.map(row => ({ month: internalMonths[row.monthIndex], ...row })),
      },
      callPreparation: {
        ownerPriorities: objectives,
        recommendedOffer: result.offer === "privilege" ? "Solution Privilège" : "Gestion Sérénité",
        firstPriorities: [
          "Valider le positionnement tarifaire et les contraintes du calendrier.",
          "Reconstituer le coût réel de la gestion actuelle et les frictions opérationnelles.",
          "Définir le protocole local de contrôle, maintenance et reporting.",
        ],
        pointsToVerifyDuringCall: [
          "Adresse précise et micro-localisation du bien.",
          "Historique réel des réservations et tarifs des douze derniers mois.",
          "Dates réservées à l’usage du propriétaire et restrictions de calendrier.",
          "Détail des charges, fiscalité et prestations déjà incluses.",
          "État de l’annonce, qualité des visuels et avis voyageurs.",
          "Contraintes réglementaires, copropriété, accès et maintenance.",
        ],
      },
    };
    const payload = {
      ...data,
      ...answers,
      propertyCount: result.portfolio,
      subject: "Audit AUREVIA",
      objective: optionLabel("objective"),
      city: result.location.cityName,
      area: optionLabel("area"),
      zone: result.location.zoneName,
      neighborhood: result.location.neighborhoodName,
      timeline: optionLabel("timing"),
      distribution: optionLabel("distribution"),
      address: answers.address,
      compliance: optionLabel("compliance"),
      ownerConstraint: answers.constraint,
      auditReport: internalAudit,
      auditSnapshot: { version: 1, answers, finance, result, locale },
      message: `Audit publicitaire — ${result.portfolio} bien(s), base représentative · ${optionLabel("status")} · ${optionLabel("objective")} · ${optionLabel("distribution")} · ${result.location.label} (${answers.address}) · ${optionLabel("compliance")} · ${optionLabel("timing")} · ${finance.propertyType}, ${finance.area} m², ${finance.bedrooms} ch., ${finance.guests} pers. PAR LOGEMENT · PORTEFEUILLE : actuel brut ${result.currentGross} €, net ${result.currentNet} € · Potentiel brut ${result.projectedGross} €, net ${result.projectedNet} € · PAR LOGEMENT : potentiel brut ${result.perProperty.projectedGross} €, net ${result.perProperty.projectedNet} € · Score ${result.fit}/100 · Recommandation ${result.offer} · Contrainte propriétaire : ${answers.constraint}`,
    };
    try {
      const response = await fetch("/api/valuation", {method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(payload)});
      if (!response.ok) throw new Error("submission_failed");
      const receipt: unknown = await response.json();
      if (!isConfirmedAuditDelivery(receipt)) throw new Error("delivery_not_confirmed");
      saveAuditSession({ version: 2, answers, finance, result, name: String(data.name || ""), locale, receipt });
      setStatus("__calculating__");
      for(let phase=1;phase<fc.loading.length;phase++){await new Promise(resolve=>window.setTimeout(resolve,620));setLoadingPhase(phase);}
      await new Promise(resolve=>window.setTimeout(resolve,650));
      router.push("/audit/grazie");
    } catch { submissionLock.current = false; setStatus(t.error); }
  }

  return <div className="audit-shell" data-no-translate>
    <FunnelHeader label={t.top}/>
    {status==="__calculating__"&&<section className="audit-calculating"><div className="audit-calculating-mark"><img src="/images/brand/aurevia-logo-transparent-gold.png" width="280" height="280" alt="AUREVIA"/></div><h1>{fc.loadingTitle}</h1><div className="audit-calculating-line"><span style={{width:`${((loadingPhase+1)/fc.loading.length)*100}%`}}/></div><p key={loadingPhase}>{fc.loading[loadingPhase]}</p><div className="audit-calculating-steps">{fc.loading.map((_,index)=><i key={index} className={index<=loadingPhase?"active":""}/>)}</div></section>}
    {status!=="__calculating__"&&<>
    {screen < 0 ? (()=>{const index=screen+2;const sale=sales[locale][index];if(index===1)return <AuditServicesIntro content={sale} onContinue={advance}/>;return <section className={`audit-sales audit-sales-${index}`} onPointerMove={event=>{const rect=event.currentTarget.getBoundingClientRect();setTilt({x:((event.clientY-rect.top)/rect.height-.5)*-1.6,y:((event.clientX-rect.left)/rect.width-.5)*2.2})}} onPointerLeave={()=>setTilt({x:0,y:0})}>
      {index===0&&<><video className="audit-sales-video" autoPlay muted loop playsInline poster="/images/home/hero-mobile-poster.webp"><source src="/videos/genova-hero.mp4" type="video/mp4"/></video><div className="audit-sales-shade"/></>}
      <motion.div className="audit-sales-card" animate={{rotateX:tilt.x,rotateY:tilt.y}} transition={{type:"spring",stiffness:90,damping:18,mass:.7}} style={{transformPerspective:1500,transformStyle:"preserve-3d"}}>
        {index===0&&<div className="audit-sales-brand"><img src="/images/brand/aurevia-logo-transparent-gold.png" width={480} height={480} alt="AUREVIA"/></div>}
        <h1>{sale.title}</h1><p className="audit-sales-text">{sale.text}</p>
        {sale.details ? <ol className="audit-service-lines">{sale.points.map((point,i)=><li key={point}><span className="audit-service-number">0{i+1}</span><strong>{point}</strong><span className="audit-service-detail">{sale.details?.[i]}</span></li>)}</ol> : <div className="audit-sales-points">{sale.points.map((point,i)=><span key={point}><b>0{i+1}</b>{point}</span>)}</div>}
        <button className="audit-primary" onClick={advance}>{sale.cta}<ArrowRight size={18}/></button>
        {index===1&&<small><Clock3 size={14}/>{sale.note || t.introTime}</small>}
      </motion.div>
      <div className="audit-sales-depth" aria-hidden="true"><span>AUREVIA</span></div>
      <div className="audit-sales-pagination" aria-hidden="true"><i className={index===0?"active":""}/><i className={index===1?"active":""}/></div>
    </section>})() : <AuditQuestionnaire
      locale={locale} screen={screen} answers={answers} finance={finance} result={result}
      status={status} setAnswers={setAnswers} setFinance={setFinance}
      onNext={advance} onBack={()=>navigate(-1)} onSubmit={submit}
    />}
    </>}
  </div>;
}
