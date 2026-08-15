"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n";

const LocaleContext = createContext<{ locale: Locale }>({ locale: "fr" });

export function useLocale() {
  return useContext(LocaleContext);
}

export function LanguageOptions({ onSelect }: { onSelect?: () => void }) {
  return <button type="button" className="locale-static" onClick={onSelect}>FR</button>;
}

export function LocaleController({ children }: { children: React.ReactNode }) {
  return <LocaleContext.Provider value={{ locale: "fr" }}>{children}</LocaleContext.Provider>;
}
