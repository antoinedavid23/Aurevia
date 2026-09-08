"use client";
import {useMemo,useState} from "react";
import {motion} from "motion/react";
import Link from "next/link";
import {calculateRevenueOptimization,SimulatorInput} from "@/lib/simulator";
import {useLocale} from "@/components/LocaleController";
import {portfolioCopy} from "@/lib/audit-portfolio";

const scenarioCopy = {
 it: { pool: "Piscina privata", label: "Variazione della tariffa", annual: "Variazione annua simulata", nights: "Variazione delle notti", hint: "Tariffa dichiarata +20% e obiettivo di occupazione del 70%: ipotesi AUREVIA da validare, non risultati garantiti.", occupancy: "Effetto delle notti vendute", pricing: "Effetto della tariffa", priceFrom: "Tariffa media", effect: "Effetto annuo" },
 fr: { pool: "Piscine privée", label: "Écart de tarif", annual: "Écart annuel simulé", nights: "Écart de nuitées", hint: "Tarif déclaré +20 % et objectif d’occupation de 70 % : hypothèses AUREVIA à valider, pas des résultats garantis.", occupancy: "Effet des nuits vendues", pricing: "Effet du tarif", priceFrom: "Tarif moyen", effect: "Effet annuel" },
 en: { pool: "Private pool", label: "Nightly-rate change", annual: "Simulated annual change", nights: "Booked-night change", hint: "Declared rate +20% and 70% target occupancy: AUREVIA assumptions to validate, not guaranteed results.", occupancy: "Booked-night effect", pricing: "Nightly-rate effect", priceFrom: "Average rate", effect: "Annual effect" },
};

const initial:SimulatorInput={location:"Gênes",type:"Appartement",bedrooms:2,guests:4,area:90,finish:"Soigné",sea:true,pool:false,terrace:true,parking:false,days:300};
const euro=(value:number)=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",minimumFractionDigits:0,maximumFractionDigits:2}).format(value);

