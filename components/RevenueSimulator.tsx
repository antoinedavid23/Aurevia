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
  const currentAnnual=Math.round(currentNightly*i.days*(currentOccupancy/100));
  const occupancy=Math.min(80,Math.max(60,r.occupancy,currentOccupancy+12));
  const bookedNights=Math.round(i.days*(occupancy/100));
  const nightlyCeiling=Math.round(currentNightly*1.2);
  const nightly=Math.min(nightlyCeiling,Math.max(currentNightly,r.nightly));
  const annual=Math.round(nightly*bookedNights);
  return {currentAnnual,occupancy,nightly,bookedNights,annual,gain:Math.max(0,annual-currentAnnual),gainRate:currentAnnual?Math.round((annual/currentAnnual-1)*100):0,multiplier:currentAnnual?annual/currentAnnual:0};
 },[currentNightly,currentOccupancy,i.days,r]);
 const set=(k:keyof SimulatorInput,v:string|number|boolean)=>setI(x=>({...x,[k]:v}));
 return <div className="simulator-layout">
  <form className="form-card" onSubmit={e=>e.preventDefault()}>
   <p className="eyebrow">Situation actuelle et potentiel</p>
   <div className="field-row"><label>Taux d’occupation actuel : {currentOccupancy}%<input type="range" min="0" max="100" value={currentOccupancy} onChange={e=>setCurrentOccupancy(+e.target.value)}/></label><label>Tarif actuel par nuit (€)<input type="number" min="0" value={currentNightly} onChange={e=>setCurrentNightly(+e.target.value)}/></label></div>
   <p className="form-hint">Le scénario combine une meilleure occupation, des durées de séjour optimisées et une tarification dynamique. Le tarif moyen par nuit est plafonné à +20 % par rapport à votre tarif actuel.</p>
   <p className="eyebrow simulator-subhead">Caractéristiques du bien</p>
   <div className="field-row">
    <label>Localisation<input type="text" value={i.location} placeholder="Ville ou commune" autoComplete="address-level2" onChange={e=>set("location",e.target.value)}/></label>
    <label>Type de bien<select value={i.type} onChange={e=>set("type",e.target.value)}>{["Appartement","Attique","Villa","Maison indépendante"].map(x=><option key={x}>{x}</option>)}</select></label>
   </div>
   <div className="field-row"><label>Chambres<input type="number" min="1" max="10" value={i.bedrooms} onChange={e=>set("bedrooms",+e.target.value)}/></label><label>Capacité d’accueil<input type="number" min="1" max="20" value={i.guests} onChange={e=>set("guests",+e.target.value)}/></label></div>
   <div className="field-row"><label>Surface en m²<input type="number" min="25" max="1000" value={i.area} onChange={e=>set("area",+e.target.value)}/></label><label>Niveau de finition<select value={i.finish} onChange={e=>set("finish",e.target.value)}>{["Essentiel","Soigné","Premium","Luxe"].map(x=><option key={x}>{x}</option>)}</select></label></div>
   <label>Disponibilité annuelle : {i.days} jours<input type="range" min="60" max="365" value={i.days} onChange={e=>set("days",+e.target.value)}/></label>
   <div className="field-row">{([["sea","Vue mer"],["pool","Piscine"],["terrace","Terrasse"],["parking","Parking"]] as const).map(([k,l])=><label key={k}><span><input type="checkbox" checked={i[k]} onChange={e=>set(k,e.target.checked)}/> {l}</span></label>)}</div>
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
    <div><small>Nuits supplémentaires</small>+ {Math.max(0,projected.bookedNights-Math.round(i.days*(currentOccupancy/100)))}</div>
    <div><small>Hausse tarifaire maximale</small>+20 % / nuit en moyenne</div>
   </div>
   <p className="demo-note">Le potentiel représente une amélioration supposée par rapport aux données actuelles renseignées. Il ne constitue pas une garantie et doit être confirmé par une analyse du bien.</p>
   <Link className="button" href="/valutazione">Recevoir une évaluation personnalisée</Link>
  </motion.aside>
 </div>;
}
