import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import { typescriptModuleUrl } from "./helpers/import-typescript.mjs";
import { auditPayload } from "./helpers/audit-payload.mjs";

const { readAuditSnapshot } = await import(await typescriptModuleUrl("lib/audit-snapshot.ts"));
const { csvCell, leadStatuses } = await import(await typescriptModuleUrl("lib/lead-crm.ts"));
const dataUrl = value => `data:text/javascript;base64,${Buffer.from(value).toString("base64")}`;

for (const locale of ["it", "fr", "en"]) {
  test(`${locale}: complete snapshot retains the exact client financial result, no recalculation`, () => {
    const payload = auditPayload(locale);
    const before = structuredClone(payload.auditSnapshot);
    const stored = readAuditSnapshot(payload.auditSnapshot, payload.name, 42);
    assert.ok(stored, "the real client snapshot is displayable");
    assert.deepEqual(stored.result, before.result);
    assert.deepEqual(stored.finance, before.finance);
    assert.deepEqual(stored.answers, before.answers);
    assert.deepEqual(payload.auditSnapshot, before);
    assert.equal(stored.result.projectedGross, 344064);
    assert.equal(stored.result.monthlyPlan.reduce((total, row) => total + row.projectedGrossPortfolio, 0), stored.result.projectedGross);
    assert.equal(stored.locale, locale);
  });
}

test("legacy, damaged and incompatible snapshots never produce a made-up client report", () => {
  assert.equal(readAuditSnapshot(null, "Test", 42), null);
  assert.equal(readAuditSnapshot({ version: 1 }, "Test", 42), null);
  for (const damage of [
    s => { s.result.projectedGross = Infinity; },
    s => { s.result.monthlyPlan = []; },
    s => { s.result.monthlyPlan[0].monthIndex = 1; },
    s => { s.result.calculationVersion = "unknown-model"; },
    s => { s.result.perProperty = {}; },
    s => { s.result.location.label = {}; },
  ]) {
    const snapshot = structuredClone(auditPayload("fr").auditSnapshot); damage(snapshot);
    assert.equal(readAuditSnapshot(snapshot, "Test", 42), null);
  }
});

test("CSV contact export escapes formulas and preserves normal values", () => {
  assert.equal(csvCell('=HYPERLINK("x")'), '"\'=HYPERLINK(""x"")"');
  assert.equal(csvCell("+3900000000"), '"\'+3900000000"');
  assert.equal(csvCell("Jean"), '"Jean"');
  assert.equal(csvCell(null), '""');
  assert.ok(leadStatuses.includes("contacted") && leadStatuses.includes("appointment") && leadStatuses.includes("closed"));
});

test("admin sessions fail closed without a private signing secret, and reject tampering", async t => {
  const keys = ["ADMIN_AUTH_SECRET", "ADMIN_USERNAME"];
  const previous = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  t.after(() => keys.forEach(key => previous[key] === undefined ? delete process.env[key] : process.env[key] = previous[key]));
  const cookiesUrl = dataUrl('let value; export const set = v => { value = v; }; export const cookies = async () => ({ get: () => value ? {value} : undefined });');
  const cookie = await import(cookiesUrl);
  const source = await readFile(new URL("../lib/internal-auth.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText.replaceAll('"next/headers"', JSON.stringify(cookiesUrl));
  const auth = await import(dataUrl(compiled));
  delete process.env.ADMIN_AUTH_SECRET;
  assert.equal(await auth.getInternalAdminUser(), null);
  await assert.rejects(auth.createAdminSessionValue("Aurevia"), /secret privé/);
  process.env.ADMIN_AUTH_SECRET = "test-only-private-secret-never-a-production-value";
  process.env.ADMIN_USERNAME = "Aurevia";
  const value = await auth.createAdminSessionValue("Aurevia");
  cookie.set(value);
  assert.equal((await auth.getInternalAdminUser()).displayName, "Aurevia");
  cookie.set(value + ".extra"); assert.equal(await auth.getInternalAdminUser(), null);
  cookie.set(value.slice(0, -3) + "xyz"); assert.equal(await auth.getInternalAdminUser(), null);
  cookie.set(await auth.createAdminSessionValue("someone-else")); assert.equal(await auth.getInternalAdminUser(), null);
});

test("CRM API checks authentication and rejects cross-site or malformed updates before storage", async () => {
  const authUrl = dataUrl('let user = null; export const setUser = value => user = value; export const getAdminUser = async () => user;');
  const storageUrl = dataUrl('export const calls = []; export const listLeads = async filters => { calls.push({filters}); return {items:[],total:0}; }; export const getLead = async id => { calls.push({detail:id}); return id === 42 ? {id,details:{auditReport:{complete:true}}} : null; }; export const updateLeadStatus = async (id,status) => { calls.push({id,status}); return id === 42 ? {id,status} : null; };');
  const auth = await import(authUrl); const storage = await import(storageUrl);
  const source = await readFile(new URL("../app/api/leads/route.ts", import.meta.url), "utf8");
  let compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
  for (const [key, value] of Object.entries({ "next/server": dataUrl('export const NextResponse = {json: (body, options) => Response.json(body, options)};'), "@/lib/admin": authUrl, "@/lib/lead-storage": storageUrl, "@/lib/lead-crm": await typescriptModuleUrl("lib/lead-crm.ts") })) compiled = compiled.replaceAll(JSON.stringify(key), JSON.stringify(value));
  const api = await import(dataUrl(compiled));
  const request = (body, origin = "https://aurevia-genova.com") => new Request("https://aurevia-genova.com/api/leads", {method:"PATCH", headers:{"content-type":"application/json",origin},body:typeof body === "string" ? body : JSON.stringify(body)});
  assert.equal((await api.GET()).status, 403);
  assert.equal((await api.PATCH(request({id:42,status:"contacted"}))).status, 403);
  assert.equal(storage.calls.length, 0);
  auth.setUser({ email: "test@example.invalid" });
  assert.equal((await api.PATCH(request({id:42,status:"contacted"}, "https://unrelated.example"))).status, 403);
  for (const body of ["{broken", {id:-1,status:"contacted"}, {id:1.5,status:"contacted"}, {id:42,status:"invented"}]) assert.equal((await api.PATCH(request(body))).status, 400);
  assert.equal(storage.calls.length, 0);
  const result = await api.PATCH(request({id:42,status:"appointment"}));
  assert.equal(result.status, 200); assert.match(result.headers.get("cache-control"), /no-store/);
  assert.deepEqual(await result.json(), {id:42,status:"appointment"});
  assert.equal((await api.PATCH(request({id:99,status:"closed"}))).status, 404);
  for (const suffix of ["?page=0", "?page=1.5", "?page=100001", "?id=oops", "?id=-1", "?kind=invalid", "?status=invalid", `?q=${"a".repeat(121)}`])
    assert.equal((await api.GET(new Request(`https://aurevia-genova.com/api/leads${suffix}`))).status, 400);
  const list = await api.GET(new Request("https://aurevia-genova.com/api/leads?page=2&kind=audit"));
  assert.equal(list.status, 200); assert.match(list.headers.get("cache-control"), /no-store/);
  assert.equal((await api.GET(new Request("https://aurevia-genova.com/api/leads?id=42"))).status, 200);
  assert.equal((await api.GET(new Request("https://aurevia-genova.com/api/leads?id=99"))).status, 404);
});
