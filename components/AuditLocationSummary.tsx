import type { Locale } from "@/lib/i18n";
import type { AuditResult } from "@/lib/audit-model";
import { locationCopy } from "@/lib/audit-location";
import styles from "./AuditLocationSummary.module.css";

export function AuditLocationSummary({ location, locale, detailed = false }: {
  location: AuditResult["location"]; locale: Locale; detailed?: boolean;
}) {
  const t = locationCopy[locale];
  if (!location.complete) return null;
  const declared = location.pricingBasis === "declared-rate-plus-20";
  const copy = {
    it: { current: "Tariffa attuale dichiarata", projected: "Tariffa simulata · +20%", note: "La simulazione parte dalla Sua tariffa e applica +20%, senza ulteriori coefficienti. Quartiere e dotazioni saranno verificati con AUREVIA." },
    fr: { current: "Tarif actuel déclaré", projected: "Tarif simulé · +20 %", note: "La simulation reprend votre tarif et applique +20 %, sans autre coefficient. Le quartier et les équipements seront étudiés avec AUREVIA." },
    en: { current: "Declared current rate", projected: "Simulated rate · +20%", note: "The simulation applies +20% to your rate, without additional coefficients. AUREVIA will review the neighbourhood and amenities with you." },
  }[locale];
  const money = (value: number) => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
  return <aside className={styles.summary} aria-label={t.reportTitle}>
    <strong>{location.label}</strong>
    {detailed && <dl>
      <div><dt>{declared ? copy.current : t.baseLabel}</dt><dd>{money(declared ? location.declaredNightly : location.appliedBaseNightly)} {t.unit}</dd></div>
      <div><dt>{declared ? copy.projected : t.nightlyLabel}</dt><dd>{money(location.projectedNightly)} {t.unit}</dd></div>
    </dl>}
    <p>{declared ? copy.note : location.calibration === "district-scenario" ? t.districtNote : t.fallbackNote}</p>
    {detailed && <p>{t.note}</p>}
  </aside>;
}
