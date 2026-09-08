"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { hasAuditRentalHistory, isAuditFinanceComplete, type auditResult } from "@/lib/audit-model";
import { isAuditLocationComplete, locationCopy } from "@/lib/audit-location";
import { auditPortfolioRange, isAuditPortfolioComplete, portfolioCopy } from "@/lib/audit-portfolio";
import { AuditLocationFields } from "./AuditLocationFields";
import { AuditLocationSummary } from "./AuditLocationSummary";
import { AuditDistributionFields } from "./AuditDistributionFields";
import { calculateAuditDistribution, distributionCopy } from "@/lib/audit-distribution";
import { getAuditObjectives, toggleAuditObjective } from "@/lib/audit-objectives";
import { auditCopy, financeCopy, type AuditAnswers, type AuditFinance } from "./audit-content";
import styles from "./AuditQuestionnaire.module.css";

type Props = {
  locale: Locale;
  screen: number;
  answers: AuditAnswers;
  finance: AuditFinance;
  result: ReturnType<typeof auditResult>;
  status: string;
  setAnswers: Dispatch<SetStateAction<AuditAnswers>>;
  setFinance: Dispatch<SetStateAction<AuditFinance>>;
  onNext: () => void;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AuditQuestionnaire({
  locale, screen, answers, finance, result, status, setAnswers, setFinance,
  onNext, onBack, onSubmit,
}: Props) {
  const t = auditCopy[locale];
  const fc = financeCopy[locale];
  const lc = locationCopy[locale];
  const pc = portfolioCopy[locale];
  const dc = distributionCopy[locale];
  const portfolioRange = auditPortfolioRange(answers.portfolio);
  const originalQuestion = t.questions[screen];
  const question = originalQuestion?.key === "address"
    ? { ...originalQuestion, title: lc.addressTitle, hint: lc.addressHint, fieldLabel: lc.addressLabel, placeholder: "", optional: true }
    : originalQuestion?.key === "area" ? { ...originalQuestion, hint: lc.locationHint } : originalQuestion;
  const isLocation = question?.key === "area";
  const isMultiple = question?.key === "objective";
  const objectives = getAuditObjectives(answers.objective);
  const hasAnswer = question && (isMultiple ? objectives.length > 0 : Boolean(String(answers[question.key] ?? "").trim()));
  const total = t.questions.length + 3;
  const isProperty = screen === t.questions.length;
  const isPerformance = screen === t.questions.length + 1;
  const isContact = screen === total - 1;
  const notRented = !hasAuditRentalHistory(answers, finance);
  const chapter = question ? 0 : isContact ? 2 : 1;
  const heading = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();
  const money = (value: number) => new Intl.NumberFormat(locale, {
    style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(value);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [screen]);

  const next = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLocation && !isAuditLocationComplete(answers)) return;
    if (question?.key === "portfolio" && !isAuditPortfolioComplete(answers.portfolio, finance.propertyCount)) return;
    if (question?.key === "distribution" && !calculateAuditDistribution(answers.distribution, finance).canContinue) return;
    if (isPerformance && !isAuditFinanceComplete(answers, finance)) return;
    if (question?.kind === "text" || question?.kind === "textarea") {
      // Snapshot the field at submission, including its final typed character.
      const value = String(new FormData(event.currentTarget).get(question.key) ?? "");
      if (!question.optional && !value.trim()) return;
      setAnswers(current => ({ ...current, [question.key]: value }));
    } else if (question && !question.optional && !hasAnswer) return;
    onNext();
  };
  const changeWritten = (key: keyof AuditAnswers, value: string) => {
    setAnswers(current => ({ ...current, [key]: value }));
  };
  const changeNumber = (key: keyof AuditFinance, value: string) => {
    setFinance(current => ({ ...current, [key]: value === "" ? NaN : Number(value) }));
  };
  const numberValue = (value: number) => Number.isFinite(value) ? value : "";
  const title = question?.title || (isProperty ? fc.propertyTitle : isPerformance ? notRented ? fc.launchFinancialTitle : fc.financialTitle : t.contactTitle);
  const hint = (isProperty || isPerformance) && result.portfolio > 1 ? pc.inputNote : question?.hint || (isProperty ? fc.propertyText : isPerformance ? notRented ? fc.noHistoryHint : fc.financialText : t.contactText);
  const canContinue = isPerformance ? isAuditFinanceComplete(answers, finance) : question?.key === "distribution" ? calculateAuditDistribution(answers.distribution, finance).canContinue : question?.key === "portfolio" ? isAuditPortfolioComplete(answers.portfolio, finance.propertyCount) : isLocation ? isAuditLocationComplete(answers) : !question || question.optional || hasAnswer;
  const validCurrentRevenue = !notRented && Number.isFinite(result.currentGross)
    && finance.currentNightly >= 1 && finance.currentNightly <= 10000
    && finance.occupancy >= 0 && finance.occupancy <= 100;
  const propertyTypes = ["Appartement", "Attique", "Villa", "Maison indépendante"];
  const finishes = ["Essentiel", "Soigné", "Premium", "Luxe"];

  return <section className={styles.workspace} aria-label={t.top}>
    <div className={styles.container}>
      <div className={styles.topbar}>
        <button className={styles.back} type="button" onClick={event => { if (event.detail < 2) onBack(); }} disabled={status === t.sending}>
          <ArrowLeft size={16} aria-hidden="true" />{t.back}
        </button>
        <span className={styles.step}>{t.step} <b>{String(screen + 1).padStart(2, "0")}</b> {t.of} {total}</span>
      </div>
      <div className={styles.progress} role="progressbar" aria-label={t.top} aria-valuemin={0} aria-valuemax={total} aria-valuenow={screen + 1}>
        <span style={{ width: `${((screen + 1) / total) * 100}%` }} />
      </div>
      <ol className={styles.chapters}>
        {t.chapters.map((label, index) => <li key={label} aria-current={index === chapter ? "step" : undefined}>
          <span>{index < chapter ? <Check size={12} aria-hidden="true" /> : `0${index + 1}`}</span>{label}
        </li>)}
      </ol>

      <motion.div key={screen} className={styles.sheet}
        initial={reduceMotion ? false : { opacity: 0, y: 10, rotateX: 2 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: reduceMotion ? 0 : .22, ease: [.2, .7, .3, 1] }}
        style={{ transformPerspective: 1400, transformOrigin: "50% 0" }}>
        <div className={styles.heading}>
          <h1 ref={heading} tabIndex={-1} id="audit-question-title">{title}</h1>
          <p id="audit-question-hint">{hint}</p>
        </div>

        <form className={styles.form} onSubmit={isContact ? onSubmit : next} aria-labelledby="audit-question-title">
          {isLocation ? <AuditLocationFields locale={locale} answers={answers} setAnswers={setAnswers} options={question.options}/> : question && (question.kind === "text" || question.kind === "textarea" ? <div className={styles.written}>
            <label htmlFor="audit-written">{question.fieldLabel}{question.optional && <small>{t.optional}</small>}</label>
            {question.kind === "textarea"
              ? <textarea id="audit-written" name={question.key} rows={4} maxLength={700}
                  required={!question.optional} value={answers[question.key]} placeholder={question.placeholder}
                  aria-describedby="audit-question-hint"
                  onChange={event => changeWritten(question.key, event.currentTarget.value)} />
              : <input id="audit-written" name={question.key} type="text" maxLength={180}
                  autoComplete="street-address" required={!question.optional} value={answers[question.key]} placeholder={question.placeholder}
                  aria-describedby="audit-question-hint"
                  onChange={event => changeWritten(question.key, event.currentTarget.value)} />}
          </div> : <fieldset className={`${styles.choices} ${question.key === "portfolio" ? styles.portfolio : ""} ${isMultiple ? styles.multiple : ""}`} aria-describedby="audit-question-hint">
            <legend className={styles.srOnly}>{question.title}</legend>
            {(question.options || []).map(option => <label key={option.value} className={styles.choice}>
              <input type={isMultiple ? "checkbox" : "radio"} name={question.key} value={option.value} checked={isMultiple ? objectives.some(code => code === option.value) : answers[question.key] === option.value}
                onChange={() => {
                  if (isMultiple) {
                    setAnswers(current => ({ ...current, objective: toggleAuditObjective(current.objective, option.value) }));
                    return;
                  }
                  setAnswers(current => ({ ...current, [question.key]: option.value }));
                  if (question.key === "distribution" && answers.distribution !== option.value) setFinance(current => ({
                    ...current, channelFeeMode: "unknown", averageChannelFee: null,
                  }));
                  if (question.key === "portfolio") setFinance(current => ({
                    ...current, propertyCount: option.value === "1" ? 1 : isAuditPortfolioComplete(option.value, current.propertyCount) ? current.propertyCount : NaN,
                  }));
                  if (question.key === "status") setFinance(current => ({
                    ...current,
                    hasRentalHistory: undefined,
                  }));
                }} />
              <span className={styles.choiceSurface} aria-hidden="true" />
              <span className={styles.choiceContent}>
                {question.key === "portfolio"
                  ? <><strong className={styles.quantity}>{option.value.replace("-", "–")}</strong><span>{t.unit[option.value === "1" ? 0 : 1]}</span></>
                  : <><strong>{option.label}</strong>{option.detail && <span>{option.detail}</span>}</>}
              </span>
              <span className={styles.choiceCheck} aria-hidden="true"><Check size={13} /></span>
            </label>)}
          </fieldset>)}

          {question?.key === "distribution" && <AuditDistributionFields locale={locale} distribution={answers.distribution} finance={finance} setFinance={setFinance} />}

          {question?.key === "portfolio" && portfolioRange && portfolioRange.min > 1 && <div className={styles.written}>
            <label htmlFor="audit-property-count">{pc.count}</label>
            <input id="audit-property-count" name="propertyCount" required type="number" inputMode="numeric"
              min={portfolioRange.min} max={portfolioRange.max} step={1} value={numberValue(finance.propertyCount)}
              onChange={event => changeNumber("propertyCount", event.currentTarget.value)} />
          </div>}

          {(isProperty || isPerformance) && result.portfolio > 1 && <p className={styles.projectionNote}>{pc.perProperty} · {result.portfolio} {pc.properties}</p>}

          {isProperty && <>
            <div className={styles.twoColumns}>
              <label>{fc.type}<select value={finance.propertyType} onChange={e => setFinance(v => ({ ...v, propertyType: e.target.value }))}>
                {propertyTypes.map((value, index) => <option key={value} value={value}>{fc.types[index]}</option>)}
              </select></label>
              <label>{fc.finish}<select value={finance.finish} onChange={e => setFinance(v => ({ ...v, finish: e.target.value }))}>
                {finishes.map((value, index) => <option key={value} value={value}>{fc.finishes[index]}</option>)}
              </select></label>
            </div>
            <div className={styles.threeColumns}>
              <label>{fc.bedrooms}<input required type="number" inputMode="numeric" min={1} max={12} value={numberValue(finance.bedrooms)} onChange={e => changeNumber("bedrooms", e.target.value)} /></label>
              <label>{fc.guests}<input required type="number" inputMode="numeric" min={1} max={30} value={numberValue(finance.guests)} onChange={e => changeNumber("guests", e.target.value)} /></label>
              <label>{fc.area} · m²<input required type="number" inputMode="numeric" min={20} max={1500} value={numberValue(finance.area)} onChange={e => changeNumber("area", e.target.value)} /></label>
            </div>
            <div className={styles.rangeField}>
              <label htmlFor="audit-days">{fc.days}</label><output htmlFor="audit-days">{finance.days}</output>
              <input id="audit-days" type="range" min={30} max={365} step={1} value={finance.days}
                style={{ "--range-progress": `${Math.max(0, Math.min(100, (finance.days - 30) / 335 * 100))}%` } as CSSProperties}
                onChange={e => changeNumber("days", e.target.value)} />
            </div>
            <fieldset className={styles.amenities}><legend>{fc.amenities}</legend>
              {([["sea", fc.sea], ["terrace", fc.terrace], ["parking", fc.parking]] as const).map(([key, label]) => <label key={key}>
                <input type="checkbox" checked={finance[key]} onChange={e => setFinance(v => ({ ...v, [key]: e.target.checked }))} />{label}
              </label>)}
            </fieldset>
            <label>{dc.pool}<select value={finance.poolKind} onChange={e => setFinance(v => ({ ...v, poolKind: e.target.value as AuditFinance["poolKind"], pool: e.target.value !== "none" }))}>
              {(["none", "private", "shared", "jacuzzi"] as const).map((value, index) => <option key={value} value={value}>{dc.poolOptions[index]}</option>)}
            </select></label>
            <p className={styles.projectionNote}>{dc.poolNote}</p>
          </>}

          {isPerformance && <>
            <fieldset className={styles.historyChoice}>
              <legend>{fc.historyTitle}</legend>
              <label><input type="radio" name="rentalHistory" value="available" checked={!notRented} onChange={() => setFinance(current => ({ ...current, hasRentalHistory: true }))}/>{fc.hasHistory}</label>
              <label><input type="radio" name="rentalHistory" value="none" checked={notRented} onChange={() => setFinance(current => ({ ...current, hasRentalHistory: false }))}/>{fc.noHistory}</label>
            </fieldset>
            {!notRented && <p className={styles.projectionNote}>{dc.history}</p>}
            {!notRented && answers.distribution === "none" && <p className={styles.projectionNote}>{fc.missingHistoryFees}</p>}
            <div className={styles.twoColumns}>
              {!notRented && <>
                <label htmlFor="audit-nightly-rate">{fc.nightly} · €<input id="audit-nightly-rate" name="currentNightly" required type="number" inputMode="decimal" min={1} max={10000} step={0.01} value={numberValue(finance.currentNightly)} onChange={e => changeNumber("currentNightly", e.target.value)} /></label>
                <label htmlFor="audit-occupancy">{fc.occupancy} · %<input id="audit-occupancy" name="occupancy" required type="number" inputMode="decimal" min={0} max={100} step={0.1} value={numberValue(finance.occupancy)} onChange={e => changeNumber("occupancy", e.target.value)} /></label>
              </>}
              <label htmlFor="audit-annual-costs">{fc.costs} · €<input id="audit-annual-costs" name="annualCosts" required type="number" inputMode="decimal" min={0} max={1000000} step={0.01} value={numberValue(finance.annualCosts)} onChange={e => changeNumber("annualCosts", e.target.value)} /></label>
              {!notRented && <label htmlFor="audit-management-rate">{fc.management} · %<input id="audit-management-rate" name="currentManagementRate" required type="number" inputMode="decimal" min={0} max={50} step={0.01} value={numberValue(finance.currentManagementRate)} aria-describedby="audit-management-hint" onChange={e => changeNumber("currentManagementRate", e.target.value)} /></label>}
            </div>
            {!notRented && <p id="audit-management-hint" className={styles.projectionNote}>{fc.managementHint}</p>}
            {!notRented && <div className={styles.currentRevenue}><span>{fc.grossPreview}{result.portfolio > 1 && <> · {pc.total}</>}</span><strong>{validCurrentRevenue ? money(result.currentGross) : "—"}</strong></div>}
            {validCurrentRevenue && <p className={styles.projectionNote}>{pc.perProperty} : {money(result.currentNightly)} × {result.perProperty.currentBookedNights} {pc.nights} = {money(result.perProperty.currentGross)}{result.portfolio > 1 && <> · × {result.portfolio} {pc.properties}</>}</p>}
            <p className={styles.projectionNote}>{pc.rateBasis}</p>
            <dl className={styles.assumptions}>
              <div><dt>{dc.current}</dt><dd>{result.currentPlatformRate === null ? "—" : `${result.currentPlatformRate} %`}</dd></div><div><dt>{dc.target}</dt><dd>8 %</dd></div><div><dt>AUREVIA</dt><dd>25 %</dd></div><div><dt>{fc.occupancy} AUREVIA</dt><dd>{Number.isFinite(result.targetOccupancy) ? `${result.targetOccupancy} %` : "—"}</dd></div>
            </dl>
            <p className={styles.projectionNote}>{dc.note}</p>
            <AuditLocationSummary location={result.location} locale={locale}/>
          </>}

          {isContact && <>
            <p className={styles.projectionNote}><strong>{dc.evidence}</strong> — {dc.evidenceNote}</p>
            {result.portfolio > 1 && <p className={styles.projectionNote}>{pc.total} · {result.portfolio} {pc.properties}</p>}
            <div className={styles.preview}>
              <div><span>{t.previewGross}</span><strong>{money(result.projectedGross)}</strong></div>
              <div><span>{t.previewGain}</span><strong><LockKeyhole size={19} aria-label={t.confidential} /><span className={styles.masked} aria-hidden="true">•• ••• €</span></strong></div>
            </div>
            <p className={styles.projectionNote}>{pc.perProperty} : {money(result.targetNightly)} × {result.perProperty.targetBookedNights} {pc.nights} = {money(result.perProperty.projectedGross)}{result.portfolio > 1 && <> · × {result.portfolio} {pc.properties} = {money(result.projectedGross)}</>}</p>
            <p className={styles.projectionNote}>{pc.rateBasis}</p>
            {result.portfolio > 1 && <p className={styles.projectionNote}>{pc.assumption}</p>}
            <p className={styles.projectionNote}>{lc.note}</p>
            <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className={styles.twoColumns}>
              <label>{t.first}<input required name="name" autoComplete="given-name" maxLength={80} /></label>
              <label>{t.last}<input required name="surname" autoComplete="family-name" maxLength={80} /></label>
              <label>{t.email}<input required name="email" type="email" autoComplete="email" maxLength={160} /></label>
              <label>{t.phone}<input required name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
            </div>
            <label className={styles.consent}><input required type="checkbox" name="consent" /><span>{t.consent} <Link href="/privacy" target="_blank">{t.privacy}</Link>.</span></label>
          </>}

          <div className={styles.actions}>
            <span className={styles.reassurance}>{question?.optional ? t.optional : !question || question.kind === "text" ? <><LockKeyhole size={13} aria-hidden="true" />{t.confidential}</> : isMultiple ? t.chooseMultipleHint : t.chooseHint}</span>
            {question?.optional && <button className={styles.skip} type="button" onClick={event => { if (event.detail < 2) onNext(); }}>{t.skip}</button>}
            <button className={styles.next} type="submit" disabled={!canContinue || status === t.sending}
              onClick={event => { if (event.detail > 1) event.preventDefault(); }}>
              {status === t.sending ? t.sending : isContact ? t.submit : t.continue}<ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
          {status && status !== t.sending && <p className={styles.error} role="alert">{status}</p>}
        </form>
      </motion.div>
      <div className={styles.footnote}><span>AUREVIA</span><span>Genova · Liguria</span></div>
    </div>
  </section>;
}
