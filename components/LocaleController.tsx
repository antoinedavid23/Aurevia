"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { localeNames, locales, translate, type Locale } from "@/lib/i18n";

type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void };
const DEFAULT_LOCALE: Locale = "it";
const HYDRATION_LOCALE: Locale = DEFAULT_LOCALE;
const LocaleContext = createContext<LocaleContextValue>({ locale: DEFAULT_LOCALE, setLocale: () => undefined });

const originals = new WeakMap<Node, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const attributes = ["placeholder", "aria-label", "title"] as const;
let translating = false;

function translateTree(root: ParentNode, locale: Locale) {
  if (translating) return;
  translating = true;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script,style,[data-no-translate],.admin-shell")) continue;
    const current = node.textContent ?? "";
    const base = originals.get(node) ?? current;
    if (!originals.has(node)) originals.set(node, base);
    const trimmed = base.trim();
    if (!trimmed) continue;
    const localized = translate(trimmed, locale);
    const leading = base.match(/^\s*/)?.[0] ?? "";
    const trailing = base.match(/\s*$/)?.[0] ?? "";
    const nextText = `${leading}${localized}${trailing}`;
    if (node.textContent !== nextText) {
      node.textContent = nextText;
    }
  }
  root.querySelectorAll<HTMLElement>("input,textarea,button,a,[aria-label],[title]").forEach((element) => {
    if (element.closest(".admin-shell") || element.hasAttribute("data-no-translate")) return;
    const stored = originalAttributes.get(element) ?? new Map<string, string>();
    if (!originalAttributes.has(element)) originalAttributes.set(element, stored);
    attributes.forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (!value) return;
      const base = stored.get(attribute) ?? value;
      if (!stored.has(attribute)) stored.set(attribute, base);
      const localized = translate(base, locale);
      if (element.getAttribute(attribute) !== localized) {
        element.setAttribute(attribute, localized);
      }
    });
  });
  document.documentElement.lang = locale === "zh" ? "zh-CN" : locale;
  translating = false;
}

export function LocaleController({ children }: { children: React.ReactNode }) {
  const [locale, updateLocale] = useState<Locale>(HYDRATION_LOCALE);
  const pathname = usePathname();

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("lang");
    const stored = localStorage.getItem("aurevia-locale");
    const initial = requested && locales.some((code) => code === requested)
      ? requested as Locale
      : stored && locales.some((code) => code === stored)
        ? stored as Locale
        : DEFAULT_LOCALE;
    const frame = requestAnimationFrame(() => updateLocale(initial));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let observer: MutationObserver | undefined;
    const hydrationDelay = window.setTimeout(() => {
      translateTree(document.body, locale);
      document.documentElement.classList.remove("locale-pending");
      observer = new MutationObserver((mutations) => {
        if (translating) return;
        const roots = new Set<ParentNode>();
        mutations.forEach((mutation) => {
          if (mutation.type === "characterData") {
            const node = mutation.target;
            const current = node.textContent ?? "";
            const base = originals.get(node);
            if (base !== undefined) {
              const leading = base.match(/^\s*/)?.[0] ?? "";
              const trailing = base.match(/\s*$/)?.[0] ?? "";
              const expected = `${leading}${translate(base.trim(), locale)}${trailing}`;
              if (current !== expected) originals.set(node, current);
            }
            if (node.parentElement) roots.add(node.parentElement);
            return;
          }
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) roots.add(node);
            else if (node.parentElement) roots.add(node.parentElement);
          });
        });
        if (roots.size) requestAnimationFrame(() => roots.forEach((root) => translateTree(root, locale)));
      });
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }, 250);
    return () => {
      window.clearTimeout(hydrationDelay);
      observer?.disconnect();
    };
  }, [locale]);

  useEffect(() => {
    const section = pathname.split("/").filter(Boolean)[0] || "home";
    const titles: Record<string, Record<Locale, string>> = {
      home: { fr:"AUREVIA | Gestion de propriétés à Gênes et en Ligurie", it:"AUREVIA | Gestione di proprietà a Genova e in Liguria", en:"AUREVIA | Property management in Genoa and Liguria", es:"AUREVIA | Gestión de propiedades en Génova y Liguria", ru:"AUREVIA | Управление недвижимостью в Генуе и Лигурии", zh:"AUREVIA | 热那亚与利古里亚房产管理" },
      servizi: { fr:"Services de gestion de propriété | AUREVIA", it:"Servizi di gestione immobiliare | AUREVIA", en:"Property management services | AUREVIA", es:"Servicios de gestión inmobiliaria | AUREVIA", ru:"Услуги по управлению недвижимостью | AUREVIA", zh:"房产管理服务 | AUREVIA" },
      esperienze: { fr:"Expériences sur mesure | AUREVIA", it:"Esperienze su misura | AUREVIA", en:"Tailored experiences | AUREVIA", es:"Experiencias a medida | AUREVIA", ru:"Индивидуальные впечатления | AUREVIA", zh:"专属定制体验 | AUREVIA" },
      "chi-siamo": { fr:"Notre histoire | AUREVIA", it:"La nostra storia | AUREVIA", en:"Our story | AUREVIA", es:"Nuestra historia | AUREVIA", ru:"О нас | AUREVIA", zh:"关于我们 | AUREVIA" },
      proprietari: { fr:"Accompagnement des propriétaires | AUREVIA", it:"Servizi per proprietari | AUREVIA", en:"Owner services | AUREVIA", es:"Servicios para propietarios | AUREVIA", ru:"Услуги для владельцев | AUREVIA", zh:"业主服务 | AUREVIA" },
      contatti: { fr:"Contact privé | AUREVIA", it:"Contatto riservato | AUREVIA", en:"Private contact | AUREVIA", es:"Contacto privado | AUREVIA", ru:"Конфиденциальная связь | AUREVIA", zh:"私密咨询 | AUREVIA" },
      valutazione: { fr:"Évaluation confidentielle | AUREVIA", it:"Valutazione riservata | AUREVIA", en:"Private property assessment | AUREVIA", es:"Valoración confidencial | AUREVIA", ru:"Конфиденциальная оценка | AUREVIA", zh:"私密房产评估 | AUREVIA" },
    };
    document.title = (titles[section] || titles.home)[locale];
  }, [locale, pathname]);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem("aurevia-locale", next);
    document.cookie = `aurevia-locale=${next}; path=/; max-age=31536000; samesite=lax`;
    updateLocale(next);
    window.dispatchEvent(new CustomEvent("aurevia:locale", { detail: next }));
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function LanguageOptions({ onSelect }: { onSelect?: () => void }) {
  const { locale, setLocale } = useLocale();
  return <>{locales.map((code) => (
    <button
      key={code}
      type="button"
      lang={code}
      aria-current={locale === code ? "true" : undefined}
      onClick={() => { setLocale(code); onSelect?.(); }}
    >
      {localeNames[code].short}<span>{localeNames[code].native}</span>
    </button>
  ))}</>;
}
