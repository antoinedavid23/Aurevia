"use client";
import {useMemo,useState} from "react";
import {motion} from "motion/react";
import Link from "next/link";
import {calculateRevenueEstimate,SimulatorInput} from "@/lib/simulator";

const initial:SimulatorInput={location:"Gênes",type:"Appartement",bedrooms:2,guests:4,area:90,finish:"Soigné",sea:true,pool:false,terrace:true,parking:false,days:300};
const euro=(value:number)=>new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(value);

export function RevenueSimulator(){
 const [i,setI]=useState(initial);
 const [currentOccupancy,setCurrentOccupancy]=useState(45);
 const [currentNightly,setCurrentNightly]=useState(185);
 const r=useMemo(()=>calculateRevenueEstimate(i),[i]);
 const projected=useMemo(()=>{
  const currentBookedNights=Math.round(i.days*(currentOccupancy/100));
  const currentAnnual=Math.round(currentNightly*currentBookedNights);
  const occupancy=currentOccupancy>80?currentOccupancy:Math.min(80,Math.max(60,r.occupancy,currentOccupancy+12));
  const bookedNights=Math.round(i.days*(occupancy/100));
  const nightlyCeiling=Math.round(currentNightly*1.2);
  const nightly=Math.min(nightlyCeiling,Math.max(currentNightly,r.nightly));
  const annual=Math.round(nightly*bookedNights);
  const additionalNights=Math.max(0,bookedNights-currentBookedNights);
  const occupancyContribution=Math.round(additionalNights*currentNightly);
  const pricingContribution=Math.round(Math.max(0,nightly-currentNightly)*bookedNights);
  return {currentAnnual,currentBookedNights,occupancy,nightly,bookedNights,additionalNights,occupancyContribution,pricingContribution,annual,gain:Math.max(0,annual-currentAnnual),gainRate:currentAnnual?Math.round((annual/currentAnnual-1)*100):0,multiplier:currentAnnual?annual/currentAnnual:0};
 },[currentNightly,currentOccupancy,i.days,r]);
 const set=(k:keyof SimulatorInput,v:string|number|boolean)=>setI(x=>({...x,[k]:v}));
 return <div className="simulator-layout">
  <form className="form-card" onSubmit={e=>e.preventDefault()}>
   <p className="eyebrow">Situation actuelle et potentiel</p>
   <div className="field-row"><label>Taux d’occupation actuel : {currentOccupancy}%<input className="aurevia-range" style={{background:`linear-gradient(to right, #2f7acb 0%, #2f7acb ${currentOccupancy}%, rgba(255,255,255,.24) ${currentOccupancy}%, rgba(255,255,255,.24) 100%)`}} type="range" min="0" max="100" value={currentOccupancy} onChange={e=>setCurrentOccupancy(+e.target.value)}/></label><label>Tarif actuel par nuit (€)<input type="number" min="0" value={currentNightly} onChange={e=>setCurrentNightly(+e.target.value)}/></label></div>
   <p className="form-hint">Le scénario combine une meilleure occupation, des durées de séjour optimisées et une tarification dynamique. Le tarif moyen par nuit est plafonné à +20 % par rapport à votre tarif actuel.</p>
   <p className="eyebrow simulator-subhead">Caractéristiques du bien</p>
   <div className="field-row">
    <label>Localisation<input type="text" value={i.location} placeholder="Ville ou commune" autoComplete="address-level2" onChange={e=>set("location",e.target.value)}/></label>
    <label>Type de bien<select value={i.type} onChange={e=>set("type",e.target.value)}>{["Appartement","Attique","Villa","Maison indépendante"].map(x=><option key={x}>{x}</option>)}</select></label>
   </div>
   <div className="field-row"><label>Chambres<input type="number" min="1" max="10" value={i.bedrooms} onChange={e=>set("bedrooms",+e.target.value)}/></label><label>Capacité d’accueil<input type="number" min="1" max="20" value={i.guests} onChange={e=>set("guests",+e.target.value)}/></label></div>
   <div className="field-row"><label>Surface en m²<input type="number" min="25" max="1000" value={i.area} onChange={e=>set("area",+e.target.value)}/></label><label>Niveau de finition<select value={i.finish} onChange={e=>set("finish",e.target.value)}>{["Essentiel","Soigné","Premium","Luxe"].map(x=><option key={x}>{x}</option>)}</select></label></div>
   <label>Disponibilité annuelle : {i.days} jours<input className="aurevia-range" style={{background:`linear-gradient(to right, #2f7acb 0%, #2f7acb ${((i.days-60)/305)*100}%, rgba(255,255,255,.24) ${((i.days-60)/305)*100}%, rgba(255,255,255,.24) 100%)`}} type="range" min="60" max="365" value={i.days} onChange={e=>set("days",+e.target.value)}/></label>
   <div className="field-row simulator-amenities">{([["sea","Vue mer"],["pool","Piscine / jacuzzi"],["terrace","Terrasse"],["parking","Parking"]] as const).map(([k,l])=><label key={k}><input type="checkbox" checked={i[k]} onChange={e=>set(k,e.target.checked)}/><span>{l}</span></label>)}</div>
  </form>
  <motion.aside className="result-panel" key={projected.annual} initial={{opacity:.5,y:10}} animate={{opacity:1,y:0}}>
   <p className="eyebrow dark">Potentiel d’amélioration</p>
   <small>Progression annuelle estimée</small><strong>+ {euro(projected.gain)}</strong>
   <p className="range">× {projected.multiplier.toFixed(2).replace(".",",")} de chiffre d’affaires potentiel</p>
   <div className="result-grid">
    <div><small>Revenu actuel estimé</small>{euro(projected.currentAnnual)}</div>
    <div><small>Revenu optimisé estimé</small>{euro(projected.annual)}</div>
    <div><small>Tarif actuel / tarif moyen par nuit (tarification dynamique)</small>{euro(currentNightly)} → {euro(projected.nightly)}</div>
    <div><small>Occupation actuelle / cible</small>{currentOccupancy}% → {projected.occupancy}%</div>
    <div><small>Nuits supplémentaires</small>+ {projected.additionalNights}</div>
    <div><small>Hausse tarifaire maximale</small>+20 % / nuit en moyenne</div>
   </div>
   <div className="result-explanation">
    <p className="eyebrow dark">Pourquoi cet écart&nbsp;?</p>
    <p>Le potentiel ne vient pas d’une hausse unique appliquée au hasard. Il additionne deux leviers, uniquement sur les <b>{i.days} jours</b> pendant lesquels votre bien est disponible.</p>
    <div><span><b>01</b><small>Meilleure occupation</small></span><p><b>+ {projected.additionalNights} nuits</b>, soit environ <b>+ {euro(projected.occupancyContribution)}</b> au tarif actuel.</p></div>
    <div><span><b>02</b><small>Tarification dynamique</small></span><p>Un tarif moyen passant de <b>{euro(currentNightly)}</b> à <b>{euro(projected.nightly)}</b>, soit environ <b>+ {euro(projected.pricingContribution)}</b> sur les nuits projetées.</p></div>
   </div>
   <p className="demo-note">Le potentiel représente une amélioration supposée par rapport aux données actuelles renseignées. Il ne constitue pas une garantie et doit être confirmé par une analyse du bien.</p>
   <Link className="button" href="/valutazione">Recevoir une évaluation personnalisée</Link>
  </motion.aside>
 </div>;
}
