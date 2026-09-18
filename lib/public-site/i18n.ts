import { runtimeMessages as legacyMessages } from "../i18n-runtime";
import { runtimeMessages as publicMessages } from "./i18n-runtime-v2";
import { experienceMessages } from "./experience-messages";
// Reuse established translations; service additions are scoped to the public site.
const runtimeMessages = { ...publicMessages, ...legacyMessages, ...experienceMessages };

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

const italianMessages = new Map(
  Object.entries(runtimeMessages).map(([source, value]) => [normalize(value.it), { fr: source, en: value.en }]),
);

function translateComposedLabel(source: string, locale: Locale): string | undefined {
  const titled = source.match(/^(.+?)\s*\|\s*AUREVIA$/i);
  if (titled) return `${translate(titled[1], locale)} | AUREVIA`;

  const describedImage = source.match(/^(.+?)\s+—\s+(.+)$/);
  if (describedImage) return `${translate(describedImage[1], locale)} — ${translate(describedImage[2], locale)}`;

  const patterns = [
    {
      french: /^Découvrir le service\s*:\s*(.+)$/i,
      italian: /^Scoprire il servizio\s*:\s*(.+)$/i,
      render: { fr: "Découvrir le service", it: "Scoprire il servizio", en: "Explore the service" },
    },
    {
      french: /^Découvrir\s*:\s*(.+)$/i,
      italian: /^Scoprire\s*:\s*(.+)$/i,
      render: { fr: "Découvrir", it: "Scoprire", en: "Discover" },
    },
    {
      french: /^Découvrir\s+(.+)$/i,
      italian: /^Scoprire\s+(.+)$/i,
      render: { fr: "Découvrir", it: "Scoprire", en: "Discover" },
      separator: " ",
    },
  ] as const;

  for (const pattern of patterns) {
    const match = source.match(pattern.french) ?? source.match(pattern.italian);
    if (!match) continue;
    return `${pattern.render[locale]}${"separator" in pattern ? pattern.separator : ": "}${translate(match[1], locale)}`;
  }

  return undefined;
}

export function translate(source: string, locale: Locale): string {
  const fromFrench = runtimeMessages[source] ?? normalizedMessages.get(normalize(source));
  const fromItalian = italianMessages.get(normalize(source));

  if (locale === "it") return fromFrench?.it ?? translateComposedLabel(source, locale) ?? source;
  if (locale === "fr") return fromItalian?.fr ?? translateComposedLabel(source, locale) ?? source;
  if (locale === "en") return fromFrench?.en ?? fromItalian?.en ?? translateComposedLabel(source, locale) ?? source;
  return translateComposedLabel(source, locale) ?? source;
}

export function translateDeep<T>(value: T, locale: Locale): T {
  if (typeof value === "string") return translate(value, locale) as T;
  if (Array.isArray(value)) return value.map((item) => translateDeep(item, locale)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, translateDeep(item, locale)]),
    ) as T;
  }
  return value;
}
