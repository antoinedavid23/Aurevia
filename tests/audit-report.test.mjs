import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Render the actual report without a browser, lead submission or live booking.
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
const css = url("export default new Proxy({}, { get: (_, name) => name });");
const location = await compile("../lib/audit-location.ts");
const portfolio = await compile("../lib/audit-portfolio.ts");
const bookingConfig = await compile("../lib/audit-booking.ts");
const distribution = await compile("../lib/audit-distribution.ts");
const objectives = await compile("../lib/audit-objectives.ts");
const model = await compile("../lib/audit-model.ts", {
  "./simulator": await compile("../lib/simulator.ts"), "./audit-location": location,
  "./audit-portfolio": portfolio, "./audit-calendar": await compile("../lib/audit-calendar.ts"),
  "./audit-distribution": distribution,
  "./audit-objectives": objectives,
});
const content = await compile("../components/audit-content.ts", { "@/lib/audit-location": location, "@/lib/audit-distribution": distribution });
const { auditResult } = await import(model);
const { initialAnswers, initialFinance } = await import(content);
const portfolioView = await compile("../components/AuditPortfolioSummary.tsx", {
  "@/lib/audit-portfolio": portfolio, "./AuditPortfolioSummary.module.css": css,
});
const locationView = await compile("../components/AuditLocationSummary.tsx", {
  "@/lib/audit-location": location, "./AuditLocationSummary.module.css": css,
});
const answers = { ...initialAnswers, portfolio: "2-4", status: "active", distribution: "airbnb", area: "genova", zone: "levante", neighborhood: "nervi" };
const finance = { ...initialFinance, propertyCount: 3, currentNightly: 180, days: 365, occupancy: 48, annualCosts: 4800, channelMix: { ...initialFinance.channelMix, airbnb: { share: 100, fee: 15.5 } } };
const stored = { version: 2, name: "Test", answers, finance, result: auditResult(answers, finance), receipt: { reference: "test-only", channels: ["inbox"] } };
const iconNames = ["ArrowRight", "CalendarDays", "Check", "FileLock2", "LockKeyhole", "ShieldCheck", "Sparkles", "TrendingUp"];

test("optional fee controls open, edit, clear and defer using the actual handlers, without submitting", async () => {
  const fields = await compile("../components/AuditDistributionFields.tsx", {
    "@/lib/audit-distribution": distribution, "./AuditQuestionnaire.module.css": css,
  });
  const { AuditDistributionFields } = await import(fields);
  const { calculateAuditDistribution } = await import(distribution);
  let state = { ...initialFinance };
  const nodes = element => Array.isArray(element) ? element.flatMap(nodes)
    : element && typeof element === "object" && element.props ? [element, ...nodes(element.props.children)] : [];
  const tree = () => nodes(AuditDistributionFields({ locale: "fr", distribution: "multi", finance: state,
    setFinance: update => { state = typeof update === "function" ? update(state) : update; } }));
  const control = className => tree().find(node => node.type === "button" && node.props.className === className);
  assert.equal(tree().filter(node => node.type === "input").length, 0);
  assert.equal(control("channelToggle").props.type, "button");
  control("channelToggle").props.onClick();
  assert.equal(state.channelFeeMode, "average");
  const averageInput = () => tree().find(node => node.props.id === "audit-average-channel-fee");
  averageInput().props.onChange({ currentTarget: { value: "13.55" } });
  assert.equal(calculateAuditDistribution("multi", state).effectiveRate, 13.55);
  averageInput().props.onChange({ currentTarget: { value: "" } });
  assert.equal(state.averageChannelFee, null);
  assert.equal(calculateAuditDistribution("multi", state).canContinue, true);
  control("channelDetailLink").props.onClick();
  assert.equal(state.channelFeeMode, "detailed");
  assert.equal(tree().filter(node => node.type === "input").length, 6);
  assert.equal(calculateAuditDistribution("multi", state).canContinue, false);
  for (const node of tree().filter(node => node.type === "button")) assert.equal(node.props.type, "button");
  control("channelDefer").props.onClick();
  assert.equal(state.channelFeeMode, "unknown");
  assert.equal(tree().filter(node => node.type === "input").length, 0);
  assert.equal(calculateAuditDistribution("multi", state).canContinue, true);
  assert.equal(calculateAuditDistribution("multi", state).effectiveRate, null);
});

