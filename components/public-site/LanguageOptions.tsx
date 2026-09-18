"use client";

import { useLocale } from "@/components/LocaleController";
import { localeNames, locales, type Locale } from "@/lib/public-site/i18n";

export function LanguageOptions({ dropdown = false }: { dropdown?: boolean }) {
  const { locale, setLocale } = useLocale();
  if (dropdown) return <label className="aurevia-language-picker" data-no-translate>
    <span className="sr-only">Lingua / Language / Langue</span>
    <select value={locale} onChange={event => setLocale(event.target.value as Locale)}>
      {locales.map(code => <option key={code} value={code} lang={code}>{localeNames[code].short}</option>)}
    </select>
  </label>;
  return <div className="aurevia-language-options" data-no-translate>
    {locales.map(code => <button key={code} type="button" lang={code} aria-current={locale === code ? "true" : undefined} onClick={() => setLocale(code)}>{localeNames[code].native}</button>)}
  </div>;
}
