import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../lib/lead-delivery.ts", import.meta.url), "utf8");
const payload = {
  name: "Test", surname: "Audit", email: "prospect@example.invalid", phone: "+39 000 000 0000", message: "Test only", consent: true,
  address: "Adresse de test, Nervi", propertyCount: 16,
  auditReport: {
    reportVersion: "AUDIT-TEST", generatedAt: "2026-09-08T10:00:00.000Z", language: "fr",
    qualification: { objectives: [{ code: "time", label: "Plus de temps libre" }, { code: "care", label: "Prendre soin du bien" }], ownerConstraint: "Disponibilité limitée en été" },
    locationModel: { neighborhoodName: "Nervi" },
    evidenceAndLimits: { marketValidated: false, notes: "Comparables à valider" },
    distributionModel: { channels: [{ channel: "Airbnb", share: 60, feeRate: 8 }, { channel: "Booking", share: 40, feeRate: 15 }] },
    portfolioProjection: { exactPropertyCount: 16, projectedGrossRevenue: 800000, projectedOwnerNet: 536000 },
    perProperty: { projectedGross: 50000, projectedNet: 33500 },
    declaredProperty: { bedrooms: 3, amenities: { poolType: "private" } },
    declaredPerformance: { hasRentalHistory: true, averageNightlyRate: 160, occupancyRate: 40, currentManagementFeeRate: 0 },
    aureviaCentralModel: { targetAverageNightlyRate: 192, targetOccupancyRate: 70, platformFeeRate: 8, aureviaManagementFeeRate: 25 },
    internalScores: { overallFit: 84 },
    confidentialMonthlyPlan: { basis: "Répartition indicative", months: Array.from({ length: 12 }, (_, index) => ({ month: index === 0 ? "Janvier" : index === 11 ? "Décembre" : `Mois ${index + 1}`, recommendedNightlyRate: 300 + index })) },
    callPreparation: { recommendedOffer: "Solution Privilège", pointsToVerifyDuringCall: ["Vérifier les contraintes de copropriété"] },
  },
};
let sequence = 0;
const dataUrl = (text) => `data:text/javascript;base64,${Buffer.from(text).toString("base64")}`;
async function setup(t, { inboxFails = false, email = "absent" } = {}) {
  const old = { key: process.env.RESEND_API_KEY, recipient: process.env.CONTACT_RECIPIENT, from: process.env.CONTACT_FROM };
  if (email === "absent") delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = "test-key-not-a-real-credential";
  process.env.CONTACT_RECIPIENT = "team@example.invalid";
  process.env.CONTACT_FROM = "AUREVIA <test@example.invalid>";
  t.after(() => {
    for (const [key, value] of Object.entries({ RESEND_API_KEY: old.key, CONTACT_RECIPIENT: old.recipient, CONTACT_FROM: old.from })) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  });
  const storageUrl = dataUrl(`export const received = []; export async function storeLead(kind, payload) { received.push({kind, payload}); ${inboxFails ? 'throw new Error("Test inbox failure");' : 'return { id: 42 };'} } // ${sequence++}`);
  const storage = await import(storageUrl);
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return email === "success" ? new Response(JSON.stringify({ id: "email-test" }), { status: 200 })
      : email === "unconfirmed" ? new Response("{}", { status: 200 })
      : new Response("Test failure", { status: 503 });
  });
  const errors = t.mock.method(console, "error", () => {});
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } });
  const delivery = await import(dataUrl(outputText.replaceAll('"@/lib/lead-storage"', JSON.stringify(storageUrl))));
  return { ...delivery, storage, calls, errors };
}

test("audit is received in the internal inbox even without a mail credential", async t => {
  const { deliverLead, storage, calls, errors } = await setup(t);
  const result = await deliverLead("valuation", payload);
  assert.deepEqual(result.channels, ["inbox"]);
  assert.equal(result.leadId, 42);
  assert.deepEqual(storage.received[0].payload.auditReport, payload.auditReport);
  assert.equal(calls.length, 0);
  assert.match(errors.mock.calls[0].arguments[0], /RESEND_API_KEY is missing/);
});

