import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const controller = await readFile(new URL("../components/LocaleController.tsx", import.meta.url), "utf8");
const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

test("fresh visits always default to Italian, never device or remembered language", () => {
  assert.match(controller, /const DEFAULT_LOCALE: Locale = "it"/);
  assert.doesNotMatch(controller, /navigator\.(language|languages)|localStorage\.(getItem|setItem)|document\.cookie/);
  assert.match(controller, /new URLSearchParams\(window.location.search\).get\("lang"\)/);
  assert.match(controller, /locales.some\(\(code\) => code === requested\)/);
  assert.match(controller, /updateLocale\(next\)/);
});

test("server HTML declares Italian and discourages automatic browser translation", () => {
  assert.match(layout, /<html lang="it" translate="no"/);
  assert.match(layout, /google: "notranslate"/);
});
