import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../lib/audit-session.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } });
let sequence = 0;
const freshSession = () => import(`data:text/javascript;base64,${Buffer.from(`${outputText}\n// instance ${sequence++}`).toString("base64")}`);
const audit = {
  version: 2, name: "Test", locale: "fr", answers: { objective: ["time", "care"] }, finance: { propertyCount: 16 },
  result: { calculationVersion: "declared-rate-plus-20-v6", portfolioCountConfirmed: true, projectedGross: 800000, perProperty: { projectedGross: 50000 } },
  receipt: { reference: "audit-42", channels: ["inbox"], leadId: 42 },
};
function browser(t, blocked = false) {
  const previous = globalThis.window;
  const values = new Map();
  const win = new EventTarget();
  win.sessionStorage = {
    getItem: key => { if (blocked) throw new Error("Storage blocked"); return values.get(key) ?? null; },
    setItem: (key, value) => { if (blocked) throw new Error("Storage blocked"); values.set(key, value); },
  };
  globalThis.window = win;
  t.after(() => { if (previous === undefined) delete globalThis.window; else globalThis.window = previous; });
  return values;
}

test("contact submission requires an actual internal delivery receipt", async () => {
  const { isConfirmedAuditDelivery } = await freshSession();
  assert.equal(isConfirmedAuditDelivery({ ok: true, ...audit.receipt }), true);
  for (const receipt of [null, {}, { ok: true }, { ok: true, reference: "filtered", channels: ["spam-filter"] }, { ok: false, ...audit.receipt }]) {
    assert.equal(isConfirmedAuditDelivery(receipt), false);
  }
});

test("the report handoff preserves exactly the personal results and reloads them", async t => {
  browser(t);
  const session = await freshSession();
  assert.equal(session.getAuditSession(), null);
  let updates = 0;
  const unsubscribe = session.subscribeAuditSession(() => updates++);
  session.saveAuditSession(audit);
  assert.equal(session.getAuditSession(), audit);
  assert.equal(updates, 1);
  unsubscribe();
  const reloaded = await freshSession();
  assert.deepEqual(reloaded.getAuditSession(), audit);
  assert.equal(reloaded.getAuditSession(), reloaded.getAuditSession(), "snapshot is stable");
});

test("blocked browser storage does not turn a delivered lead into a failed submission", async t => {
  browser(t, true);
  const session = await freshSession();
  session.saveAuditSession(audit);
  assert.equal(session.getAuditSession(), audit);
});

test("missing, corrupt or legacy sessions never display made-up sample figures", async t => {
  const values = browser(t);
  for (const value of [null, "{broken", JSON.stringify({ result: { projectedGross: 42000 } }), JSON.stringify({ ...audit, result: { ...audit.result, calculationVersion: "declared-rate-v3" } }), JSON.stringify({ ...audit, receipt: { reference: "filtered", channels: ["spam-filter"] } })]) {
    values.clear();
    if (value !== null) values.set("aurevia-audit", value);
    assert.equal((await freshSession()).getAuditSession(), null);
  }
});

test("the previous uncapped report cannot be reloaded as a +20% report", async t => {
  const values = browser(t);
  values.set("aurevia-audit", JSON.stringify({ ...audit, result: { ...audit.result, calculationVersion: "property-distribution-v5" } }));
  assert.equal((await freshSession()).getAuditSession(), null);
});
