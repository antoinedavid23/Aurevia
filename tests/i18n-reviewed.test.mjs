import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function loadReviewedMessages() {
  const source = await readFile(new URL("../lib/i18n-reviewed.ts", import.meta.url), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return (await import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`)).reviewedMessages;
}

async function loadAuditFixMessages() {
  const source = await readFile(new URL("../lib/i18n-audit-fixes.ts", import.meta.url), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  return (await import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`)).auditFixMessages;
}

test("reviewed public translations cover every supported market", async () => {
  const messages = await loadReviewedMessages();
  const locales = ["it", "en", "es", "ru", "zh"];
  assert.ok(Object.keys(messages).length >= 100);

  for (const [source, translations] of Object.entries(messages)) {
    for (const locale of locales) {
      assert.equal(typeof translations[locale], "string", `${source}: missing ${locale}`);
      assert.ok(translations[locale].trim(), `${source}: empty ${locale}`);
    }
  }
});

test("known machine-translation contresens cannot return", async () => {
  const messages = await loadReviewedMessages();
  const all = Object.values(messages);
  assert.doesNotMatch(all.map(({ it }) => it).join("\n"), /\b(passegger[io]|tracciamento)\b/i);
  assert.doesNotMatch(all.map(({ en }) => en).join("\n"), /\b(passenger|invoiced in reality)\b/i);
  assert.doesNotMatch(all.map(({ es }) => es).join("\n"), /\bpasajer[oa]s?\b/i);
});

test("critical homepage and owner promises remain explicitly reviewed", async () => {
  const messages = await loadReviewedMessages();
  for (const source of [
    "Découvrir votre expérience AUREVIA",
    "Collection AUREVIA",
    "Nos biens",
    "Parlons de votre propriété et définissons une gestion adaptée à vos besoins.",
    "Une expérience pensée comme un véritable service.",
    "J’accepte que mes données soient utilisées afin d’être recontacté au sujet de ma demande.",
  ]) {
    assert.ok(messages[source], `Critical public copy is not reviewed: ${source}`);
  }
});

test("rendered-audit corrections cover every supported market", async () => {
  const messages = await loadAuditFixMessages();
  const locales = ["it", "en", "es", "ru", "zh"];
  assert.ok(Object.keys(messages).length >= 70);
  for (const [source, translations] of Object.entries(messages)) {
    for (const locale of locales) {
      assert.equal(typeof translations[locale], "string", `${source}: missing ${locale}`);
      assert.ok(translations[locale].trim(), `${source}: empty ${locale}`);
    }
  }
});
