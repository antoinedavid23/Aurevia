"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useLocale } from "@/components/LocaleController";
import { translate } from "@/lib/i18n";

export type ServiceJourneyStep = {
  title: string;
  timing: string;
  text: string;
  points: string[];
};

export function ServiceJourney({ steps }: { steps: ServiceJourneyStep[] }) {
  const { locale } = useLocale();
  const tr = (text: string) => translate(text, locale);
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <div className="service-journey">
      <nav className="service-journey-nav" aria-label={tr("Étapes du service")}>
        {steps.map((item, index) => (
          <button
            type="button"
            key={item.title}
            className={active === index ? "is-active" : ""}
            onClick={() => setActive(index)}
            aria-current={active === index ? "step" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{tr(item.title)}</strong>
            <small>{tr(item.timing)}</small>
          </button>
        ))}
      </nav>

      <div className="service-journey-stage" aria-live="polite">
        <div className="service-journey-progress" aria-hidden="true">
          <span style={{ width: `${((active + 1) / steps.length) * 100}%` }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.article
            key={step.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <p className="eyebrow">{tr("Étape")} {String(active + 1).padStart(2, "0")}</p>
            <h3>{tr(step.title)}</h3>
            <p>{tr(step.text)}</p>
            <ul>
              {step.points.map((point) => (
                <li key={point}><Check size={16} />{tr(point)}</li>
              ))}
            </ul>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
