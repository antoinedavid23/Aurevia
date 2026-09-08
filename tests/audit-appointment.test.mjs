import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Render the real appointment page without contacting Calendly or booking a slot.
const require = createRequire(import.meta.url);
const url = source => `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const reactUrl = pathToFileURL(require.resolve("react")).href;
const jsxUrl = pathToFileURL(require.resolve("react/jsx-runtime")).href;
async function compile(path, imports = {}, suffix = "") {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  let output = ts.transpileModule(source + suffix, { compilerOptions: {
    module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText;
  for (const [key, value] of Object.entries({ react: reactUrl, "react/jsx-runtime": jsxUrl, ...imports })) {
    output = output.replaceAll(JSON.stringify(key), JSON.stringify(value));
  }
  return url(output);
}
const bookingSource = await readFile(new URL("../lib/audit-booking.ts", import.meta.url), "utf8");
const defaultBooking = url(ts.transpileModule(bookingSource.replace("process.env.NEXT_PUBLIC_BOOKING_URL", "undefined"), {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText);
const { AUDIT_APPOINTMENT_PATH, AUREVIA_CALENDLY_URL } = await import(defaultBooking);
const exactCalendar = "https://calendly.com/antoinedavid/contatto";

test("booking defaults to the supplied calendar and a dedicated internal route", () => {
  assert.equal(AUDIT_APPOINTMENT_PATH, "/audit/appuntamento");
  assert.equal(AUREVIA_CALENDLY_URL, exactCalendar);
});

for (const locale of ["it", "fr", "en"]) {
  test(`${locale}: appointment page provides the calendar, direct fallback and return to audit`, async () => {
    const view = await compile("../components/AuditAppointment.tsx", {
      "next/link": url(`import {createElement} from ${JSON.stringify(reactUrl)}; export default function Link(props) { return createElement('a', props); }`),
      "lucide-react": url("export const ArrowLeft = () => null; export const ArrowUpRight = () => null;"),
      "@/components/LocaleController": url(`export const useLocale = () => ({locale:${JSON.stringify(locale)}});`),
      "@/components/AuditLanguageMenu": url("export const AuditLanguageMenu = () => null;"),
      "@/lib/audit-booking": defaultBooking,
      "./AuditAppointment.module.css": url("export default new Proxy({}, { get: (_, name) => name });"),
    }, "\nexport { copy };\n");
    const { AuditAppointment, copy } = await import(view);
    const html = renderToStaticMarkup(createElement(AuditAppointment));
    assert.match(html, new RegExp(`lang="${locale}"`));
    assert.ok(html.includes(`<h1>${copy[locale].title}</h1>`));
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    const iframe = html.match(/<iframe\b[^>]*>/)?.[0];
    assert.ok(iframe?.includes(`src="${exactCalendar}"`));
    assert.ok(iframe.includes(`title="${copy[locale].calendar}"`));
    assert.match(iframe, /referrerPolicy="no-referrer"/);
    const fallback = [...html.matchAll(/<a\b[^>]*>/g)].map(match => match[0]).find(anchor => anchor.includes(`href="${exactCalendar}"`));
    assert.match(fallback, /target="_blank"/);
    assert.match(fallback, /rel="noopener noreferrer"/);
    assert.ok(fallback.includes(`aria-label="${copy[locale].fallback} — ${copy[locale].newTab}"`));
    assert.ok(html.indexOf(fallback) < html.indexOf(iframe), "fallback is available before the embedded calendar");
    assert.match(html, /href="\/audit\/grazie"/);
    assert.match(html, /src="\/images\/brand\/aurevia-logo-transparent-gold.png"/);
    assert.doesNotMatch(html, /<form\b|<input\b|href="\/contatti|[?&](?:name|email|phone)=/);
    assert.deepEqual(Object.keys(copy[locale]).sort(), Object.keys(copy.it).sort());
  });
}

test("appointment route renders without an audit session and is not indexed", async () => {
  const route = await compile("../app/audit/appuntamento/page.tsx", {
    "@/components/AuditAppointment": url(`import {createElement} from ${JSON.stringify(reactUrl)}; export const AuditAppointment = () => createElement('main', null, 'calendar');`),
  });
  const { default: Page, metadata } = await import(route);
  assert.equal(renderToStaticMarkup(createElement(Page)), "<main>calendar</main>");
  assert.deepEqual(metadata.robots, { index: false, follow: false });
});
