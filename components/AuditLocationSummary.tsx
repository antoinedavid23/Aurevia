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
    it: { current: "Tariffa attuale dichiarata", projected: "Tariffa media simulata · +20%", note: "Con la tarificazione dinamica, AUREVIA adegua il prezzo di ogni notte alla domanda, alla stagione e agli eventi locali. Il Suo audit ipotizza un aumento medio del 20% della tariffa per notte su base annua, non un rincaro uniforme per ogni data." },
    fr: { current: "Tarif actuel déclaré", projected: "Tarif moyen simulé · +20 %", note: "Grâce à la tarification dynamique, AUREVIA ajuste le prix de chaque nuit selon la demande, la saison et les événements locaux. Votre audit retient une hausse moyenne de 20 % du tarif par nuit sur l’année, et non une augmentation uniforme à chaque date." },
    en: { current: "Declared current rate", projected: "Simulated average rate · +20%", note: "Through dynamic pricing, AUREVIA adjusts each night’s price to demand, seasonality and local events. Your audit assumes a 20% increase in the average nightly rate over the year, rather than the same increase on every date." },
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
