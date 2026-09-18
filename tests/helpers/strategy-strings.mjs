import { readFileSync } from "node:fs";
import ts from "typescript";

const decode = value => value.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
export function strategyStrings() {
  const source = ts.createSourceFile("page.tsx", readFileSync(new URL("../../app/administration/strategia/page.tsx", import.meta.url), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const values = new Set();
  const add = value => { const text = decode(value); if (/[\p{L}]/u.test(text) && !/^(https?:|\/)/.test(text)) values.add(text); };
  const dataArrays = new Set(["competitors", "offers", "angles", "ads", "opportunities", "sources"]);
  function visit(node, data = false) {
    const isData = data || (ts.isVariableDeclaration(node) && dataArrays.has(node.name.getText(source))) || ts.isArrayLiteralExpression(node);
    if (ts.isJsxText(node)) add(node.text);
    if (isData && ts.isStringLiteral(node)) add(node.text);
    if (ts.isJsxAttribute(node) && ["title", "aria-label"].includes(node.name.getText(source)) && node.initializer && ts.isStringLiteral(node.initializer)) add(node.initializer.text);
    if (ts.isConditionalExpression(node) && !(ts.isJsxExpression(node.parent) && ts.isJsxAttribute(node.parent.parent))) {
      for (const branch of [node.whenTrue, node.whenFalse]) if (ts.isStringLiteral(branch)) add(branch.text);
    }
    ts.forEachChild(node, child => visit(child, isData));
  }
  visit(source);
  return [...values];
}

if (process.argv[1]?.endsWith("strategy-strings.mjs")) {
  const start = Number(process.argv[2] || 0);
  const count = Number(process.argv[3] || 100);
  const strings = strategyStrings();
  console.log(`Total: ${strings.length}`);
  strings.slice(start, start + count).forEach((value, i) => console.log(`${start + i}: ${value}`));
}