for (const locale of ["it", "fr", "en"]) {
  test(`${locale}: public location summary shows only declared and +20% rates`, async () => {
    const { AuditLocationSummary } = await import(locationView);
    const result = auditResult(answers, { ...finance, currentNightly: 160 });
    const html = renderToStaticMarkup(createElement(AuditLocationSummary, {
      locale, detailed: true, location: { ...result.location, appliedBaseNightly: 190, propertyNightly: 343 },
    }));
    assert.match(html, /160/);
    assert.match(html, /192/);
    assert.match(html, /\+20\s?%/);
    assert.doesNotMatch(html, /190|343/);
    const pricingExplanation = {
      it: [/tarificazione dinamica/, /domanda/, /stagione/, /aumento medio del 20%/, /base annua/],
      fr: [/tarification dynamique/, /demande/, /saison/, /hausse moyenne de 20 %/, /sur l’année/],
      en: [/dynamic pricing/, /demand/, /seasonality/, /20% increase in the average nightly rate/, /over the year/],
    };
    for (const phrase of pricingExplanation[locale]) assert.match(html, phrase);
    assert.doesNotMatch(html, /sans autre coefficient|senza ulteriori coefficienti|without additional coefficients/);
    const launch = auditResult({ ...answers, status: "launch", distribution: "none" }, finance);
    const launchHtml = renderToStaticMarkup(createElement(AuditLocationSummary, { locale, detailed: true, location: launch.location }));
    assert.ok(launchHtml.includes(String(launch.targetNightly)));
    assert.doesNotMatch(launchHtml, /\+20\s?%/);
  });

  test(`${locale}: questionnaire makes channel fees optional and keeps management percentages editable`, async () => {
    const fields = await compile("../components/AuditDistributionFields.tsx", {
      "@/lib/audit-distribution": distribution, "./AuditQuestionnaire.module.css": css,
    });
    const view = await compile("../components/AuditQuestionnaire.tsx", {
      "next/link": url(`import {createElement} from ${JSON.stringify(reactUrl)}; export default function Link(props) { return createElement('a', props); }`),
      "motion/react": url(`import {createElement} from ${JSON.stringify(reactUrl)}; export const useReducedMotion = () => true; export const motion = {div: ({children,className}) => createElement('div',{className},children)};`),
      "lucide-react": url(["ArrowLeft", "ArrowRight", "Check", "LockKeyhole"].map(name => `export const ${name} = () => null;`).join("\n")),
      "@/lib/audit-model": model,
      "@/lib/audit-location": location,
      "@/lib/audit-portfolio": portfolio,
      "@/lib/audit-distribution": distribution,
      "@/lib/audit-objectives": objectives,
      "./AuditLocationFields": url("export const AuditLocationFields = () => null;"),
      "./AuditLocationSummary": url("export const AuditLocationSummary = () => null;"),
      "./AuditDistributionFields": fields,
      "./audit-content": content,
      "./AuditQuestionnaire.module.css": css,
    });
    const { AuditQuestionnaire } = await import(view);
    const { auditCopy } = await import(content);
    const props = { locale, screen: auditCopy[locale].questions.findIndex(q => q.key === "distribution"), answers, finance,
      result: stored.result, status: "", setAnswers: () => {}, setFinance: () => {}, onNext: () => {}, onBack: () => {}, onSubmit: () => {} };
    const complete = renderToStaticMarkup(createElement(AuditQuestionnaire, props));
    assert.match(complete, /value="direct-only"/);
    assert.match(complete, /value="15.5"/);
    const button = markup => markup.match(/<button[^>]*class="next"[^>]*>/)?.[0];
    assert.ok(button(complete));
    assert.doesNotMatch(button(complete), /disabled/);
    const missing = renderToStaticMarkup(createElement(AuditQuestionnaire, { ...props, finance: initialFinance }));
    assert.doesNotMatch(button(missing), /disabled/);
    assert.match(missing, /aria-expanded="false"/);
    assert.match(missing, /aria-controls="audit-channel-editor"/);
    assert.match(missing, /id="audit-channel-editor" hidden=""/);
    assert.doesNotMatch(missing, /type="number"/, "no fee inputs on the default path");
    const unselected = renderToStaticMarkup(createElement(AuditQuestionnaire, { ...props, answers: { ...answers, distribution: "" }, finance: initialFinance }));
    assert.match(button(unselected), /disabled/);
    for (const averageChannelFee of [null, 0, 13.55, -1, 101]) {
      const average = renderToStaticMarkup(createElement(AuditQuestionnaire, { ...props, answers: { ...answers, distribution: "multi" }, finance: { ...initialFinance, channelFeeMode: "average", averageChannelFee } }));
      assert.match(average, /aria-expanded="true"/);
      assert.equal([...average.matchAll(/type="number"/g)].length, 1);
      assert.match(average, /id="audit-average-channel-fee"/);
      assert.match(average, /aria-describedby="audit-average-channel-hint"/);
      assert.equal(button(average).includes("disabled"), averageChannelFee !== null && (averageChannelFee < 0 || averageChannelFee > 100));
    }
    const detailed = renderToStaticMarkup(createElement(AuditQuestionnaire, { ...props, answers: { ...answers, distribution: "multi" }, finance: { ...initialFinance, channelFeeMode: "detailed" } }));
    assert.equal([...detailed.matchAll(/type="number"/g)].length, 6);
    assert.match(button(detailed), /disabled/, "an explicitly entered breakdown must reconcile or be deferred");
    const deferred = renderToStaticMarkup(createElement(AuditQuestionnaire, { ...props, finance: { ...finance, channelFeeMode: "unknown" } }));
    assert.doesNotMatch(deferred, /type="number"/, "deferred inputs are unmounted and cannot block native form validation");
    assert.doesNotMatch(button(deferred), /disabled/);
    const priorityQuestion = auditCopy[locale].questions.findIndex(q => q.key === "objective");
    for (const objective of [[], ["time"], ["revenue", "time", "care", "scale"], "care"]) {
      const priorityMarkup = renderToStaticMarkup(createElement(AuditQuestionnaire, {
        ...props, screen: priorityQuestion, answers: { ...answers, objective },
      }));
      const choices = [...priorityMarkup.matchAll(/<input[^>]*type="checkbox"[^>]*>/g)].map(match => match[0]);
      assert.equal(choices.length, 4);
      assert.doesNotMatch(priorityMarkup, /type="radio"/);
      const selected = Array.isArray(objective) ? objective : [objective];
      for (const input of choices) {
        const value = input.match(/value="([^"]+)"/)[1];
        assert.equal(input.includes('checked=""'), selected.includes(value));
      }
      assert.equal(button(priorityMarkup).includes("disabled"), selected.length === 0);
      assert.ok(priorityMarkup.includes(auditCopy[locale].chooseMultipleHint));
    }
    assert.match(complete, /type="radio"/, "other questions remain single-choice");
    const managementInput = markup => markup.match(/<input[^>]*id="audit-management-rate"[^>]*>/)?.[0];
    const performance = (selectedAnswers, selectedFinance) => renderToStaticMarkup(createElement(AuditQuestionnaire, {
      ...props, screen: auditCopy[locale].questions.length + 1, answers: selectedAnswers, finance: selectedFinance,
      result: auditResult(selectedAnswers, selectedFinance),
    }));
    for (const status of ["active", "managed", "secondary"]) {
      const selectedAnswers = { ...answers, status };
      for (const currentManagementRate of [0, 12.5, 18.75, 50]) {
        const markup = performance(selectedAnswers, { ...finance, currentManagementRate });
        const input = managementInput(markup);
        assert.ok(input);
        assert.doesNotMatch(input, /disabled|readonly/);
        assert.ok(input.includes(`value="${currentManagementRate}"`));
        assert.match(input, /step="0.01"/);
        assert.match(input, /aria-describedby="audit-management-hint"/);
        assert.match(markup, /id="audit-management-hint"/);
        assert.doesNotMatch(button(markup), /disabled/);
      }
      const blank = performance(selectedAnswers, { ...finance, currentManagementRate: NaN });
      assert.match(managementInput(blank), /value=""/);
      assert.match(button(blank), /disabled/);
    }
    for (const selectedAnswers of [{ ...answers, status: "launch" }, { ...answers, status: "secondary", distribution: "none" }]) {
      const noHistory = performance(selectedAnswers, { ...finance, currentNightly: NaN, occupancy: NaN, currentManagementRate: NaN });
      assert.equal(managementInput(noHistory), undefined);
      assert.doesNotMatch(noHistory, /id="audit-nightly-rate"|id="audit-occupancy"|class="currentRevenue"/);
      assert.match(noHistory, /id="audit-annual-costs"/);
      assert.match(noHistory, /name="rentalHistory"/);
      assert.doesNotMatch(button(noHistory), /disabled/, "launch only requires relevant annual costs");
      const entered = { ...finance, hasRentalHistory: true, currentNightly: 160, occupancy: 40, currentManagementRate: 20 };
      const withHistory = performance(selectedAnswers, entered);
      assert.doesNotMatch(managementInput(withHistory), /disabled/);
      assert.match(managementInput(withHistory), /value="20"/);
      assert.match(withHistory, /id="audit-nightly-rate"[^>]*value="160"/);
      assert.match(withHistory, /id="audit-occupancy"[^>]*value="40"/);
      assert.doesNotMatch(button(withHistory), /disabled/);
      const cleared = performance(selectedAnswers, { ...entered, currentNightly: NaN });
      assert.match(cleared, /id="audit-nightly-rate"[^>]*value=""/);
      assert.match(button(cleared), /disabled/);
    }
    for (const days of [30, 197, 365]) {
      const markup = renderToStaticMarkup(createElement(AuditQuestionnaire, { ...props, screen: auditCopy[locale].questions.length, finance: { ...finance, days } }));
      const slider = markup.match(/<input[^>]*id="audit-days"[^>]*>/)?.[0];
      assert.match(slider, /min="30" max="365" step="1"/);
      assert.ok(slider.includes(`value="${days}"`));
      assert.ok(slider.includes(`--range-progress:${(days - 30) / 335 * 100}%`));
    }
  });

  test(`${locale}: early booking, useful figures and reserved details coexist`, async () => {
    const view = await compile("../components/AuditThankYou.tsx", {
      "next/link": url(`import {createElement} from ${JSON.stringify(reactUrl)}; export default function Link(props) { return createElement('a', props); }`),
      "lucide-react": url(iconNames.map(name => `export const ${name} = () => null;`).join("\n")),
      "@/components/LocaleController": url(`export const useLocale = () => ({locale:${JSON.stringify(locale)}});`),
      "@/components/AuditLanguageMenu": url("export const AuditLanguageMenu = () => null;"),
      "./AuditLocationSummary": locationView,
      "./AuditPortfolioSummary": portfolioView,
      "@/lib/audit-portfolio": portfolio,
      "@/lib/audit-booking": bookingConfig,
      "@/lib/audit-distribution": distribution,
      "@/lib/audit-session": url("export const getAuditSession = () => null; export const getServerAuditSession = () => null; export const subscribeAuditSession = () => () => {};"),
      "./AuditThankYou.module.css": css,
    }, "\nexport { thanks };\n");
    const { AuditReport, thanks } = await import(view);
    const before = JSON.stringify(stored);
    const html = renderToStaticMarkup(createElement(AuditReport, { stored, locale }));
    const text = html.replace(/<[^>]+>/g, " ").replaceAll("&nbsp;", " ");
    const booking = "/audit/appuntamento";
    assert.ok(html.indexOf(`href="${booking}"`) < html.indexOf('class="included"'), "booking is in the opening screen");
    assert.ok(html.split(`href="${booking}"`).length - 1 >= 8, "booking remains available throughout the report");
    const bookingAnchors = [...html.matchAll(/<a\b[^>]*>/g)].map(match => match[0]).filter(anchor => anchor.includes(`href="${booking}"`));
    for (const anchor of bookingAnchors) {
      assert.doesNotMatch(anchor, /target=/, "appointment page opens in the same tab");
      assert.match(anchor, /aria-label="[^"]*AUREVIA/);
      assert.doesNotMatch(anchor, /[?&](?:name|email|phone)=/, "contact data is not forwarded in the calendar URL");
    }
    assert.doesNotMatch(html, /href="\/contatti(?:\?|"|\/)/);
    assert.doesNotMatch(html, /href="https:\/\/calendly\.com\//, "the report routes through the dedicated AUREVIA page");
    assert.match(html, /href="#audit-strategy"/);
    assert.match(html, /id="audit-strategy"/);
    assert.equal((html.match(/class="reservedOperation"/g) || []).length, 2);
    assert.match(html, /class="redactedLines" aria-hidden="true"/);
    assert.match(html, /class="quarters"/);
    assert.match(html, /class="evidence"/);
    assert.ok(html.includes("15.5%"), "actual weighted channel fees remain visible");
    assert.doesNotMatch(html, /class="audit-season-chart"/);
    for (const phrase of thanks[locale].diagnosisNotes.slice(2)) assert.ok(!text.includes(phrase), "reserved recommendations are not rendered behind a blur");
    const money = value => new Intl.NumberFormat(locale === "en" ? "en-GB" : `${locale}-${locale.toUpperCase()}`, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
    for (const amount of [stored.result.projectedGross, stored.result.perProperty.projectedGross, stored.result.projectedNet, stored.result.currentGross, stored.result.occupancyContribution, stored.result.pricingContribution]) {
      assert.ok(text.includes(money(amount)), `financial result ${amount} remains visible`);
    }
    assert.equal(JSON.stringify(stored), before, "display restrictions never mutate the full internal dossier");
    assert.deepEqual(Object.keys(thanks[locale]).sort(), Object.keys(thanks.it).sort());
    const internal = renderToStaticMarkup(createElement(AuditReport, { stored, locale: "fr", internal: true }));
    assert.match(internal, /Audit intégral/);
    assert.match(internal, /janvier/);
    assert.match(internal, /décembre/);
    assert.match(internal, /Total annuel/);
    assert.doesNotMatch(internal, /redacted|reservedOperation|audit-unlock|audit-pricing-lock|audit-locked-lines|href="\/audit\/appuntamento/);
    for (const phrase of thanks.fr.diagnosisNotes) assert.ok(internal.includes(phrase));
    assert.equal(JSON.stringify(stored), before);
  });
}