export function RevenueSimulator(){
 const {locale}=useLocale();
 const t=scenarioCopy[locale];
 const [i,setI]=useState(initial);
 const [currentOccupancy,setCurrentOccupancy]=useState(45);
 const [currentNightly,setCurrentNightly]=useState(185);
 const projected=useMemo(()=>calculateRevenueOptimization(i,currentNightly,currentOccupancy),[currentNightly,currentOccupancy,i]);
 const signed=(value:number)=>`${value>0?"+ ":""}${euro(value)}`;
 const set=(k:keyof SimulatorInput,v:string|number|boolean)=>setI(x=>({...x,[k]:v}));
 return <div className="simulator-layout">
  <form className="form-card simulator-form" onSubmit={e=>e.preventDefault()}>
   <section className="simulator-form-section simulator-current-section">
   <p className="eyebrow"><span>01</span> Situation actuelle</p>
   <div className="field-row"><label>Taux d’occupation actuel <output>{currentOccupancy}%</output><input className="aurevia-range" style={{background:`linear-gradient(to right, #c8a15a 0%, #c8a15a ${currentOccupancy}%, rgba(255,255,255,.24) ${currentOccupancy}%, rgba(255,255,255,.24) 100%)`}} type="range" min="0" max="100" value={currentOccupancy} onChange={e=>setCurrentOccupancy(+e.target.value)}/></label><label>Tarif actuel par nuit (€)<input type="number" min="0" value={currentNightly} onChange={e=>setCurrentNightly(+e.target.value)}/></label></div>
   <p className="form-hint" data-no-translate>{portfolioCopy[locale].rateBasis}</p>
   </section>
   <section className="simulator-form-section simulator-property-section">
   <p className="eyebrow simulator-subhead"><span>02</span> Votre propriété</p>
   <div className="field-row">
    <label>Localisation<input type="text" value={i.location} placeholder="Ville ou commune" autoComplete="address-level2" onChange={e=>set("location",e.target.value)}/></label>
    <label>Type de bien<select value={i.type} onChange={e=>set("type",e.target.value)}>{["Appartement","Attique","Villa","Maison indépendante"].map(x=><option key={x}>{x}</option>)}</select></label>
   </div>
   <div className="field-row simulator-compact-grid"><label>Chambres<input type="number" min="1" max="10" value={i.bedrooms} onChange={e=>set("bedrooms",+e.target.value)}/></label><label>Capacité<input type="number" min="1" max="20" value={i.guests} onChange={e=>set("guests",+e.target.value)}/></label></div>
   <div className="field-row simulator-compact-grid"><label>Surface en m²<input type="number" min="25" max="1000" value={i.area} onChange={e=>set("area",+e.target.value)}/></label><label>Finition<select value={i.finish} onChange={e=>set("finish",e.target.value)}>{["Essentiel","Soigné","Premium","Luxe"].map(x=><option key={x}>{x}</option>)}</select></label></div>
   <label>Disponibilité annuelle <output>{i.days} jours</output><input className="aurevia-range" style={{background:`linear-gradient(to right, #c8a15a 0%, #c8a15a ${((i.days-60)/305)*100}%, rgba(255,255,255,.24) ${((i.days-60)/305)*100}%, rgba(255,255,255,.24) 100%)`}} type="range" min="60" max="365" value={i.days} onChange={e=>set("days",+e.target.value)}/></label>
   <div className="field-row simulator-amenities">{([["sea","Vue mer"],["pool",t.pool],["terrace","Terrasse"],["parking","Parking"]] as const).map(([k,l])=><label key={k}><input type="checkbox" checked={i[k]} onChange={e=>set(k,e.target.checked)}/><span data-no-translate={k==="pool"?true:undefined}>{l}</span></label>)}</div>
   </section>
  </form>
  <motion.aside className="result-panel" key={projected.annual} initial={{opacity:.5,y:10}} animate={{opacity:1,y:0}}>
   <p className="eyebrow dark">Potentiel d’amélioration</p>
   <small data-no-translate>{t.annual}</small><strong>{signed(projected.gain)}</strong>
   <p className="range">× {projected.multiplier.toFixed(2).replace(".",",")} de chiffre d’affaires potentiel</p>
   <div className="result-grid">
    <div><small>Revenu actuel estimé</small>{euro(projected.currentAnnual)}</div>
    <div><small>Revenu optimisé estimé</small>{euro(projected.annual)}</div>
    <div><small>Tarif actuel / tarif moyen par nuit (tarification dynamique)</small>{euro(currentNightly)} → {euro(projected.nightly)}</div>
    <div><small>Occupation actuelle / cible</small>{currentOccupancy}% → {projected.occupancy}%</div>
    <div><small data-no-translate>{t.nights}</small>{projected.additionalNights>0?"+ ":""}{projected.additionalNights}</div>
    <div><small data-no-translate>{t.label}</small>{projected.nightlyUpliftPercent>0?"+ ":""}{projected.nightlyUpliftPercent} %</div>
   </div>
   <div className="result-explanation">
    <p className="eyebrow dark">Pourquoi cet écart&nbsp;?</p>
    <p>Le potentiel ne vient pas d’une hausse unique appliquée au hasard. Il additionne deux leviers, uniquement sur les <b>{i.days} jours</b> pendant lesquels votre bien est disponible.</p>
    <div data-no-translate><span><b>01</b><small>{t.occupancy}</small></span><p>{t.nights} : <b>{projected.additionalNights}</b> · {t.effect} : <b>{signed(projected.occupancyContribution)}</b></p></div>
    <div data-no-translate><span><b>02</b><small>{t.pricing}</small></span><p>{t.priceFrom} : <b>{euro(currentNightly)} → {euro(projected.nightly)}</b> · {t.effect} : <b>{signed(projected.pricingContribution)}</b></p></div>
   </div>
   <p className="demo-note" data-no-translate>{t.hint}</p>
   <Link className="button" href="/valutazione">Recevoir une évaluation personnalisée</Link>
  </motion.aside>
 </div>;
}
