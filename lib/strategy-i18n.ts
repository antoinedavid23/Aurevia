import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import type { StrategyLocale } from "./strategy-locale";
import { market } from "./strategy-translations/market";
import { advertising } from "./strategy-translations/advertising";
import { operations } from "./strategy-translations/operations";
import { overview } from "./strategy-translations/overview";
import { execution } from "./strategy-translations/execution";
import { roadmap } from "./strategy-translations/roadmap";

// Used only by the authenticated server page. No external translation requests.
export const strategyMessages: Record<string, { fr: string; en: string }> = {
  ...market, ...advertising, ...operations, ...overview, ...execution, ...roadmap,
  "Strategia premium Genova": { fr: "Stratégie premium à Gênes", en: "Genoa premium strategy" },
  "Strumento decisionale privato per la crescita di AUREVIA a Genova.": {
    fr: "Outil de décision privé pour la croissance d’AUREVIA à Gênes.",
    en: "Private decision-making tool for AUREVIA’s growth in Genoa.",
  },
  "AUREVIA · Strategia privata Genova": { fr: "AUREVIA · Stratégie privée à Gênes", en: "AUREVIA · Private Genoa strategy" },
};

export function translateStrategy(source: string, locale: StrategyLocale): string {
  if (locale === "it") return source;
  const key = source.replace(/\s+/g, " ").trim();
  const translated = strategyMessages[key]?.[locale];
  if (!translated) return source;
  return `${source.match(/^\s*/)?.[0] ?? ""}${translated}${source.match(/\s*$/)?.[0] ?? ""}`;
}

// Translate the server-rendered document before it reaches the browser, preserving
// markup, links, identifiers and React keys. Client calculators localise their own UI.
export function translateStrategyTree(node: ReactNode, locale: StrategyLocale): ReactNode {
  if (typeof node === "string") return translateStrategy(node, locale);
  if (Array.isArray(node)) return Children.map(node, child => translateStrategyTree(child, locale));
  if (!isValidElement<{ children?: ReactNode; title?: string; "aria-label"?: string }>(node)) return node;
  const props = node.props;
  return cloneElement(node, {
    ...(props.children !== undefined ? { children: translateStrategyTree(props.children, locale) } : {}),
    ...(typeof props.title === "string" ? { title: translateStrategy(props.title, locale) } : {}),
    ...(typeof props["aria-label"] === "string" ? { "aria-label": translateStrategy(props["aria-label"], locale) } : {}),
  });
}
