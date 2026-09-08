"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { AuditLanguageMenu } from "@/components/AuditLanguageMenu";
import { useLocale } from "@/components/LocaleController";
import { AUREVIA_CALENDLY_URL } from "@/lib/audit-booking";
import type { Locale } from "@/lib/i18n";
import styles from "./AuditAppointment.module.css";

const copy = {
  it: {
    label: "Appuntamento privato",
    title: "Parli con AUREVIA",
    intro: "Scelga un orario per approfondire il Suo audit e parlare del Suo immobile.",
    back: "Torna al mio audit",
    calendar: "Calendario degli appuntamenti AUREVIA",
    fallback: "Apri Calendly",
    newTab: "Nuova scheda",
    note: "L’appuntamento sarà confermato solo al termine della prenotazione su Calendly.",
  },
  fr: {
    label: "Rendez-vous privé",
    title: "Échanger avec AUREVIA",
    intro: "Choisissez un créneau pour relire votre audit et parler de votre bien.",
    back: "Revenir à mon audit",
    calendar: "Calendrier des rendez-vous AUREVIA",
    fallback: "Ouvrir Calendly",
    newTab: "Nouvel onglet",
    note: "Le rendez-vous sera confirmé uniquement après validation de votre réservation sur Calendly.",
  },
  en: {
    label: "Private appointment",
    title: "Speak with AUREVIA",
    intro: "Choose a time to review your audit and discuss your property.",
    back: "Back to my audit",
    calendar: "AUREVIA appointment calendar",
    fallback: "Open Calendly",
    newTab: "New tab",
    note: "Your appointment is confirmed only after you complete the booking on Calendly.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function AuditAppointment() {
  const { locale } = useLocale();
  const t = copy[locale];

  return <div className={`audit-shell ${styles.page}`} data-no-translate lang={locale}>
    <header className="audit-header">
      <Link href="/" className="audit-logo" aria-label="AUREVIA">
        <img src="/images/brand/aurevia-logo-transparent-gold.png" width={280} height={280} alt="AUREVIA" />
      </Link>
      <span className="audit-header-label">{t.label}</span>
      <AuditLanguageMenu />
    </header>
    <main className={styles.main}>
      <div className={styles.intro}>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </div>
      <div className={styles.toolbar}>
        <Link href="/audit/grazie" className={styles.back}>
          <ArrowLeft size={16} aria-hidden="true" />{t.back}
        </Link>
        <a href={AUREVIA_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={styles.fallback} aria-label={`${t.fallback} — ${t.newTab}`}>
          {t.fallback}<ArrowUpRight size={16} aria-hidden="true" /><span>{t.newTab}</span>
        </a>
      </div>
      <div className={styles.calendar}>
        <iframe src={AUREVIA_CALENDLY_URL} title={t.calendar} className={styles.frame} referrerPolicy="no-referrer" />
      </div>
      <p className={styles.note}>{t.note}</p>
    </main>
  </div>;
}
