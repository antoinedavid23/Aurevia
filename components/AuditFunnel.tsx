"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Check, Clock3, Home, KeyRound, MapPin, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { LanguageOptions, useLocale } from "@/components/LocaleController";
import type { Locale } from "@/lib/i18n";

type Answers = {
  portfolio: string;
  status: string;
  objective: string;
  area: string;
  timing: string;
};

type Copy = {
  top: string; back: string; confidential: string; step: string; of: string; continue: string;
  introKicker: string; introTitle: string; introText: string; introStart: string; introTime: string;
  proof: string[]; questions: { key: keyof Answers; kicker: string; title: string; hint: string; options: { value: string; label: string; detail?: string }[] }[];
  contactKicker: string; contactTitle: string; contactText: string; first: string; last: string; email: string; phone: string;
  consent: string; privacy: string; submit: string; sending: string; error: string;
};

const copy: Record<Locale, Copy> = {
  it: {
    top: "Diagnosi privata", back: "Torna al sito", confidential: "Dati riservati", step: "Passaggio", of: "di", continue: "Continua",
    introKicker: "Audit gratuito · Genova e Liguria", introTitle: "Quale strategia merita il Suo immobile?", introText: "In pochi passaggi analizziamo il profilo del bene, la situazione attuale e la Sua priorità. Riceverà una prima diagnosi AUREVIA e il percorso di gestione più adatto.", introStart: "Inizia la diagnosi", introTime: "Circa 2 minuti",
    proof: ["Analisi personalizzata", "Raccomandazione immediata", "Senza impegno"],
    questions: [
      { key:"portfolio", kicker:"Il perimetro", title:"Quanti immobili desidera affidare o valorizzare?", hint:"Il numero di immobili determina il livello di coordinamento e di reporting più efficace.", options:[
        {value:"1",label:"1 immobile",detail:"Una gestione dedicata e completa"},{value:"2-4",label:"Da 2 a 4",detail:"Coordinamento di un piccolo portafoglio"},{value:"5-15",label:"Da 5 a 15",detail:"Pilotaggio e reporting consolidato"},{value:"16+",label:"16 o più",detail:"Organizzazione su misura"}]},
      { key:"status", kicker:"La situazione", title:"A che punto si trova oggi?", hint:"La diagnosi distingue il lancio, l’ottimizzazione e la protezione patrimoniale.", options:[
        {value:"active",label:"Già in affitto breve",detail:"L’annuncio e le prenotazioni sono attivi"},{value:"launch",label:"Da mettere a reddito",detail:"Il progetto deve ancora essere avviato"},{value:"managed",label:"Già affidato a un gestore",detail:"Desidero confrontare le performance"},{value:"secondary",label:"Seconda casa",detail:"Voglio proteggerla e usarla liberamente"}]},
      { key:"objective", kicker:"La priorità", title:"Quale risultato conta di più per Lei?", hint:"AUREVIA coordina rendimento, cura del bene ed esperienza ospite: la priorità cambia l’ordine delle azioni.", options:[
        {value:"revenue",label:"Aumentare i ricavi",detail:"Prezzi, occupazione e durata dei soggiorni"},{value:"time",label:"Liberare il mio tempo",detail:"Un solo referente per tutto"},{value:"care",label:"Proteggere il bene",detail:"Controlli, manutenzione e tracciabilità"},{value:"scale",label:"Strutturare il portafoglio",detail:"Processi e visione consolidata"}]},
      { key:"area", kicker:"Il territorio", title:"Dove si trova il Suo immobile?", hint:"L’operatività AUREVIA è costruita sulla conoscenza locale di Genova e della Liguria.", options:[
        {value:"genova",label:"Genova città"},{value:"levante",label:"Riviera di Levante"},{value:"ponente",label:"Riviera di Ponente"},{value:"other",label:"Altro / progetto in valutazione"}]},
      { key:"timing", kicker:"Il momento", title:"Quando vorrebbe avviare il progetto?", hint:"Questo dato ci permette di calibrare la priorità e le prime azioni suggerite.", options:[
        {value:"now",label:"Il prima possibile",detail:"Entro 30 giorni"},{value:"quarter",label:"Nei prossimi 3 mesi"},{value:"semester",label:"Tra 3 e 6 mesi"},{value:"explore",label:"Sto ancora valutando"}]},
    ],
    contactKicker:"La diagnosi è pronta", contactTitle:"Dove possiamo inviarLe il risultato?", contactText:"Inserisca i Suoi dati per generare il profilo completo. Non riceverà newsletter generiche: useremo queste informazioni esclusivamente per la diagnosi e l’eventuale contatto richiesto.", first:"Nome", last:"Cognome", email:"E-mail professionale", phone:"Telefono (facoltativo)", consent:"Accetto che AUREVIA utilizzi questi dati per inviarmi la diagnosi e ricontattarmi in merito al progetto.", privacy:"Informativa sulla privacy", submit:"Genera la mia diagnosi", sending:"Generazione in corso…", error:"Non è stato possibile generare la diagnosi. Riprovi tra poco."
  },
  en: {
    top:"Private assessment", back:"Back to website", confidential:"Confidential data", step:"Step", of:"of", continue:"Continue",
    introKicker:"Free audit · Genoa and Liguria", introTitle:"What strategy does your property deserve?", introText:"In a few steps, we analyse your property profile, current position and priorities. You receive an initial AUREVIA diagnosis and the most suitable management path.", introStart:"Start my assessment", introTime:"About 2 minutes", proof:["Tailored analysis","Instant recommendation","No commitment"],
    questions:[
      {key:"portfolio",kicker:"Scope",title:"How many properties would you like to entrust or enhance?",hint:"The number of properties determines the right level of coordination and reporting.",options:[{value:"1",label:"1 property",detail:"Complete dedicated management"},{value:"2-4",label:"2 to 4",detail:"Small portfolio coordination"},{value:"5-15",label:"5 to 15",detail:"Consolidated management and reporting"},{value:"16+",label:"16 or more",detail:"A bespoke organisation"}]},
      {key:"status",kicker:"Current position",title:"Where are you today?",hint:"The diagnosis distinguishes between launch, optimisation and asset protection.",options:[{value:"active",label:"Already short-term rented",detail:"Listing and bookings are active"},{value:"launch",label:"Ready to launch",detail:"The project has not started yet"},{value:"managed",label:"Already professionally managed",detail:"I want to compare performance"},{value:"secondary",label:"Second home",detail:"I want protection and flexibility"}]},
      {key:"objective",kicker:"Priority",title:"Which outcome matters most?",hint:"AUREVIA balances performance, property care and guest experience. Your priority determines the action plan.",options:[{value:"revenue",label:"Increase revenue",detail:"Pricing, occupancy and stay length"},{value:"time",label:"Free up my time",detail:"One point of contact for everything"},{value:"care",label:"Protect the property",detail:"Checks, maintenance and traceability"},{value:"scale",label:"Structure my portfolio",detail:"Processes and consolidated oversight"}]},
      {key:"area",kicker:"Location",title:"Where is your property located?",hint:"AUREVIA’s operations are built on local knowledge of Genoa and Liguria.",options:[{value:"genova",label:"Genoa"},{value:"levante",label:"Eastern Riviera"},{value:"ponente",label:"Western Riviera"},{value:"other",label:"Other / under consideration"}]},
      {key:"timing",kicker:"Timing",title:"When would you like to begin?",hint:"This allows us to calibrate urgency and the first recommended actions.",options:[{value:"now",label:"As soon as possible",detail:"Within 30 days"},{value:"quarter",label:"Within 3 months"},{value:"semester",label:"In 3 to 6 months"},{value:"explore",label:"I am still exploring"}]}
    ],
    contactKicker:"Your diagnosis is ready",contactTitle:"Where should we send your result?",contactText:"Enter your details to generate the full profile. You will not receive generic newsletters; we only use this information for your diagnosis and any requested follow-up.",first:"First name",last:"Last name",email:"Professional email",phone:"Phone (optional)",consent:"I agree that AUREVIA may use this information to send my diagnosis and contact me about this project.",privacy:"Privacy policy",submit:"Generate my diagnosis",sending:"Generating…",error:"We could not generate your diagnosis. Please try again shortly."
  },
  fr: {
    top:"Diagnostic privé",back:"Retour au site",confidential:"Données confidentielles",step:"Étape",of:"sur",continue:"Continuer",
    introKicker:"Audit offert · Gênes et Ligurie",introTitle:"Quelle stratégie mérite votre propriété ?",introText:"En quelques étapes, nous analysons le profil du bien, sa situation actuelle et votre priorité. Vous recevez un premier diagnostic AUREVIA et le parcours de gestion le plus adapté.",introStart:"Commencer mon diagnostic",introTime:"Environ 2 minutes",proof:["Analyse personnalisée","Recommandation immédiate","Sans engagement"],
    questions:[
      {key:"portfolio",kicker:"Le périmètre",title:"Combien de biens souhaitez-vous confier ou valoriser ?",hint:"Le nombre de biens détermine le niveau de coordination et de reporting le plus efficace.",options:[{value:"1",label:"1 bien",detail:"Une gestion dédiée et complète"},{value:"2-4",label:"De 2 à 4",detail:"Coordination d’un petit portefeuille"},{value:"5-15",label:"De 5 à 15",detail:"Pilotage et reporting consolidé"},{value:"16+",label:"16 ou plus",detail:"Une organisation sur mesure"}]},
      {key:"status",kicker:"La situation",title:"Où en êtes-vous aujourd’hui ?",hint:"Le diagnostic distingue le lancement, l’optimisation et la protection patrimoniale.",options:[{value:"active",label:"Déjà en location courte durée",detail:"L’annonce et les réservations sont actives"},{value:"launch",label:"À mettre en location",detail:"Le projet doit encore être lancé"},{value:"managed",label:"Déjà confié à un gestionnaire",detail:"Je veux comparer les performances"},{value:"secondary",label:"Résidence secondaire",detail:"Je veux la protéger et l’utiliser librement"}]},
      {key:"objective",kicker:"La priorité",title:"Quel résultat compte le plus pour vous ?",hint:"AUREVIA coordonne rendement, soin du bien et expérience voyageur. Votre priorité détermine l’ordre des actions.",options:[{value:"revenue",label:"Augmenter les revenus",detail:"Tarifs, occupation et durée des séjours"},{value:"time",label:"Libérer mon temps",detail:"Un interlocuteur unique pour tout"},{value:"care",label:"Protéger le bien",detail:"Contrôles, maintenance et traçabilité"},{value:"scale",label:"Structurer le portefeuille",detail:"Processus et vision consolidée"}]},
      {key:"area",kicker:"Le territoire",title:"Où se situe votre bien ?",hint:"L’action d’AUREVIA repose sur une connaissance locale de Gênes et de la Ligurie.",options:[{value:"genova",label:"Gênes"},{value:"levante",label:"Riviera du Levant"},{value:"ponente",label:"Riviera du Ponant"},{value:"other",label:"Autre / projet à l’étude"}]},
      {key:"timing",kicker:"Le moment",title:"Quand souhaitez-vous démarrer ?",hint:"Cette donnée permet de calibrer la priorité et les premières actions recommandées.",options:[{value:"now",label:"Dès que possible",detail:"Sous 30 jours"},{value:"quarter",label:"Dans les 3 prochains mois"},{value:"semester",label:"Entre 3 et 6 mois"},{value:"explore",label:"Je suis encore en réflexion"}]}
    ],
    contactKicker:"Votre diagnostic est prêt",contactTitle:"Où pouvons-nous envoyer votre résultat ?",contactText:"Renseignez vos coordonnées pour générer le profil complet. Vous ne recevrez pas de newsletter générique : ces informations servent uniquement au diagnostic et au suivi demandé.",first:"Prénom",last:"Nom",email:"E-mail professionnel",phone:"Téléphone (facultatif)",consent:"J’accepte qu’AUREVIA utilise ces informations pour m’envoyer le diagnostic et me recontacter au sujet de ce projet.",privacy:"Politique de confidentialité",submit:"Générer mon diagnostic",sending:"Génération en cours…",error:"Impossible de générer votre diagnostic. Réessayez dans un instant."
  }
};

