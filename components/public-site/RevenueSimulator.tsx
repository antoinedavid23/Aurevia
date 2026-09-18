"use client";

import { useId, useMemo, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { calculateManagedProjection, SimulatorInput } from "@/lib/public-site/simulator";
import { useLocale } from "@/components/LocaleController";
import { ItalianContent } from "@/components/public-site/ItalianContent";

const initial: SimulatorInput = {
  location: "Castelletto",
  type: "Trois-pièces",
  bedrooms: 2,
  guests: 4,
  area: 75,
  finish: "Soigné",
  transit: true,
  elevator: true,
  outdoor: true,
  parking: false,
  days: 260,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const rangeStyle = (value: number, min: number, max: number): CSSProperties => ({
  "--range-progress": `${((clamp(value, min, max) - min) / (max - min)) * 100}%`,
} as CSSProperties);

export function RevenueSimulator() {
  const { locale } = useLocale();
  const occupancyId = useId();
  const availabilityId = useId();
  const euro = (value: number) => new Intl.NumberFormat({ it: "it-IT", fr: "fr-FR", en: "en-GB" }[locale], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
  const decimal = (value: number) => new Intl.NumberFormat({ it: "it-IT", fr: "fr-FR", en: "en-GB" }[locale], { maximumFractionDigits: 1 }).format(value);
  const [i, setI] = useState(initial);
  const [currentOccupancy, setCurrentOccupancy] = useState(60);
  const [currentNightly, setCurrentNightly] = useState(82);
  const projected = useMemo(() => calculateManagedProjection({ ...i, currentNightly, currentOccupancy }), [currentNightly, currentOccupancy, i]);
  const copy = {
    it: {
      hint: "Il modello parte dai Suoi dati attuali e modula il risultato in base a quartiere, configurazione, superficie, capienza, stato, dotazioni e disponibilità. Non è una promessa di rendimento.",
      reading: `Il calcolo combina la disponibilità effettiva con tutte le caratteristiche indicate per l’immobile.`,
      availability: "Disponibilità gestita",
      availabilityText: `Il calendario porta a ${projected.additionalNights} notti aggiuntive nello scenario centrale, circa ${euro(projected.occupancyContribution)} alla tariffa attuale.`,
      property: "Caratteristiche dell’immobile",
      propertyText: `Quartiere, configurazione, ${i.area} m², ${i.guests} ospiti, stato e ${projected.activeAmenities} dotazioni attive contribuiscono al calcolo.`,
      pricing: "Tariffa contestualizzata",
      pricingText: `La tariffa media passa da ${euro(projected.nightlyNow)} a ${euro(projected.nightly)}, una variazione moderata del ${decimal(projected.priceLiftPercent)}%.`,
      rangeLabel: "Intervallo prudente:", rangeJoiner: "–", outOf: "su",
    },
    en: {
      hint: "The model starts with your current figures and adjusts the scenario for neighbourhood, layout, floor area, capacity, condition, amenities and availability. It is not a performance promise.",
      reading: "The calculation combines real availability with every property characteristic entered.",
      availability: "Managed availability",
      availabilityText: `The central scenario adds ${projected.additionalNights} booked nights, worth about ${euro(projected.occupancyContribution)} at the current nightly rate.`,
      property: "Property characteristics",
      propertyText: `Neighbourhood, layout, ${i.area} m², ${i.guests} guests, condition and ${projected.activeAmenities} selected amenities all contribute to the calculation.`,
      pricing: "Contextual pricing",
      pricingText: `The average nightly rate moves from ${euro(projected.nightlyNow)} to ${euro(projected.nightly)}, a moderate ${decimal(projected.priceLiftPercent)}% change.`,
      rangeLabel: "Prudent range:", rangeJoiner: "to", outOf: "of",
    },
    fr: {
      hint: "Le modèle part de vos chiffres actuels et module le scénario selon le quartier, la configuration, la surface, la capacité, l’état, les équipements et la disponibilité. Il ne constitue pas une promesse de performance.",
      reading: "Le calcul combine la disponibilité réelle avec toutes les caractéristiques renseignées pour le bien.",
      availability: "Disponibilité pilotée",
      availabilityText: `Le calendrier ajoute ${projected.additionalNights} nuits dans le scénario central, soit environ ${euro(projected.occupancyContribution)} au prix actuel.`,
      property: "Caractéristiques du bien",
      propertyText: `Quartier, configuration, ${i.area} m², ${i.guests} voyageurs, état et ${projected.activeAmenities} équipements activés participent au calcul.`,
      pricing: "Prix contextualisé",
      pricingText: `Le prix moyen passe de ${euro(projected.nightlyNow)} à ${euro(projected.nightly)}, soit une évolution mesurée de ${decimal(projected.priceLiftPercent)} %.`,
      rangeLabel: "Fourchette prudente :", rangeJoiner: "à", outOf: "sur",
    },
  }[locale];
  const set = (key: keyof SimulatorInput, value: string | number | boolean) => setI((current) => ({ ...current, [key]: value }));

  return <ItalianContent><div className="simulator-layout simulator-classic">
    <form className="form-card simulator-form" onSubmit={(event) => event.preventDefault()}>
      <section className="simulator-form-section simulator-current-section">
        <p className="eyebrow"><span>01</span> Votre situation aujourd’hui</p>
        <div className="field-row">
          <label htmlFor={occupancyId}>Taux moyen de réservation <output htmlFor={occupancyId} aria-hidden="true">{currentOccupancy}%</output><input id={occupancyId} className="aurevia-range" style={rangeStyle(currentOccupancy, 25, 100)} type="range" min="25" max="100" step="1" value={currentOccupancy} aria-valuetext={`${currentOccupancy}%`} onChange={(event) => setCurrentOccupancy(+event.target.value)} /></label>
          <label>Prix moyen facturé par nuit <span className="simulator-price-field"><input type="number" min="20" max="200" step="1" value={currentNightly} onChange={(event) => setCurrentNightly(+event.target.value)} onBlur={() => setCurrentNightly((value) => clamp(value || 20, 20, 200))} /><small>€ / nuit</small></span></label>
        </div>
        <p className="form-hint" data-no-translate>{copy.hint}</p>
      </section>

      <section className="simulator-form-section simulator-property-section">
        <p className="eyebrow simulator-subhead"><span>02</span> Votre bien</p>
        <div className="field-row">
          <label>Quartier<select value={i.location} onChange={(event) => set("location", event.target.value)}>{["Centro storico", "Castelletto", "Albaro", "Foce", "Marassi", "Sampierdarena", "Nervi", "Boccadasse", "Autre quartier de Genova"].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
          <label>Configuration<select value={i.type} onChange={(event) => set("type", event.target.value)}>{["Studio", "Deux-pièces", "Trois-pièces", "Quatre-pièces et plus", "Petit logement indépendant"].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        </div>
        <div className="field-row simulator-compact-grid">
          <label>Chambres<input type="number" min="0" max="5" value={i.bedrooms} onChange={(event) => set("bedrooms", +event.target.value)} /></label>
          <label>Voyageurs accueillis<input type="number" min="1" max="8" value={i.guests} onChange={(event) => set("guests", +event.target.value)} /></label>
        </div>
        <div className="field-row simulator-compact-grid">
          <label>Surface en m²<input type="number" min="20" max="180" value={i.area} onChange={(event) => set("area", +event.target.value)} /></label>
          <label>Présentation du logement<select value={i.finish} onChange={(event) => set("finish", event.target.value)}>{["À rafraîchir", "Simple et fonctionnel", "Soigné", "Très soigné"].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        </div>
        <label htmlFor={availabilityId}>Jours disponibles à la location <output htmlFor={availabilityId} aria-hidden="true">{i.days} jours</output><input id={availabilityId} className="aurevia-range" style={rangeStyle(i.days, 90, 365)} type="range" min="90" max="365" value={i.days} onChange={(event) => set("days", +event.target.value)} /></label>
        <div className="field-row simulator-amenities">{([
          ["transit", "Transports proches"],
          ["elevator", "Ascenseur"],
          ["outdoor", "Balcon ou terrasse"],
          ["parking", "Parking"],
        ] as const).map(([key, label]) => <label key={key}><input type="checkbox" checked={i[key]} onChange={(event) => set(key, event.target.checked)} /><span>{label}</span></label>)}</div>
      </section>
    </form>

    <motion.aside className="result-panel" key={`${projected.annual}-${projected.occupancy}`} initial={{ opacity: .55, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <p className="eyebrow dark">Ordre de grandeur</p>
      <small>Revenu locatif brut projeté</small>
      <strong>≈ {euro(projected.annual)} <i>/ an</i></strong>
      <p className="range" data-no-translate>{copy.rangeLabel} {euro(projected.low)} {copy.rangeJoiner} {euro(projected.high)}</p>
      <div className="result-grid">
        <div className="result-metric result-metric-current"><small>Situation actuelle</small><span>{euro(projected.currentAnnual)}</span><i>revenu annuel estimé</i></div>
        <div className="result-metric result-metric-projected"><small>Projection centrale</small><span>{euro(projected.annual)}</span><i>revenu annuel indicatif</i></div>
        <div className="result-metric"><small>Prix moyen par nuit</small><span>{euro(projected.nightlyNow)} → {euro(projected.nightly)}</span></div>
        <div className="result-metric"><small>Occupation moyenne</small><span>{currentOccupancy}% → {projected.occupancy}% <em>+{projected.occupancyLift} pts</em></span></div>
        <div className="result-metric"><small>Nuits réservées</small><span data-no-translate>{projected.bookedNights} <i>{copy.outOf} {i.days}</i></span></div>
        <div className="result-metric result-metric-gain"><small>Progression annuelle</small><span>+ {euro(projected.gain)}</span></div>
      </div>
      <div className="result-explanation">
        <p className="eyebrow dark">Comment lire cette estimation&nbsp;?</p>
        <p data-no-translate>{copy.reading}</p>
        <div data-no-translate><span><b>01</b><small>{copy.availability}</small></span><p>{copy.availabilityText}</p></div>
        <div data-no-translate><span><b>02</b><small>{copy.property}</small></span><p>{copy.propertyText}</p></div>
        <div data-no-translate><span><b>03</b><small>{copy.pricing}</small></span><p>{copy.pricingText}</p></div>
      </div>
      <p className="demo-note">Estimation brute, indicative et non contractuelle, avant commission, ménage, charges, fiscalité et éventuels travaux. La saison, le micro-quartier, la réglementation et la qualité réelle du logement peuvent modifier le résultat.</p>
      <Link className="button" href="/valutazione">Obtenir une analyse du bien</Link>
    </motion.aside>
  </div></ItalianContent>;
}
