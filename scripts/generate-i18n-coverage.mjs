import fs from "node:fs";
import path from "node:path";

const sourceRoots = ["app", "components", "data"];
const dictionaryFiles = [
  "lib/i18n.ts",
  "lib/i18n-public.ts",
  "lib/i18n-supplement.ts",
];
const ignoredPathFragments = [
  `${path.sep}administration${path.sep}`,
  `${path.sep}api${path.sep}`,
  `${path.sep}Admin`,
];
const ignoredValueFragments = [
  "container ",
  "content-section",
  "service-card",
  "service-section",
  "dark-heading",
  "form-grid",
  "page-hero",
];
const targets = [
  ["it", "it"],
  ["en", "en"],
  ["es", "es"],
  ["ru", "ru"],
  ["zh", "zh-CN"],
];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const current = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(current) : [current];
  });
}

function isPublicSource(file) {
  return (
    /\.(?:tsx?|jsx?)$/.test(file) &&
    !ignoredPathFragments.some((fragment) => file.includes(fragment))
  );
}

function isFrenchUiCopy(value) {
  if (
    value.length < 3 ||
    value.includes("${") ||
    /^[/#.A-Za-z0-9_:@-]+$/.test(value) ||
    ignoredValueFragments.some((fragment) => value.includes(fragment))
  ) {
    return false;
  }
  return (
    /[À-ÿœŒ’]/.test(value) ||
    /\b(?:accueil|bien|confidentialité|contact|demande|des|du|expérience|gestion|Gênes|la|le|les|notre|propriété|service|une|un|vous|votre)\b/i.test(
      value,
    )
  );
}

function collectExistingKeys() {
  const content = dictionaryFiles
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n");
  return new Set(
    [...content.matchAll(/^\s*["']([^"'\\n]+)["']\s*:/gm)].map(
      (match) => match[1],
    ),
  );
}

function collectMissingSources() {
  const existing = collectExistingKeys();
  const files = sourceRoots
    .flatMap((root) => walk(root))
    .filter(isPublicSource);
  const values = new Set();

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(/(["'`])([^\n]*?)\1/g)) {
      const value = match[2].trim();
      if (isFrenchUiCopy(value) && !existing.has(value)) values.add(value);
    }
  }

  return [...values].sort((a, b) => a.localeCompare(b, "fr"));
}

function makeBatches(values, maxCharacters = 3400) {
  const batches = [];
  let current = [];
  let size = 0;
  for (const value of values) {
    if (current.length && size + value.length > maxCharacters) {
      batches.push(current);
      current = [];
      size = 0;
    }
    current.push(value);
    size += value.length + 32;
  }
  if (current.length) batches.push(current);
  return batches;
}

async function translateText(text, language) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "fr");
  url.searchParams.set("tl", language);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Translation request failed: ${response.status}`);
  const payload = await response.json();
  return payload[0].map((part) => part[0]).join("");
}

async function translateBatch(batch, language) {
  const tagged = batch
    .map((value, index) => `[AUREVIA_${String(index).padStart(4, "0")}] ${value}`)
    .join("\n");
  const translated = await translateText(tagged, language);
  const matches = [...translated.matchAll(/\[AUREVIA_(\d{4})\]\s*/g)];
  if (matches.length === batch.length) {
    return matches.map((match, index) => {
      const start = match.index + match[0].length;
      const end = matches[index + 1]?.index ?? translated.length;
      return translated.slice(start, end).trim();
    });
  }

  const fallback = [];
  for (const value of batch) {
    fallback.push((await translateText(value, language)).trim());
  }
  return fallback;
}

const sources = collectMissingSources();
const translations = Object.fromEntries(
  sources.map((source) => [source, Object.create(null)]),
);

for (const [locale, language] of targets) {
  for (const batch of makeBatches(sources)) {
    const translated = await translateBatch(batch, language);
    translated.forEach((value, index) => {
      translations[batch[index]][locale] = value;
    });
  }
  console.log(`${locale}: ${sources.length} textes couverts`);
}

const output = `/*
 * Exhaustive fallback coverage for public copy.
 *
 * Generated from the public React source. Curated brand transcreations in
 * i18n.ts, i18n-public.ts and i18n-supplement.ts always take precedence.
 * Regenerate after adding public French copy:
 *   node scripts/generate-i18n-coverage.mjs
 */
type GeneratedLocalized = Record<"it" | "en" | "es" | "ru" | "zh", string>;

export const generatedMessages: Record<string, GeneratedLocalized> = ${JSON.stringify(
  translations,
  null,
  2,
)};
`;

fs.writeFileSync("lib/i18n-generated.ts", output, "utf8");
console.log(`lib/i18n-generated.ts: ${sources.length} entrées générées`);
