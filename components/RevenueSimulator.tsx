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
 const set=(k:keyof SimulatorInput,v:string|number|boolean)=>setI(x=>({...x,[k]:v}));
 return <div className="simulator-layout">
  <form className="form-card" onSubmit={e=>e.preventDefault()}>
   <p className="eyebrow">Situation actuelle et potentiel</p>
   <div className="field-row"><label>Taux d’occupation actuel : {currentOccupancy}%<input type="range" min="0" max="100" value={currentOccupancy} onChange={e=>setCurrentOccupancy(+e.target.value)}/></label><label>Tarif actuel par nuit (€)<input type="number" min="0" value={currentNightly} onChange={e=>setCurrentNightly(+e.target.value)}/></label></div>
   <p className="form-hint">À titre indicatif, une gestion active vise souvent une occupation comprise entre 50 % et 80 %, selon la saison, le bien et sa disponibilité.</p>
   <p className="eyebrow simulator-subhead">Caractéristiques du bien</p>
   <div className="field-row">
    <label>Localisation<select value={i.location} onChange={e=>set("location",e.target.value)}>{["Gênes","Nervi","Camogli","Rapallo","Santa Margherita Ligure","Portofino","Autre localité en Ligurie"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Type de bien<select value={i.type} onChange={e=>set("type",e.target.value)}>{["Appartement","Attique","Villa","Maison indépendante"].map(x=><option key={x}>{x}</option>)}</select></label>
   </div>
   <div className="field-row"><label>Chambres<input type="number" min="1" max="10" value={i.bedrooms} onChange={e=>set("bedrooms",+e.target.value)}/></label><label>Capacité d’accueil<input type="number" min="1" max="20" value={i.guests} onChange={e=>set("guests",+e.target.value)}/></label></div>
   <div className="field-row"><label>Surface en m²<input type="number" min="25" max="1000" value={i.area} onChange={e=>set("area",+e.target.value)}/></label><label>Niveau de finition<select value={i.finish} onChange={e=>set("finish",e.target.value)}>{["Essentiel","Soigné","Premium","Luxe"].map(x=><option key={x}>{x}</option>)}</select></label></div>
   <label>Disponibilité annuelle : {i.days} jours<input type="range" min="60" max="365" value={i.days} onChange={e=>set("days",+e.target.value)}/></label>
   <div className="field-row">{([["sea","Vue mer"],["pool","Piscine"],["terrace","Terrasse"],["parking","Parking"]] as const).map(([k,l])=><label key={k}><span><input type="checkbox" checked={i[k]} onChange={e=>set(k,e.target.checked)}/> {l}</span></label>)}</div>
  </form>
  <motion.aside className="result-panel" key={r.annual} initial={{opacity:.5,y:10}} animate={{opacity:1,y:0}}>
   <p className="eyebrow dark">Projection indicative</p>
   <small>Revenus annuels estimés</small><strong>{euro(r.annual)}</strong>
   <p className="range">{euro(r.low)} — {euro(r.high)}</p>
   <div className="result-grid">
    <div><small>Tarif moyen par nuit</small>{euro(r.nightly)}</div>
    <div><small>Taux d’occupation</small>{r.occupancy}%</div>
    <div><small>Nuits réservées estimées</small>{r.bookedNights}</div>
    <div><small>Moyenne mensuelle</small>{euro(r.monthlyAverage)}</div>
    <div><small>Haute saison</small>{euro(r.seasonHigh)}/nuit</div>
    <div><small>Basse saison</small>{euro(r.seasonLow)}/nuit</div>
    <div><small>Revenu actuel estimé</small>{euro(Math.round(currentNightly*i.days*(currentOccupancy/100)))}</div>
    <div><small>Potentiel de progression</small>{euro(Math.max(0,r.annual-Math.round(currentNightly*i.days*(currentOccupancy/100))))}</div>
   </div>
   <p className="demo-note">Cette projection est purement indicative et ne constitue pas une garantie de revenus. L’estimation définitive nécessite une analyse personnalisée du bien, de sa saisonnalité et de son positionnement.</p>
   <Link className="button" href="/valutazione">Recevoir une évaluation personnalisée</Link>
  </motion.aside>
 </div>;
}
