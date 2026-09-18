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
  assert.ok(page.indexOf("</header>") < page.indexOf("<nav className={styles.nav}"));
});

test("strategy page remains private", () => {
  assert.match(page, /const user = await getAdminUser\(\)/);
  assert.match(page, /if \(!user\) redirect\("\/connexion"\)/);
});

test("strategy header fits narrow screens without cutting off title or back link", () => {
  const mobile = styles.slice(styles.indexOf("@media(max-width:720px)"));
  assert.match(mobile, /\.heroTop\{[^}]*flex-wrap:wrap/);
  assert.match(mobile, /\.heroGrid\{grid-template-columns:minmax\(0,1fr\)/);
  assert.match(mobile, /\.hero h1\{font-size:clamp\(2\.1rem,10vw,2\.65rem\);overflow-wrap:anywhere/);
});
