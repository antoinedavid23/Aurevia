"use client";

import { ArrowRight } from "lucide-react";
import styles from "./AuditServicesIntro.module.css";

type Props = {
  content: {
    title: string;
    text: string;
    points: string[];
    details?: string[];
    cta: string;
    note?: string;
  };
  onContinue: () => void;
};

export function AuditServicesIntro({ content, onContinue }: Props) {
  return <section className={styles.section} aria-labelledby="audit-services-title">
    <div className={styles.content}>
      <div className={styles.introduction}>
        <h1 id="audit-services-title" className={styles.title}>{content.title}</h1>
        <p className={styles.description}>{content.text}</p>
      </div>

      <ol className={styles.chapters}>
        {content.points.map((point, index) => <li className={styles.chapter} key={point}>
          <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div className={styles.scene}>
            <h2 className={styles.chapterTitle}>{point}</h2>
            <p className={styles.detail}>{content.details?.[index]}</p>
          </div>
        </li>)}
      </ol>

      <div className={styles.actions}>
        <button className={styles.button} type="button" onClick={onContinue}>
          {content.cta}<ArrowRight size={18} aria-hidden="true" />
        </button>
        {content.note && <p className={styles.note}>{content.note}</p>}
      </div>
    </div>
  </section>;
}
