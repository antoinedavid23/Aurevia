"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useLocale } from "@/components/LocaleController";
import { translate } from "@/lib/public-site/i18n";

export type ServiceJourneyStep = {
  title: string;
  timing: string;
  text: string;
  result: string;
  points: string[];
};

export function ServiceJourney({ steps, label = "Étapes du service" }: { steps: ServiceJourneyStep[]; label?: string }) {
  const { locale } = useLocale();
  const tr = (text: string) => translate(text, locale);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(max-width: 900px)").matches) return;
    const triggers = Array.from(root.querySelectorAll<HTMLElement>("[data-journey-trigger]"));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.journeyTrigger || 0));
    }, { rootMargin: "-38% 0px -38% 0px", threshold: [0, 0.25, 0.6] });
    triggers.forEach((trigger) => observer.observe(trigger));
    return () => observer.disconnect();
  }, [steps.length]);

  const step = steps[active];

  return (
    <div className="detail-journey-scroll" ref={rootRef} aria-label={tr(label)}>
      <div className="detail-journey-stage" data-step={String(active + 1).padStart(2, "0")}>
        <div className="detail-journey-copy" key={step.title}>
          <p className="eyebrow">{tr(step.timing)}</p>
          <span className="detail-journey-number">{String(active + 1).padStart(2, "0")}</span>
          <h3>{tr(step.title)}</h3>
          <p>{tr(step.text)}</p>
          <div className="detail-journey-result"><span>{tr("Résultat concret")}</span><strong>{tr(step.result)}</strong></div>
          <ul>{step.points.map((point) => <li key={point}><Check size={16} />{tr(point)}</li>)}</ul>
        </div>
        <div className="detail-journey-nav" role="tablist" aria-label={tr(label)}>
          {steps.map((item, index) => <button key={item.title} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)}>
            <span>{String(index + 1).padStart(2, "0")}</span><small>{tr(item.timing)}</small><strong>{tr(item.title)}</strong><i aria-hidden="true" />
          </button>)}
        </div>
      </div>
      <div className="detail-journey-triggers" aria-hidden="true">
        {steps.map((item, index) => <span key={item.title} data-journey-trigger={index} />)}
      </div>
    </div>
  );
}
