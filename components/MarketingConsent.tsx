"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "./LocaleController";
import { CONSENT_KEY, isPublicTrackingPath, readMarketingConsent, saveMarketingConsent, type MarketingChoice } from "@/lib/marketing-consent";
import { setMetaTrackingConsent, syncMetaTracking } from "@/lib/meta-pixel";

const copy = {
  it: {
    title: "La tua privacy, la tua scelta",
    text: "Usiamo strumenti essenziali per il sito. Con il tuo consenso, il Meta Pixel misura le visite e le richieste inviate per valutare e migliorare le nostre campagne su Facebook e Instagram. Puoi rifiutare e continuare a usare tutti i servizi.",
    accept: "Accetta i cookie pubblicitari", reject: "Rifiuta i cookie pubblicitari", policy: "Cookie e privacy", preferences: "Preferenze cookie", close: "Chiudi", error: "Non è stato possibile salvare la scelta. Il tracciamento pubblicitario resta disattivato.",
  },
  fr: {
    title: "Votre confidentialité, votre choix",
    text: "Nous utilisons des outils essentiels au site. Avec votre accord, le pixel Meta mesure les visites et les demandes envoyées pour évaluer et améliorer nos campagnes Facebook et Instagram. Vous pouvez refuser et continuer à utiliser tous les services.",
    accept: "Accepter les cookies publicitaires", reject: "Refuser les cookies publicitaires", policy: "Cookies et confidentialité", preferences: "Préférences cookies", close: "Fermer", error: "Votre choix n’a pas pu être enregistré. Le suivi publicitaire reste désactivé.",
  },
  en: {
    title: "Your privacy, your choice",
    text: "We use tools essential to the website. With your consent, the Meta Pixel measures visits and submitted enquiries to assess and improve our Facebook and Instagram campaigns. You can decline and still use all our services.",
    accept: "Accept advertising cookies", reject: "Decline advertising cookies", policy: "Cookies and privacy", preferences: "Cookie preferences", close: "Close", error: "Your choice could not be saved. Advertising tracking remains disabled.",
  },
};

export function MarketingConsent() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasChoice, setHasChoice] = useState(false);
  const [error, setError] = useState(false);
  const preferences = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const text = copy[locale];

  useEffect(() => {
    const update = () => {
      const choice = readMarketingConsent();
      setHasChoice(Boolean(choice));
      setOpen(!choice);
      setReady(true);
      syncMetaTracking();
    };
    const frame = requestAnimationFrame(update);
    const storage = (event: StorageEvent) => { if (event.key === CONSENT_KEY || event.key === null) update(); };
    const visible = () => { if (document.visibilityState === "visible") update(); };
    window.addEventListener("storage", storage);
    document.addEventListener("visibilitychange", visible);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("storage", storage);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [pathname]);

  function choose(choice: MarketingChoice) {
    const saved = saveMarketingConsent(choice);
    setMetaTrackingConsent(saved && choice === "accepted");
    setError(!saved);
    if (saved) { setHasChoice(true); setOpen(false); preferences.current?.focus(); }
  }

  if (!ready || !isPublicTrackingPath(pathname)) return null;
  return <div data-no-translate>
    <button ref={preferences} type="button" className="cookie-preferences" aria-expanded={open} aria-controls="aurevia-cookie-choices" onClick={() => { setOpen(true); requestAnimationFrame(() => dialog.current?.focus()); }}>{text.preferences}</button>
    {open && <div ref={dialog} tabIndex={-1} id="aurevia-cookie-choices" className="cookie marketing-cookie" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-description" onKeyDown={event => { if (event.key === "Escape") { if (hasChoice) { setOpen(false); preferences.current?.focus(); } else choose("refused"); } }}>
      <div className="cookie-copy"><strong id="cookie-title">{text.title}</strong><p id="cookie-description">{text.text}</p><Link href="/cookie-policy">{text.policy}</Link>{error && <p role="status">{text.error}</p>}</div>
      <div className="cookie-actions"><button type="button" onClick={() => choose("refused")}>{text.reject}</button><button type="button" onClick={() => choose("accepted")}>{text.accept}</button>{hasChoice && <button type="button" className="cookie-close" onClick={() => { setOpen(false); preferences.current?.focus(); }}>{text.close}</button>}</div>
    </div>}
  </div>;
}
