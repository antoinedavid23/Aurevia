import { readFile } from "node:fs/promises";
import ts from "typescript";

const cache = new Map();
const root = new URL("../../", import.meta.url);
export async function typescriptModuleUrl(relative) {
  const url = new URL(relative, root);
  if (cache.has(url.href)) return cache.get(url.href);
  let output = ts.transpileModule(await readFile(url, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  for (const [, specifier] of output.matchAll(/from\s+"([^"]+)"/g)) {
    const resolved = specifier.startsWith("@/") ? new URL(`${specifier.slice(2)}.ts`, root)
      : specifier.startsWith(".") ? new URL(`${specifier}.ts`, url) : null;
    if (resolved) output = output.replaceAll(JSON.stringify(specifier), JSON.stringify(await typescriptModuleUrl(resolved)));
  }
  const compiled = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  cache.set(url.href, compiled);
  return compiled;
}
