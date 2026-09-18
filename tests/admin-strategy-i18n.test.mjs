import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { typescriptModuleUrl } from "./helpers/import-typescript.mjs";
import { strategyStrings } from "./helpers/strategy-strings.mjs";

const { strategyMessages, translateStrategy, translateStrategyTree } = await import(await typescriptModuleUrl("lib/strategy-i18n.ts"));
const { getStrategyLocale } = await import(await typescriptModuleUrl("lib/strategy-locale.ts"));
const dataUrl = value => `data:text/javascript;base64,${Buffer.from(value).toString("base64")}`;

async function componentModule(path, signedIn = true) {
  let source = ts.transpileModule(await readFile(new URL(`../${path}`, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  for (const [, specifier] of source.matchAll(/from\s+"([^"]+)"/g)) {
    let resolved;
    if (specifier.endsWith(".css")) resolved = dataUrl('export default new Proxy({}, { get: (_, key) => key });');
    else if (specifier === "@/lib/admin") resolved = dataUrl(`export const getAdminUser = async () => ${signedIn ? '({id:"test-admin"})' : 'null'};`);
    else if (specifier === "next/navigation") resolved = dataUrl('export const redirect = path => { throw new Error(`redirect:${path}`); };');
    else if (specifier === "next/link") resolved = dataUrl(`import {createElement} from ${JSON.stringify(import.meta.resolve("react"))}; export default function Link({href, scroll, children, ...props}) { return createElement("a", {...props, href: typeof href === "string" ? href : href.pathname + "?" + new URLSearchParams(href.query)}, children); }`);
    else if (specifier === "@/components/StrategyEconomics") resolved = await componentModule("components/StrategyEconomics.tsx");
    else if (specifier.startsWith("@/lib/")) resolved = await typescriptModuleUrl(`${specifier.slice(2)}.ts`);
    else resolved = import.meta.resolve(specifier);
    source = source.replaceAll(JSON.stringify(specifier), JSON.stringify(resolved));
  }
  return dataUrl(source);
}

test("every strategy document string has French and English translations", () => {
  const nativeLanguageLabel = "Lingua / Langue / Language";
  const missing = strategyStrings().filter(source => source !== nativeLanguageLabel && (!strategyMessages[source]?.fr || !strategyMessages[source]?.en));
  assert.deepEqual(missing, []);
});

test("locale selection is limited to IT/FR/EN and preserves the Italian default", () => {
  for (const value of [undefined, "it", "de", "FR", ["fr", "en"], "<script>"]) assert.equal(getStrategyLocale(value), "it");
  assert.equal(getStrategyLocale("fr"), "fr");
  assert.equal(getStrategyLocale("en"), "en");
  assert.equal(translateStrategy("  Custodia patrimoniale. Controllo. Performance. ", "fr"), "  Protection du patrimoine. Contrôle. Performance. ");
});

test("translation preserves markup, source links, anchor IDs and numeric values", () => {
  const tree = createElement("section", {id: "decisione"}, createElement("a", {href:"https://example.test/it/source", key:"stable"}, "Torna all’amministrazione"), createElement("strong", null, 12345));
  const html = renderToStaticMarkup(translateStrategyTree(tree, "en"));
  assert.match(html, /id="decisione"/);
  assert.match(html, /href="https:\/\/example.test\/it\/source"/);
  assert.match(html, /Back to administration/);
  assert.match(html, /12345/);
});

const { default: StrategyPage, generateMetadata } = await import(await componentModule("app/administration/strategia/page.tsx"));

for (const [locale, heading, feeLabel] of [
  ["it", "Custodia patrimoniale. Controllo. Performance.", "Commissione Aurevia"],
  ["fr", "Protection du patrimoine. Contrôle. Performance.", "Commission Aurevia"],
  ["en", "Asset protection. Control. Performance.", "Aurevia commission"],
]) {
  test(`${locale}: full authenticated report and calculator render in the selected language`, async () => {
    const props = {searchParams: Promise.resolve({lang:locale})};
    const html = renderToStaticMarkup(await StrategyPage(props));
    assert.ok(html.includes(heading));
    assert.ok(html.includes(feeLabel));
    assert.ok(html.includes(`lang="${locale}"`));
    const activeLanguageLink = html.match(/<a\b[^>]*aria-current="true"[^>]*>/)?.[0];
    assert.ok(activeLanguageLink?.includes(`href="/administration/strategia?lang=${locale}"`));
    assert.equal((html.match(/<details/g) || []).length, 30);
    assert.equal((html.match(/<section /g) || []).length, 15);
    assert.equal((html.match(/type="range"/g) || []).length, 4);
    const expectedGmv = new Intl.NumberFormat({it:"it-IT",fr:"fr-FR",en:"en-GB"}[locale], {style:"currency",currency:"EUR",maximumFractionDigits:0}).format(157500);
    assert.ok(html.includes(expectedGmv), "identical economic result, localised formatting only");
    if (locale !== "it") {
      for (const italian of ["La tesi in una frase", "Affidare la gestione non significa rinunciare al controllo.", "Costi fissi e compenso founder separati.", "Formula: immobili"]) assert.ok(!html.includes(italian), italian);
    }
    const metadata = await generateMetadata(props);
    assert.equal(metadata.robots.index, false);
    assert.equal(metadata.openGraph.locale, {it:"it_IT",fr:"fr_FR",en:"en_GB"}[locale]);
  });
}

test("all translated versions still require administrator authentication", async () => {
  const { default: PrivatePage } = await import(await componentModule("app/administration/strategia/page.tsx", false));
  for (const locale of ["it", "fr", "en"]) await assert.rejects(PrivatePage({searchParams:Promise.resolve({lang:locale})}), /redirect:\/connexion/);
});
