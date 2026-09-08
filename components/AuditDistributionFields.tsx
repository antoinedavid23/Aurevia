"use client";

import type { Dispatch, SetStateAction } from "react";
import type { Locale } from "@/lib/i18n";
import { activeChannels, calculateAuditDistribution, distributionCopy, emptyChannelMix, type AuditChannel } from "@/lib/audit-distribution";
import type { AuditFinance } from "./audit-content";
import styles from "./AuditQuestionnaire.module.css";

export function AuditDistributionFields({ locale, distribution, finance, setFinance }: {
  locale: Locale; distribution: string; finance: AuditFinance; setFinance: Dispatch<SetStateAction<AuditFinance>>;
}) {
  const t = distributionCopy[locale];
  const active = activeChannels(distribution);
  const result = calculateAuditDistribution(distribution, finance);
  const expanded = result.inputMode !== "unknown";
  const number = (value: number | null | undefined) => typeof value === "number" && Number.isFinite(value) ? value : "";
  const change = (channel: AuditChannel, key: "share" | "fee", value: string) => setFinance(current => {
    const mix = current.channelMix ?? emptyChannelMix();
    return { ...current, channelMix: { ...mix, [channel]: { ...mix[channel], [key]: value === "" ? null : Number(value) } } };
  });
  if (!active.length) return null;
  return <div className={styles.channelFields}>
    <button type="button" className={styles.channelToggle} aria-expanded={expanded}
      aria-controls="audit-channel-editor" aria-describedby="audit-channel-optional"
      onClick={() => setFinance(current => ({ ...current, channelFeeMode: expanded ? "unknown" : "average" }))}>
      <span>{t.refine}<small>{t.optional}</small></span><span aria-hidden="true">{expanded ? "−" : "+"}</span>
    </button>
    <p id="audit-channel-optional" className={styles.projectionNote}>{t.optionalHint}</p>
    <div id="audit-channel-editor" hidden={!expanded}>
      {expanded && <div className={styles.channelEditor}>
        {result.inputMode === "average" ? <>
          <div className={styles.channelAverage}>
            <label htmlFor="audit-average-channel-fee">{t.average}</label>
            <div className={styles.percentInput}>
              <input id="audit-average-channel-fee" type="number" inputMode="decimal" min={0} max={100} step={.01}
                aria-describedby="audit-average-channel-hint" aria-invalid={!result.canContinue || undefined}
                value={number(finance.averageChannelFee)} placeholder="—"
                onChange={e => {
                  const value = e.currentTarget.value;
                  setFinance(current => ({ ...current, averageChannelFee: value === "" ? null : Number(value) }));
                }} />
              <span aria-hidden="true">%</span>
            </div>
          </div>
          <p id="audit-average-channel-hint" className={styles.projectionNote}>{t.averageHint}</p>
          {!result.canContinue && <p className={styles.error} role="status">{t.invalidAverage}</p>}
          {active.length > 1 && <button type="button" className={styles.channelDetailLink}
            onClick={() => setFinance(current => ({ ...current, channelFeeMode: "detailed" }))}>{t.detailed}</button>}
        </> : <>
          <p className={styles.projectionNote}>{t.hint}</p>
          {active.map(channel => <fieldset key={channel} className={styles.channelRow}>
            <legend>{channel === "airbnb" ? "Airbnb" : channel === "booking" ? "Booking.com" : t[channel]}</legend>
            <div className={styles.twoColumns}>
              {active.length > 1 && <label>{t.share}<input type="number" inputMode="decimal" min={0} max={100} step={.01}
                aria-describedby="audit-channel-detail-hint"
                value={number(finance.channelMix?.[channel]?.share)} placeholder="0" onChange={e => change(channel, "share", e.target.value)} /></label>}
              <label>{t.fee}<input type="number" inputMode="decimal" min={0} max={100} step={.01}
                aria-describedby="audit-channel-detail-hint"
                required={active.length === 1 || (finance.channelMix?.[channel]?.share ?? 0) > 0}
                value={number(finance.channelMix?.[channel]?.fee)} onChange={e => change(channel, "fee", e.target.value)} /></label>
            </div>
          </fieldset>)}
          {active.length > 1 && <output className={styles.projectionNote} aria-live="polite">{result.shareTotal} / 100 %</output>}
          <p id="audit-channel-detail-hint" className={styles.projectionNote}>{t.required}</p>
          <button type="button" className={styles.channelDetailLink}
            onClick={() => setFinance(current => ({ ...current, channelFeeMode: "average" }))}>{t.useAverage}</button>
        </>}
        <button type="button" className={styles.channelDefer}
          onClick={() => setFinance(current => ({ ...current, channelFeeMode: "unknown" }))}>{t.defer}</button>
      </div>}
    </div>
  </div>;
}
