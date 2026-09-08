import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../lib/audit-navigation.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
});
const { nextAuditScreen } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("one action advances exactly one question after a free-text answer", () => {
  assert.equal(nextAuditScreen(5, 5, 1, 11), 6);
  assert.equal(nextAuditScreen(7, 7, 1, 11), 8);
});

test("a repeated submission from the previous question cannot skip a step", () => {
  const first = nextAuditScreen(7, 7, 1, 11);
  assert.equal(nextAuditScreen(first, 7, 1, 11), 8);
});

test("a fresh action on the next question works immediately without a timeout", () => {
  const first = nextAuditScreen(7, 7, 1, 11);
  assert.equal(nextAuditScreen(first, 8, 1, 11), 9);
  assert.equal(nextAuditScreen(first, 8, -1, 11), 7);
});

test("late events from unmounted fields do not change the active screen", () => {
  assert.equal(nextAuditScreen(8, 5, 1, 11), 8);
  assert.equal(nextAuditScreen(7, 8, -1, 11), 7);
});

test("navigation stays within the intro and final contact step", () => {
  assert.equal(nextAuditScreen(-2, -2, -1, 11), -2);
  assert.equal(nextAuditScreen(-2, -2, 1, 11), -1);
  assert.equal(nextAuditScreen(11, 11, 1, 11), 11);
});
