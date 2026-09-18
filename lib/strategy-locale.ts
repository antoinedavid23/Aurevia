export type StrategyLocale = "it" | "fr" | "en";

export function getStrategyLocale(value: string | string[] | undefined): StrategyLocale {
  return value === "fr" || value === "en" ? value : "it";
}

export const strategyLocaleNames = [
  { code: "it", name: "Italiano" },
  { code: "fr", name: "Français" },
  { code: "en", name: "English" },
] as const;
