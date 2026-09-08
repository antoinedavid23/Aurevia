import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import ts from "typescript";
import { typescriptModuleUrl } from "./import-typescript.mjs";

const { auditResult } = await import(await typescriptModuleUrl("lib/audit-model.ts"));
const { initialAnswers, initialFinance, auditCopy } = await import(await typescriptModuleUrl("components/audit-content.ts"));
const { portfolioCopy } = await import(await typescriptModuleUrl("lib/audit-portfolio.ts"));
const { calculateAuditDistribution } = await import(await typescriptModuleUrl("lib/audit-distribution.ts"));
const { describeAuditObjectives } = await import(await typescriptModuleUrl("lib/audit-objectives.ts"));
const source = await readFile(new URL("../../components/AuditFunnel.tsx", import.meta.url), "utf8");
const begin = source.indexOf("    const optionLabel =");
const end = source.indexOf("    try {\n      const response = await fetch", begin);
assert.ok(begin > 0 && end > begin);
const builder = ts.transpileModule(`export function build(answers, finance, result, locale, t, data, portfolioCopy, objectives, distribution, internalMonths) {\n${source.slice(begin, end)}\nreturn payload; }`, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { build } = await import(`data:text/javascript;base64,${Buffer.from(builder).toString("base64")}`);
const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

// Entire real client payload, with fictional data only. Does not make requests.
export function auditPayload(locale = "it", answerOverrides = {}, financeOverrides = {}) {
  const answers = { ...initialAnswers, portfolio: "5-15", status: "active", objective: ["time", "care"], distribution: "multi",
    area: "genova", zone: "levante", neighborhood: "nervi", timing: "now",
    compliance: auditCopy[locale].questions.find(question => question.key === "compliance").options[0].value,
    address: "Via del Test 12, Nervi", constraint: "Vorrei mantenere luglio libero. Keep August free too.", ...answerOverrides };
  const finance = { ...initialFinance, propertyCount: 7, currentNightly: 160, occupancy: 40, annualCosts: 4800,
    currentManagementRate: 15, channelFeeMode: "average", averageChannelFee: 8, ...financeOverrides };
  const result = auditResult(answers, finance);
  const data = { name: "TEST", surname: "Audit", email: "test@example.invalid", phone: "TEST — aucun téléphone", consent: "on", website: "" };
  const objectives = describeAuditObjectives(answers.objective, auditCopy[locale].questions.find(question => question.key === "objective").options);
  return build(answers, finance, result, locale, auditCopy[locale], data, portfolioCopy, objectives, calculateAuditDistribution(answers.distribution, finance), months);
}
