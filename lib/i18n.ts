import { runtimeMessages } from "./i18n-runtime";

export type Locale = "fr" | "it" | "en";
export const locales = ["it", "en", "fr"] as const;

export const localeNames: Record<Locale, { short: string; native: string }> = {
  fr: { short: "FR", native: "Français" },
  it: { short: "IT", native: "Italiano" },
  en: { short: "EN", native: "English" },
};

function normalize(source: string) {
  return source
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([:;?!])/g, "$1")
    .trim()
    .toLocaleLowerCase("fr");
}

const normalizedMessages = new Map(
  Object.entries(runtimeMessages).map(([source, value]) => [normalize(source), value]),
);

export function translate(source: string, locale: Locale) {
  if (locale === "fr") return source;
  const localized = runtimeMessages[source] ?? normalizedMessages.get(normalize(source));
  return localized?.[locale] ?? source;
}
