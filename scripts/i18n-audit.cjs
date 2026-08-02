/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const files = [];
for (const root of ["app", "components", "data"]) {
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(tsx|ts)$/.test(entry.name) && !file.includes(`${path.sep}api${path.sep}`) && !file.includes(`${path.sep}administration${path.sep}`) && !/Admin/.test(entry.name) && !["LocaleController.tsx","HeroVideo.tsx","layout.tsx"].includes(entry.name)) files.push(file);
  });
  walk(root);
}

const normalize=(value)=>value.replaceAll("&amp;","&").replaceAll("&nbsp;"," ").replace(/\s+/g," ").trim().toLocaleLowerCase("fr");
const dictionaryKeys = new Set();
for (const name of fs.readdirSync("lib").filter((file) => /^i18n.*\.ts$/.test(file))) {
  const source = fs.readFileSync(path.join("lib", name), "utf8");
  for (const match of source.matchAll(/"((?:[^"\\]|\\.)*)"\s*:/g)) dictionaryKeys.add(normalize(JSON.parse(`"${match[1]}"`)));
}

const missing = [];
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const seen = new Set();
  const add = (raw, position) => {
    const value = raw.trim();
    if (value.length < 3 || !/[A-Za-zÀ-ÿ]/.test(value) || dictionaryKeys.has(normalize(value)) || /^(https?:|\/|[a-z0-9_.@-]+$|\(max-width:)/i.test(value) || /^(use client|application\/|image\/|AUREVIA|Vercel Inc\.|Resend, Inc\.|Garante per la protezione|Villa |Casa |Attique |Santa Margherita)/.test(value) || value.includes("{") || value.includes("}")) return;
    if (!seen.has(value)) {
      seen.add(value);
      missing.push([file, ast.getLineAndCharacterOfPosition(position).line + 1, value]);
    }
  };
  const visit = (node) => {
    if (ts.isJsxText(node)) add(node.text, node.pos);
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const parent = node.parent;
      if (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) return;
      if (ts.isJsxAttribute(parent)) {
        const attribute = parent.name.getText(ast);
        if (["placeholder", "aria-label", "title", "alt"].includes(attribute)) add(node.text, node.pos);
      } else add(node.text, node.pos);
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
}

missing.sort((a, b) => a[0].localeCompare(b[0]) || a[1] - b[1]);
for (const item of missing) console.log(item.join("\t"));
console.error(`MISSING ${missing.length} / DICTIONARY ${dictionaryKeys.size}`);
process.exitCode = missing.length ? 1 : 0;
