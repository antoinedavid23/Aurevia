"use client";

import type { Dispatch, SetStateAction } from "react";
import type { Locale } from "@/lib/i18n";
import { auditZones, changeAuditLocation, selectedAuditZone, locationCopy } from "@/lib/audit-location";
import type { AuditAnswers, AuditQuestion } from "./audit-content";
import styles from "./AuditQuestionnaire.module.css";

export function AuditLocationFields({ locale, answers, setAnswers, options }: {
  locale: Locale; answers: AuditAnswers; setAnswers: Dispatch<SetStateAction<AuditAnswers>>;
  options: AuditQuestion["options"];
}) {
  const t = locationCopy[locale];
  const zones = auditZones.filter(zone => zone.territory === answers.area);
  const zone = selectedAuditZone(answers);
  const change = (field: "area" | "zone" | "neighborhood" | "localityName" | "neighborhoodName", value: string) =>
    setAnswers(current => changeAuditLocation(current, field, value));
  const customNeighborhood = answers.zone === "custom" || (zone && (!zone.neighborhoods.length || answers.neighborhood === "custom"));

  return <div className={styles.locationFields}>
    <div className={styles.twoColumns}>
      <label htmlFor="audit-territory">{t.territory}<select id="audit-territory" required value={answers.area} onChange={e => change("area", e.target.value)}>
        <option value="" disabled>{t.choose}</option>
        {options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select></label>
      {answers.area === "ponente" || answers.area === "other" ? <label htmlFor="audit-locality-name">{t.locality}
        <input id="audit-locality-name" required minLength={2} maxLength={100} autoComplete="address-level2" value={answers.localityName} onChange={e => change("localityName", e.target.value)} />
      </label> : <label htmlFor="audit-zone">{answers.area === "genova" ? t.zone : t.locality}<select id="audit-zone" required disabled={!answers.area} value={answers.zone} onChange={e => change("zone", e.target.value)}>
        <option value="" disabled>{t.choose}</option>
        {zones.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        <option value="custom">{t.customZone}</option>
      </select></label>}
    </div>
    {answers.zone === "custom" && zones.length > 0 && <div className={styles.written}>
      <label htmlFor="audit-locality-name">{t.specifyLocality}</label>
      <input id="audit-locality-name" required minLength={2} maxLength={100} autoComplete="address-level2" value={answers.localityName} onChange={e => change("localityName", e.target.value)} />
    </div>}
    {!customNeighborhood && <div className={styles.written}>
      <label htmlFor="audit-neighborhood">{t.neighborhood}</label>
      <select id="audit-neighborhood" required disabled={!zone} value={answers.neighborhood} onChange={e => change("neighborhood", e.target.value)}>
        <option value="" disabled>{t.choose}</option>
        {zone?.neighborhoods.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        <option value="custom">{t.customDistrict}</option>
      </select>
    </div>}
    {customNeighborhood && <>
      {zone && zone.neighborhoods.length > 0 && <div className={styles.written}>
        <label htmlFor="audit-neighborhood">{t.neighborhood}</label>
        <select id="audit-neighborhood" value={answers.neighborhood} onChange={e => change("neighborhood", e.target.value)}>
          {zone.neighborhoods.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          <option value="custom">{t.customDistrict}</option>
        </select>
      </div>}
      <div className={styles.written}>
        <label htmlFor="audit-neighborhood-name">{t.specifyDistrict}</label>
        <input id="audit-neighborhood-name" required minLength={2} maxLength={100} autoComplete="address-level3" placeholder={t.example}
          value={answers.neighborhoodName} onChange={e => change("neighborhoodName", e.target.value)} />
      </div>
    </>}
  </div>;
}
