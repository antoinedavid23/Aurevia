import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("the runtime locale is intentionally fixed to reviewed French copy", async () => {
  const locale = await source("components/LocaleController.tsx");
  assert.match(locale, /locale:\s*"fr"/);
});

test("key public files no longer expose the Aurevia brand", async () => {
  const files = [
    "app/page.tsx",
    "app/layout.tsx",
    "components/SiteShell.tsx",
    "app/servizi/page.tsx",
    "app/esperienze/page.tsx",
    "app/proprietari/page.tsx",
    "app/chi-siamo/page.tsx",
    "app/contatti/page.tsx",
  ];
  for (const file of files) {
    const content = await source(file);
    assert.doesNotMatch(content, /AUREVIA/);
  }
});
