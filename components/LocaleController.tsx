"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { localeNames, locales, translate, type Locale } from "@/lib/i18n";

type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void };
const DEFAULT_LOCALE: Locale = "it";
const HYDRATION_LOCALE: Locale = "fr";
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

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("lang");
    const stored = localStorage.getItem("aurevia-locale");
    const initial = requested && locales.includes(requested as Locale)
      ? requested as Locale
      : stored && locales.includes(stored as Locale)
        ? stored as Locale
        : DEFAULT_LOCALE;
    const frame = requestAnimationFrame(() => updateLocale(initial));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let observer: MutationObserver | undefined;
    const hydrationDelay = window.setTimeout(() => {
      translateTree(document.body, locale);
      observer = new MutationObserver((mutations) => {
        if (translating) return;
        const needsTranslation = mutations.some((mutation) => mutation.addedNodes.length > 0 || mutation.type === "characterData");
        if (needsTranslation) requestAnimationFrame(() => translateTree(document.body, locale));
      });
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }, 250);
    return () => {
      window.clearTimeout(hydrationDelay);
      observer?.disconnect();
    };
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem("aurevia-locale", next);
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
      lang={code === "zh" ? "zh-CN" : code}
      aria-current={locale === code ? "true" : undefined}
      onClick={() => { setLocale(code); onSelect?.(); }}
    >
      {localeNames[code].short}<span>{localeNames[code].native}</span>
    </button>
  ))}</>;
}