const initial: Answers = { portfolio:"", status:"", objective:"", area:"", timing:"" };

function auditResult(answers: Answers) {
  const portfolio = answers.portfolio === "16+" ? 18 : answers.portfolio === "5-15" ? 10 : answers.portfolio === "2-4" ? 3 : 1;
  const urgency = answers.timing === "now" ? 92 : answers.timing === "quarter" ? 78 : answers.timing === "semester" ? 62 : 48;
  const revenue = Math.min(94, 58 + (answers.status === "active" || answers.status === "managed" ? 16 : 8) + (answers.objective === "revenue" ? 14 : 5));
  const operations = Math.min(96, 57 + (answers.objective === "time" ? 19 : 8) + (portfolio > 1 ? 12 : 4));
  const protection = Math.min(95, 61 + (answers.objective === "care" || answers.status === "secondary" ? 22 : 8));
  const fit = Math.round((urgency + revenue + operations + protection) / 4);
  return { portfolio, urgency, revenue, operations, protection, fit, offer: portfolio >= 5 || answers.objective === "scale" ? "privilege" : "serenity" };
}

function FunnelHeader({ label }: { label: string }) {
  return <header className="audit-header">
    <Link href="/" className="audit-logo" aria-label="AUREVIA"><Image src="/images/brand/aurevia-logo-transparent-gold.png" width={280} height={280} priority alt="AUREVIA"/></Link>
    <span className="audit-header-label">{label}</span>
    <div className="audit-languages" data-no-translate><LanguageOptions/></div>
  </header>;
}

