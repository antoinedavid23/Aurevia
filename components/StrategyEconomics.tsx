"use client";

import { useId, useMemo, useState } from "react";
import type { StrategyLocale } from "@/lib/strategy-locale";
import { strategyEconomicsCopy } from "@/lib/strategy-economics-copy";
import styles from "@/app/administration/strategia/strategia.module.css";

export function StrategyEconomics({ locale = "it" }: { locale?: StrategyLocale }) {
  const copy = strategyEconomicsCopy[locale];
  const numberLocale = { it: "it-IT", fr: "fr-FR", en: "en-GB" }[locale];
  const euro = new Intl.NumberFormat(numberLocale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const decimal = (value: number, digits = 1) => new Intl.NumberFormat(numberLocale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  const fieldId = useId();
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
      <label htmlFor={`${fieldId}-properties`}>{copy.properties}
        <input id={`${fieldId}-properties`} type="range" min="1" max="80" value={properties} onChange={(event) => setProperties(Number(event.target.value))}/>
        <output htmlFor={`${fieldId}-properties`} aria-hidden="true">{properties}</output>
      </label>
      <label htmlFor={`${fieldId}-adr`}>{copy.adr}
        <input id={`${fieldId}-adr`} type="range" min="90" max="350" step="5" value={adr} onChange={(event) => setAdr(Number(event.target.value))}/>
        <output htmlFor={`${fieldId}-adr`} aria-hidden="true">{euro.format(adr)}</output>
      </label>
      <label htmlFor={`${fieldId}-occupancy`}>{copy.occupancy}
        <input id={`${fieldId}-occupancy`} type="range" min="35" max="95" value={occupancy} onChange={(event) => setOccupancy(Number(event.target.value))}/>
        <output htmlFor={`${fieldId}-occupancy`} aria-hidden="true">{occupancy}%</output>
      </label>
      <label htmlFor={`${fieldId}-fee`}>{copy.fee}
        <input id={`${fieldId}-fee`} type="range" min="15" max="35" value={fee} onChange={(event) => setFee(Number(event.target.value))}/>
        <output htmlFor={`${fieldId}-fee`} aria-hidden="true">{fee}%</output>
      </label>
    </div>

    <div className={styles.metricGrid}>
      <article><span>{copy.gmv}</span><strong>{euro.format(metrics.portfolioGmv)}</strong><small>{decimal(metrics.occupiedNights)} {copy.nights}</small></article>
      <article><span>{copy.revenue}</span><strong>{euro.format(metrics.aureviaRevenue)}</strong><small>{copy.commissionHint}</small></article>
      <article><span>{copy.contribution}</span><strong>{euro.format(metrics.contribution)}</strong><small>{copy.contributionHint}</small></article>
      <article><span>{copy.perProperty}</span><strong>{euro.format(properties ? metrics.aureviaRevenue / properties : 0)}</strong><small>{copy.fixedCostHint}</small></article>
    </div>

    <div className={styles.realityCheck}>
      <div>
        <span>{copy.gmvTarget}</span>
        <strong>{decimal(metrics.occupancyFor200kGmv)}% {copy.occupancySuffix}</strong>
        <p>{copy.gmvExplanation.replace("{adr}", euro.format(metrics.adrFor200kGmv))}</p>
      </div>
      <div className={metrics.occupancyFor200kAurevia > 100 ? styles.alert : undefined}>
        <span>{copy.revenueTarget}</span>
        <strong>{decimal(metrics.occupancyFor200kAurevia, 0)}% {copy.occupancySuffix}</strong>
        <p>{copy.revenueExplanation.replace("{gmv}", euro.format(metrics.gmvFor200kAurevia)).replace("{properties}", String(properties))}</p>
      </div>
    </div>
    <p className={styles.methodNote}>{copy.method}</p>
  </div>;
}
