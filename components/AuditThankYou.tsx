"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { LanguageOptions, useLocale } from "@/components/LocaleController";
import type { Locale } from "@/lib/i18n";

type StoredAudit = { result:{fit:number;revenue:number;operations:number;protection:number;urgency:number;offer:"serenity"|"privilege"}; name?:string };

const thanks = {
  it:{label:"Diagnosi completata",title:"Il Suo profilo AUREVIA è pronto",hello:"Grazie",intro:"Le risposte indicano un potenziale concreto di miglioramento. Ecco la prima lettura strategica del Suo progetto.",fit:"Compatibilità AUREVIA",metrics:["Potenziale ricavi","Semplificazione operativa","Protezione del bene","Priorità del progetto"],recommended:"Percorso consigliato",serenity:"Gestione Serenità",privilege:"Soluzione Privilegio",serenityText:"Gestione completa dell’immobile, ottimizzazione dei ricavi e un unico referente.",privilegeText:"Struttura su misura, pilotaggio centralizzato e reporting consolidato per il portafoglio.",priorities:"Le 3 priorità rilevate",items:["Rivedere posizionamento, calendario e strategia tariffaria","Ridurre i punti di attrito nella gestione quotidiana","Definire un piano di cura e controllo documentato"],locked:"Piano d’azione riservato",lockedText:"Le azioni dettagliate, i punti di vigilanza e la stima del percorso vengono sbloccati durante una consulenza di 20 minuti.",cta:"Prenota la consulenza gratuita",calendar:"20 minuti · Riservato · Senza impegno",note:"La diagnosi è indicativa e sarà verificata sulla base delle caratteristiche reali del bene.",back:"Torna al sito"},
  en:{label:"Assessment complete",title:"Your AUREVIA profile is ready",hello:"Thank you",intro:"Your answers show tangible room for improvement. Here is the first strategic reading of your project.",fit:"AUREVIA fit",metrics:["Revenue potential","Operational simplicity","Property protection","Project priority"],recommended:"Recommended path",serenity:"Serenity Management",privilege:"Privilege Solution",serenityText:"Complete property management, revenue optimisation and one dedicated point of contact.",privilegeText:"A bespoke structure, centralised oversight and consolidated portfolio reporting.",priorities:"Your 3 identified priorities",items:["Review positioning, availability and pricing strategy","Remove friction from day-to-day management","Define a documented care and inspection plan"],locked:"Private action plan",lockedText:"Detailed actions, risk points and the proposed roadmap are unlocked during a 20-minute consultation.",cta:"Book my free consultation",calendar:"20 minutes · Private · No commitment",note:"This assessment is indicative and will be verified against the property’s actual characteristics.",back:"Back to website"},
  fr:{label:"Diagnostic terminé",title:"Votre profil AUREVIA est prêt",hello:"Merci",intro:"Vos réponses révèlent un potentiel concret d’amélioration. Voici une première lecture stratégique de votre projet.",fit:"Compatibilité AUREVIA",metrics:["Potentiel de revenus","Simplification opérationnelle","Protection du bien","Priorité du projet"],recommended:"Parcours recommandé",serenity:"Gestion Sérénité",privilege:"Solution Privilège",serenityText:"Gestion complète du bien, optimisation des revenus et un interlocuteur unique.",privilegeText:"Organisation sur mesure, pilotage centralisé et reporting consolidé pour le portefeuille.",priorities:"Vos 3 priorités détectées",items:["Revoir le positionnement, le calendrier et la stratégie tarifaire","Réduire les points de friction dans la gestion quotidienne","Définir un plan documenté de soin et de contrôle"],locked:"Plan d’action confidentiel",lockedText:"Les actions détaillées, points de vigilance et l’estimation du parcours sont débloqués lors d’un échange de 20 minutes.",cta:"Réserver ma consultation offerte",calendar:"20 minutes · Confidentiel · Sans engagement",note:"Ce diagnostic est indicatif et sera vérifié selon les caractéristiques réelles du bien.",back:"Retour au site"}
} satisfies Record<Locale, Record<string, unknown>>;

export function AuditThankYou(){
  const {locale}=useLocale(); const t=thanks[locale]; const [stored,setStored]=useState<StoredAudit|null>(null);
  useEffect(()=>{try{const value=sessionStorage.getItem("aurevia-audit");if(value)setStored(JSON.parse(value));}catch{}},[]);
  const result=stored?.result || {fit:82,revenue:84,operations:79,protection:88,urgency:76,offer:"serenity" as const};
  const metrics=useMemo(()=>[result.revenue,result.operations,result.protection,result.urgency],[result]);
  const bookingUrl=process.env.NEXT_PUBLIC_BOOKING_URL || "/contatti?source=audit";
  return <div className="audit-shell audit-result-shell" data-no-translate>
    <header className="audit-header"><Link href="/" className="audit-logo" aria-label="AUREVIA"><Image src="/images/brand/aurevia-logo-transparent-gold.png" width={280} height={280} priority alt="AUREVIA"/></Link><span className="audit-header-label">{t.label}</span><div className="audit-languages"><LanguageOptions/></div></header>
    <main className="audit-result">
      <section className="audit-result-head"><div><p className="audit-kicker"><Check size={14}/>{t.label}</p><h1>{t.title}</h1><p>{stored?.name?`${t.hello}, ${stored.name}. `:""}{t.intro}</p></div><div className="audit-score"><span>{t.fit}</span><strong>{result.fit}</strong><small>/100</small><div aria-hidden="true"><i style={{width:`${result.fit}%`}}/></div></div></section>
      <section className="audit-result-grid">
        <div className="audit-report">
          <div className="audit-metrics">{t.metrics.map((label,index)=><div key={label}><span>{label}</span><b>{metrics[index]}/100</b><div><i style={{width:`${metrics[index]}%`}}/></div></div>)}</div>
          <div className="audit-recommendation"><span>{t.recommended}</span><h2>{result.offer==="privilege"?t.privilege:t.serenity}</h2><p>{result.offer==="privilege"?t.privilegeText:t.serenityText}</p><div><ShieldCheck size={18}/><span>AUREVIA · Genova &amp; Liguria</span></div></div>
          <div className="audit-priorities"><h3>{t.priorities}</h3>{t.items.map((item,index)=><div key={item}><span>0{index+1}</span><p>{item}</p><Check size={16}/></div>)}</div>
        </div>
        <aside className="audit-unlock">
          <div className="audit-blurred" aria-hidden="true"><span/><span/><span/><span/><span/></div>
          <div className="audit-unlock-content"><LockKeyhole size={30}/><p className="audit-kicker">{t.locked}</p><h2>{t.locked}</h2><p>{t.lockedText}</p><Link className="audit-primary" href={bookingUrl}>{t.cta}<ArrowRight size={18}/></Link><small><CalendarDays size={14}/>{t.calendar}</small></div>
        </aside>
      </section>
      <p className="audit-disclaimer">{t.note}</p><Link className="audit-back-link" href="/">{t.back}<ArrowRight size={14}/></Link>
    </main>
  </div>;
}