export function AuditFunnel() {
  const { locale } = useLocale();
  const t = copy[locale];
  const router = useRouter();
  const [screen, setScreen] = useState(-1);
  const [answers, setAnswers] = useState<Answers>(initial);
  const [status, setStatus] = useState("");
  const result = useMemo(() => auditResult(answers), [answers]);
  const total = t.questions.length + 1;

  function choose(key: keyof Answers, value: string) {
    setAnswers(current => ({...current, [key]: value}));
    window.setTimeout(() => setScreen(current => current + 1), 180);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(t.sending);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const optionLabel = (key: keyof Answers) => t.questions.find(q => q.key === key)?.options.find(o => o.value === answers[key])?.label || answers[key];
    const payload = {
      ...data,
      ...answers,
      propertyCount: optionLabel("portfolio"),
      subject: "Audit AUREVIA",
      objective: optionLabel("objective"),
      city: optionLabel("area"),
      timeline: optionLabel("timing"),
      message: `Audit publicitaire — ${optionLabel("portfolio")} · ${optionLabel("status")} · ${optionLabel("objective")} · ${optionLabel("area")} · ${optionLabel("timing")} · Score ${result.fit}/100 · Recommandation ${result.offer}`,
    };
    try {
      const response = await fetch("/api/valuation", {method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(payload)});
      if (!response.ok) throw new Error("submission_failed");
      sessionStorage.setItem("aurevia-audit", JSON.stringify({answers, result, name:data.name, locale}));
      router.push("/audit/grazie");
    } catch { setStatus(t.error); }
  }

  return <div className="audit-shell" data-no-translate>
    <FunnelHeader label={t.top}/>
    <div className="audit-ambient" aria-hidden="true"><span/><span/><span/></div>
    {screen === -1 ? <section className="audit-intro">
      <div className="audit-intro-copy">
        <p className="audit-kicker">{t.introKicker}</p>
        <h1>{t.introTitle}</h1>
        <p>{t.introText}</p>
        <button className="audit-primary" onClick={() => setScreen(0)}>{t.introStart}<ArrowRight size={18}/></button>
        <small><Clock3 size={14}/>{t.introTime}</small>
      </div>
      <div className="audit-intro-visual">
        <div className="audit-orbit"><div className="audit-seal"><Image src="/images/brand/aurevia-symbol-gold.svg" width={72} height={72} alt=""/><span>AUREVIA</span><small>Property intelligence</small></div></div>
        <div className="audit-proof">{t.proof.map((item, index)=><span key={item}><b>0{index+1}</b>{item}</span>)}</div>
      </div>
    </section> : <section className="audit-workspace">
      <aside className="audit-side">
        <p>{t.confidential}</p><ShieldCheck size={20}/>
        <div className="audit-side-line"/>
        <strong>{String(Math.min(screen + 1, total)).padStart(2,"0")}</strong><span>/ {String(total).padStart(2,"0")}</span>
        <small>AUREVIA<br/>Property intelligence</small>
      </aside>
      <div className="audit-panel">
        <div className="audit-progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={Math.min(screen+1,total)}><span style={{width:`${(Math.min(screen+1,total)/total)*100}%`}}/></div>
        <div className="audit-step-meta"><span>{t.step} {Math.min(screen+1,total)} {t.of} {total}</span>{screen > 0 && <button onClick={() => {setStatus("");setScreen(current=>current-1)}}><ArrowLeft size={15}/>{t.back}</button>}</div>
        {screen < t.questions.length ? (() => {
          const question = t.questions[screen];
          const icons = [Building2, KeyRound, TrendingUp, MapPin, Clock3];
          const Icon = icons[screen] || Home;
          return <div className="audit-question" key={`${locale}-${question.key}`}>
            <div className="audit-question-icon"><Icon size={21}/></div><p className="audit-kicker">{question.kicker}</p><h2>{question.title}</h2><p className="audit-question-hint">{question.hint}</p>
            <div className="audit-options">{question.options.map((option,index)=><button key={option.value} className={answers[question.key]===option.value?"is-selected":""} onClick={()=>choose(question.key,option.value)}><span className="audit-option-key">{String.fromCharCode(65+index)}</span><span><b>{option.label}</b>{option.detail&&<small>{option.detail}</small>}</span><span className="audit-option-check"><Check size={14}/></span></button>)}</div>
          </div>;
        })() : <form className="audit-contact" onSubmit={submit}>
          <div className="audit-ready"><Sparkles size={18}/><span>{t.contactKicker}</span><strong>{result.fit}/100</strong></div>
          <h2>{t.contactTitle}</h2><p>{t.contactText}</p>
          <input className="honeypot" name="website" tabIndex={-1} autoComplete="off"/>
          <div className="audit-field-row"><label>{t.first}<input required name="name" maxLength={80} autoComplete="given-name"/></label><label>{t.last}<input required name="surname" maxLength={80} autoComplete="family-name"/></label></div>
          <div className="audit-field-row"><label>{t.email}<input required name="email" type="email" maxLength={160} autoComplete="email"/></label><label>{t.phone}<input name="phone" type="tel" maxLength={40} autoComplete="tel"/></label></div>
          <label className="audit-consent"><input required type="checkbox" name="consent"/><span>{t.consent} <Link href="/privacy" target="_blank">{t.privacy}</Link>.</span></label>
          <button className="audit-primary" type="submit" disabled={status===t.sending}>{status===t.sending?t.sending:t.submit}<ArrowRight size={18}/></button>
          <div className="audit-status" role="status">{status && status !== t.sending ? status : ""}</div>
        </form>}
      </div>
    </section>}
  </div>;
}
