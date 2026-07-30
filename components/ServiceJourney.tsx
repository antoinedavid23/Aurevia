"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";

export type ServiceJourneyStep = {
  title: string;
  timing: string;
  text: string;
  points: string[];
};

export function ServiceJourney({ steps }: { steps: ServiceJourneyStep[] }) {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <div className="service-journey">
      <nav className="service-journey-nav" aria-label="Étapes du service">
        {steps.map((item, index) => (
          <button
            type="button"
            key={item.title}
            className={active === index ? "is-active" : ""}
            onClick={() => setActive(index)}
            aria-current={active === index ? "step" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.title}</strong>
            <small>{item.timing}</small>
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
            <p className="eyebrow">Étape {String(active + 1).padStart(2, "0")}</p>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            <ul>
              {step.points.map((point) => (
                <li key={point}><Check size={16} />{point}</li>
              ))}
            </ul>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
