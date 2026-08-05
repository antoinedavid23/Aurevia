"use client";

import { useMemo, useState } from "react";
import styles from "@/app/administration/strategia/strategia.module.css";

const euro = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function StrategyEconomics() {
  const [properties, setProperties] = useState(50);
  const [adr, setAdr] = useState(150);
  const [occupancy, setOccupancy] = useState(70);
  const [fee, setFee] = useState(25);

  const metrics = useMemo(() => {
    const occupiedNights = 30 * (occupancy / 100);
    const portfolioGmv = properties * adr * occupiedNights;
    const aureviaRevenue = portfolioGmv * (fee / 100);
    const contribution = aureviaRevenue * 0.4;
    const occupancyFor200kGmv = properties && adr
      ? (200000 / (properties * adr * 30)) * 100
      : 0;
    const adrFor200kGmv = properties && occupancy
      ? 200000 / (properties * 30 * (occupancy / 100))
      : 0;
    const gmvFor200kAurevia = fee ? 200000 / (fee / 100) : 0;
    const occupancyFor200kAurevia = properties && adr && fee
      ? (gmvFor200kAurevia / (properties * adr * 30)) * 100
      : 0;
    return {
      occupiedNights,
      portfolioGmv,
      aureviaRevenue,
      contribution,
      occupancyFor200kGmv,
      adrFor200kGmv,
      gmvFor200kAurevia,
      occupancyFor200kAurevia,
    };
  }, [properties, adr, occupancy, fee]);

  return <div className={styles.calculator}>
    <div className={styles.controls}>
      <label>Immobili
        <input type="range" min="1" max="80" value={properties} onChange={(event) => setProperties(Number(event.target.value))}/>
        <output>{properties}</output>
      </label>
      <label>ADR medio
        <input type="range" min="90" max="350" step="5" value={adr} onChange={(event) => setAdr(Number(event.target.value))}/>
        <output>{euro.format(adr)}</output>
      </label>
      <label>Occupazione
        <input type="range" min="35" max="95" value={occupancy} onChange={(event) => setOccupancy(Number(event.target.value))}/>
        <output>{occupancy}%</output>
      </label>
      <label>Commissione Aurevia
        <input type="range" min="15" max="35" value={fee} onChange={(event) => setFee(Number(event.target.value))}/>
        <output>{fee}%</output>
      </label>
    </div>

    <div className={styles.metricGrid}>
      <article><span>GMV prenotazioni / mese</span><strong>{euro.format(metrics.portfolioGmv)}</strong><small>{metrics.occupiedNights.toFixed(1)} notti occupate per immobile</small></article>
      <article><span>Ricavi Aurevia / mese</span><strong>{euro.format(metrics.aureviaRevenue)}</strong><small>commissione applicata al GMV</small></article>
      <article><span>Margine di contribuzione</span><strong>{euro.format(metrics.contribution)}</strong><small>ipotesi obiettivo 40%, non EBITDA</small></article>
      <article><span>Ricavi per immobile</span><strong>{euro.format(properties ? metrics.aureviaRevenue / properties : 0)}</strong><small>prima dei costi fissi centrali</small></article>
    </div>

    <div className={styles.realityCheck}>
      <div>
        <span>Se 200.000 € significa GMV prenotazioni</span>
        <strong>{metrics.occupancyFor200kGmv.toFixed(1)}% di occupazione</strong>
        <p>Con gli input attuali. In alternativa servirebbe un ADR di {euro.format(metrics.adrFor200kGmv)} all’occupazione selezionata.</p>
      </div>
      <div className={metrics.occupancyFor200kAurevia > 100 ? styles.alert : undefined}>
        <span>Se 200.000 € significa ricavi Aurevia</span>
        <strong>{metrics.occupancyFor200kAurevia.toFixed(0)}% di occupazione</strong>
        <p>Richiederebbe {euro.format(metrics.gmvFor200kAurevia)} di GMV mensile: non plausibile con {properties} immobili agli input attuali.</p>
      </div>
    </div>
    <p className={styles.methodNote}>Formula: immobili × 30 giorni × occupazione × ADR. Sono scenari direzionali basati sugli input del fondatore, non una previsione di mercato. Pulizie, imposta di soggiorno, IVA, costi del proprietario e ricavi accessori sono esclusi.</p>
  </div>;
}