test("team receives the full report; visitor email is reply-to only, never recipient", async t => {
  const { deliverLead, calls } = await setup(t, { email: "success" });
  const result = await deliverLead("valuation", payload);
  assert.deepEqual(result.channels, ["inbox", "email"]);
  assert.deepEqual(calls[0].body.to, ["contatto@aurevia-genova.com"]);
  assert.equal(calls[0].body.subject, "Audit complet AUREVIA — Test Audit");
  assert.equal(calls[0].body.reply_to, payload.email);
  assert.equal(calls[0].body.cc, undefined);
  assert.equal(calls[0].body.bcc, undefined);
  assert.match(calls[0].body.html, /800000/);
  assert.match(calls[0].body.html, /50000/);
  assert.match(calls[0].body.html, /Janvier/);
  assert.match(calls[0].body.html, /Plus de temps libre/);
  assert.match(calls[0].body.html, /Prendre soin du bien/);
  for (const field of [payload.name, payload.surname, payload.email, payload.phone, payload.address]) {
    assert.ok(calls[0].body.html.includes(field));
    assert.ok(calls[0].body.text.includes(field));
  }
  // Every leaf of the full report is retained, including all 12 months,
  // assumptions, rates, zero fees, private notes and financial totals.
  const leaves = value => value && typeof value === "object" ? Object.values(value).flatMap(leaves) : [value];
  for (const value of leaves(payload.auditReport)) {
    const expected = typeof value === "boolean" ? value ? "Oui" : "Non" : String(value);
    assert.ok(calls[0].body.html.includes(expected), `HTML missing ${expected}`);
    assert.ok(calls[0].body.text.includes(expected), `Text missing ${expected}`);
  }
  assert.ok(calls[0].body.html.indexOf(payload.phone) < calls[0].body.html.indexOf("Dossier interne complet"));
  assert.doesNotMatch(calls[0].body.html, /filter:\s*blur|text-security|consent/);
});

test("ordinary forms keep their configured recipient; audit routing cannot be changed by the visitor", async t => {
  const { deliverLead, calls } = await setup(t, { email: "success" });
  await deliverLead("valuation", { ...payload, recipient: "unwanted@example.invalid", to: "unwanted@example.invalid" });
  assert.deepEqual(calls[0].body.to, ["contatto@aurevia-genova.com"]);
  const { auditReport, ...ordinary } = payload;
  await deliverLead("contact", ordinary);
  assert.deepEqual(calls[1].body.to, ["team@example.invalid"]);
  assert.equal(calls[1].body.subject, "Nouveau contact — Test Audit");
  await deliverLead("valuation", ordinary);
  assert.deepEqual(calls[2].body.to, ["team@example.invalid"]);
  assert.equal(calls[2].body.subject, "Nouvelle évaluation — Test Audit");
});

test("untrusted answers are escaped and unknown figures are not shown as zero", async t => {
  const { deliverLead, calls } = await setup(t, { email: "success" });
  await deliverLead("valuation", { ...payload, name: "Test\r\nAudit", message: '<script>alert("test")</script>',
    auditReport: { callPreparation: { note: '<img src=x onerror="test">', currentNet: null, managementFee: 0, checks: [["A", "B"]] } } });
  const mail = calls[0].body;
  assert.doesNotMatch(mail.subject, /[\r\n]/);
  assert.doesNotMatch(mail.html, /<script|<img/);
  assert.match(mail.html, /&lt;script&gt;/);
  assert.match(mail.html, /&lt;img/);
  assert.match(mail.html, /Current Net :<\/b> Non renseigné \/ à confirmer/);
  assert.match(mail.text, /Current Net : Non renseigné \/ à confirmer/);
  assert.match(mail.text, /Management Fee : 0/);
  assert.ok(mail.text.includes('<img src=x onerror="test">'));
});

test("a provider response without a message ID is never counted as email delivery", async t => {
  const { deliverLead, calls } = await setup(t, { email: "unconfirmed" });
  assert.deepEqual((await deliverLead("valuation", payload)).channels, ["inbox"]);
  assert.equal(calls.length, 1);
});

test("failed email does not block an audit already saved in the inbox", async t => {
  const { deliverLead } = await setup(t, { email: "failed" });
  assert.deepEqual((await deliverLead("valuation", payload)).channels, ["inbox"]);
});

test("confirmed team email is retained when inbox storage fails", async t => {
  const { deliverLead } = await setup(t, { inboxFails: true, email: "success" });
  assert.deepEqual((await deliverLead("valuation", payload)).channels, ["email"]);
});

test("no receipt means failure, never a false confirmation", async t => {
  const { deliverLead } = await setup(t, { inboxFails: true });
  await assert.rejects(deliverLead("valuation", payload));
});

test("spam-filtered data is not delivered", async t => {
  const { deliverLead, storage, calls } = await setup(t, { email: "success" });
  assert.deepEqual((await deliverLead("valuation", { ...payload, website: "bot" })).channels, ["spam-filter"]);
  assert.equal(storage.received.length, 0);
  assert.equal(calls.length, 0);
});

test("valuation validation preserves the complete dossier and client contact details", async () => {
  const validationSource = await readFile(new URL("../lib/validation.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(validationSource, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } });
  const { leadSchema } = await import(dataUrl(outputText.replaceAll('"zod"', JSON.stringify(import.meta.resolve("zod")))));
  const parsed = leadSchema.parse(payload);
  assert.deepEqual(parsed.auditReport, payload.auditReport);
  assert.equal(parsed.phone, payload.phone);
  assert.equal(parsed.email, payload.email);
  assert.equal(parsed.propertyCount, 16);
});
