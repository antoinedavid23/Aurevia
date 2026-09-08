import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import ts from "typescript";
import { typescriptModuleUrl } from "./helpers/import-typescript.mjs";
import { auditPayload } from "./helpers/audit-payload.mjs";

const url = value => `data:text/javascript;base64,${Buffer.from(value).toString("base64")}`;
const adapterUrl = url('let db; export const setDatabase = value => db = value; export const getCrmDatabase = async () => db;');
const adapter = await import(adapterUrl);
const source = await readFile(new URL("../lib/lead-storage.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText
  .replaceAll('"./crm-database"', JSON.stringify(adapterUrl))
  .replaceAll('"./lead-crm"', JSON.stringify(await typescriptModuleUrl("lib/lead-crm.ts")));
const storage = await import(url(compiled));
const filters = { page: 1, query: "", kind: "all", status: "all" };

test("durable contact flow: create, paginated summaries, exact audit, status and re-read", async () => {
  const db = new DatabaseSync(":memory:");
  try {
    db.exec(`CREATE TABLE leads (id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT, name TEXT, surname TEXT, email TEXT,
      phone TEXT, city TEXT, property_type TEXT, subject TEXT, message TEXT, details TEXT, status TEXT, created_at INTEGER, updated_at INTEGER)`);
    adapter.setDatabase({ dialect: "sqlite", query: async (sql, values = []) => db.prepare(sql).all(...values) });
    const payload = auditPayload("fr");
    const { id } = await storage.storeLead("valuation", payload);
    for (let i = 0; i < 27; i++) await storage.storeLead("contact", { name: `Contact ${i}`, surname: "TEST", email: "test@example.invalid", message: "Test local uniquement" });
    await storage.updateLeadStatus(28, "archived");
    const page1 = await storage.listLeads(filters);
    const page2 = await storage.listLeads({ ...filters, page: 2 });
    assert.equal(page1.total, 28); assert.equal(page1.items.length, 25); assert.equal(page2.items.length, 3);
    assert.equal(new Set([...page1.items, ...page2.items].map(row => row.id)).size, 28);
    assert.deepEqual(page1.counts, { total: 28, new: 27, audits: 1, appointments: 0 });
    for (const row of [...page1.items, ...page2.items]) { assert.ok(!("details" in row)); assert.ok(!("message" in row)); }
    const audit = await storage.getLead(id);
    assert.deepEqual(audit.details, payload);
    assert.equal((await storage.listLeads({ ...filters, kind: "audit" })).total, 1);
    assert.equal((await storage.listLeads({ ...filters, kind: "contact" })).total, 27);
    assert.equal((await storage.listLeads({ ...filters, status: "active" })).total, 27);
    assert.equal((await storage.listLeads({ ...filters, query: "Contact 26" })).total, 1);
    for (const query of ["%", "_", "' OR 1=1 --"]) assert.equal((await storage.listLeads({ ...filters, query })).total, 0);
    assert.deepEqual(await storage.updateLeadStatus(id, "appointment"), { id, status: "appointment" });
    assert.equal((await storage.getLead(id)).status, "appointment");
    // Reimporting the module does not reset data or rebuild the financial model.
    const reloaded = await import(url(`${compiled}\n// second module instance`));
    assert.deepEqual((await reloaded.getLead(id)).details.auditSnapshot, payload.auditSnapshot);
    assert.equal(await storage.getLead(999), null);
    assert.equal(await storage.updateLeadStatus(999, "closed"), null);
  } finally { db.close(); }
});

test("Postgres path binds user inputs and never sends full reports in inbox responses", async () => {
  const calls = [];
  adapter.setDatabase({ dialect: "postgres", query: async (sql, values = []) => {
    calls.push({sql,values});
    if (sql.includes("RETURNING id")) return [{id: 42, status: "contacted"}];
    if (sql.includes("COUNT(*)")) return [{total: "1", new: "1", audits: "1", appointments: "0"}];
    return [{id: 42, createdAt: "1800000000000", isAudit: 1, propertyCount: "7"}];
  } });
  const page = await storage.listLeads({ ...filters, query: "O'Neil", kind: "audit" });
  assert.equal(page.items[0].propertyCount, 7); assert.equal(page.items[0].isAudit, true);
  assert.equal(page.counts.total, 1);
  assert.ok(calls.every(call => !call.sql.includes("O'Neil")));
  assert.ok(calls[0].values.includes("%o'neil%"));
  assert.match(calls[0].sql, /is_audit/); assert.match(calls[0].sql, /LIMIT \? OFFSET \?/);
  assert.doesNotMatch(calls[0].sql, /SELECT \*|message, details/);
  assert.deepEqual(await storage.storeLead("contact", {name:"TEST",surname:"TEST",email:"TEST@EXAMPLE.INVALID",message:"Local only"}), {id:42});
  assert.equal(calls.at(-1).values[3], "test@example.invalid");
});

test("inbox does not poll and fetches a full audit only by selected id", async () => {
  const source = await readFile(new URL("../components/AdminLeadInbox.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /setInterval/);
  assert.match(source, /api\/leads\?id=\$\{selectedId\}/);
  assert.match(source, /Exporter cette page/);
  const ddl = await readFile(new URL("../db/neon/001_crm.sql", import.meta.url), "utf8");
  assert.match(ddl, /REVOKE ALL ON TABLE leads FROM PUBLIC/);
  assert.doesNotMatch(ddl, /DROP TABLE|TRUNCATE|INSERT INTO/i);
});
