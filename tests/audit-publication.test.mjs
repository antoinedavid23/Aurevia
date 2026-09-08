import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("advertising audit routes carry a noindex HTTP header", async () => {
  const source = await read("next.config.ts");
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
  const { default: config } = await import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
  const headers = await config.headers();
  assert.deepEqual(headers.filter(rule => rule.source === "/audit/:path*"), [{ source: "/audit/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] }]);
  assert.ok(headers.find(rule => rule.source === "/administration/:path*").headers.some(header => header.key === "Cache-Control" && header.value.includes("no-store")));
});

test("the audit stays outside the public navigation and sitemap", async () => {
  const [sitemap, home, shell] = await Promise.all([read("public/sitemap.xml"), read("app/page.tsx"), read("components/SiteShell.tsx")]);
  assert.doesNotMatch(sitemap, /\/audit(?:[\/<])/i);
  assert.doesNotMatch(home, /href\s*=\s*["']\/audit/);
  assert.doesNotMatch(shell, /href\s*=\s*["']\/audit/);
  for (const path of ["app/audit/page.tsx", "app/audit/grazie/page.tsx", "app/audit/appuntamento/page.tsx"]) {
    assert.match(await read(path), /robots\s*:\s*\{\s*index\s*:\s*false\s*,\s*follow\s*:\s*false/);
  }
});
