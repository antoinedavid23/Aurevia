import type { AuditResult } from "@/lib/audit-model";
import type { Locale } from "@/lib/i18n";
import { portfolioCopy } from "@/lib/audit-portfolio";
import styles from "./AuditPortfolioSummary.module.css";

export function AuditPortfolioSummary({ result, locale }: { result: AuditResult; locale: Locale }) {
  if (result.portfolio < 2) return null;
  const t = portfolioCopy[locale];
  const money = (value: number) => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
  return <section className={styles.scope} aria-label={t.total}>
    <h2>{t.total} · {result.portfolio} {t.properties}</h2>
    <p>{t.assumption}</p>
    <p>{money(result.targetNightly)} × {result.perProperty.targetBookedNights} {t.nights} × {result.portfolio} {t.properties} = {money(result.projectedGross)}<br/>{t.rateBasis}</p>
    <div className={styles.tableWrap}><table>
      <thead><tr><td/><th scope="col">{t.perProperty}</th><th scope="col">{t.total}</th></tr></thead>
      <tbody>
        <tr><th scope="row">{t.current}</th><td>{money(result.perProperty.currentGross)}</td><td>{money(result.currentGross)}</td></tr>
        <tr><th scope="row">{t.projected}</th><td>{money(result.perProperty.projectedGross)}</td><td>{money(result.projectedGross)}</td></tr>
        <tr><th scope="row">{t.net}</th><td>{money(result.perProperty.projectedNet)}</td><td>{money(result.projectedNet)}</td></tr>
      </tbody>
    </table></div>
  </section>;
}
