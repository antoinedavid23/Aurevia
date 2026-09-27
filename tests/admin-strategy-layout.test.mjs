import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const styles = await readFile(new URL("../app/administration/strategia/strategia.module.css", import.meta.url), "utf8");
const page = await readFile(new URL("../app/administration/strategia/page.tsx", import.meta.url), "utf8");

test("strategy document header overrides the fixed global navigation layout", () => {
  const hero = styles.match(/\.hero\{([^}]+)\}/)?.[1];
  assert.ok(hero);
  for (const declaration of ["position:relative", "inset:auto", "z-index:auto", "display:block", "height:auto", "backdrop-filter:none"]) {
    assert.ok(hero.split(";").includes(declaration), `missing ${declaration}`);
  }
  assert.match(page, /<header className=\{styles\.hero\}>/);
  assert.ok(page.indexOf("</header>") < page.indexOf("<StrategyNavigation"));
});

test("strategy page remains private", () => {
  assert.match(page, /const user = await getAdminUser\(\)/);
  assert.match(page, /if \(!user\) redirect\("\/connexion"\)/);
});

test("strategy header fits narrow screens without cutting off title or back link", () => {
  const mobile = styles.slice(styles.lastIndexOf("@media(max-width:720px)")).replace(/\s+/g, "");
  assert.match(mobile, /\.heroTop\{[^}]*flex-wrap:wrap/);
  assert.match(mobile, /\.heroGrid\{grid-template-columns:minmax\(0,1fr\)/);
  assert.match(mobile, /\.heroh1\{font-size:clamp\(2rem,8vw,3rem\);line-height:1\.15;overflow-wrap:anywhere/);
});

test("mobile chapters, tables and sliders have dedicated touch layouts", async () => {
  const nav = await readFile(new URL("../components/StrategyNavigation.tsx", import.meta.url), "utf8");
  assert.match(nav, /<label htmlFor=\{id\}/);
  assert.match(nav, /<select id=\{id\}/);
  assert.match(nav, /<noscript>/);
  assert.match(styles, /min-height:46px/);
  assert.match(styles, /height:44px; min-height:44px/);
  assert.match(styles, /\.table td::before \{ content:attr\(data-label\)/);
  assert.match(styles, /\.sectionHeader \{ display:block/);
  assert.match(styles, /prefers-reduced-motion:reduce/);
  assert.equal((page.match(/<StrategyTable>/g) || []).length, 3);
});
