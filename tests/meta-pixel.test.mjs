import test from "node:test";
import assert from "node:assert/strict";
import { typescriptModuleUrl } from "./helpers/import-typescript.mjs";

const consent = await import(await typescriptModuleUrl("lib/marketing-consent.ts"));
const moduleUrl = await typescriptModuleUrl("lib/meta-pixel.ts");
const { createMetaTracker, META_PIXEL_ID } = await import(moduleUrl);

test("only a current explicit marketing choice is valid; old acknowledgement is not consent", () => {
  const now = Date.UTC(2026, 8, 15);
  for (const raw of [null, "accepted", "refused", "true", "{}", "broken", JSON.stringify({version:0,choice:"accepted"})]) assert.equal(consent.parseConsent(raw, now), null);
  for (const choice of ["accepted", "refused"]) {
    const record = consent.createConsent(choice, now);
    assert.equal(record.expiresAt, Date.UTC(2027, 2, 15));
    assert.equal(consent.parseConsent(JSON.stringify(record), now).choice, choice);
    assert.equal(consent.parseConsent(JSON.stringify(record), record.expiresAt), null);
    assert.equal(consent.parseConsent(JSON.stringify({...record, savedAt:now+1}), now), null);
  }
});

function harness() {
  let accepted = false, path = "/", installations = 0, revocations = 0;
  const calls = [];
  const tracker = createMetaTracker({allowed:()=>accepted, path:()=>path, install:()=>{installations++;}, send:(...args)=>calls.push(args), revoke:()=>{revocations++;}});
  return {tracker, calls, accept:(value)=>{accepted=value;}, visit:(value)=>{path=value;tracker.sync();}, installations:()=>installations, revocations:()=>revocations};
}

test("no SDK or events before consent; one initialization and one PageView per navigation", () => {
  const h = harness();
  h.tracker.sync(); h.tracker.lead(); h.visit("/audit");
  assert.equal(h.installations(), 0); assert.deepEqual(h.calls, []);
  h.accept(true); h.tracker.sync(); h.tracker.sync();
  assert.equal(h.installations(), 1);
  assert.deepEqual(h.calls, [["consent","grant"],["set","autoConfig",false,META_PIXEL_ID],["init",META_PIXEL_ID],["trackSingle",META_PIXEL_ID,"PageView"]]);
  h.visit("/contatti"); h.visit("/audit");
  assert.equal(h.calls.filter(c=>c[2]==="PageView").length, 3);
});

test("withdrawal stops leads; regrant resumes without replaying past visits or leads", () => {
  const h = harness(); h.accept(true); h.tracker.sync(); h.tracker.lead();
  assert.deepEqual(h.calls.at(-1), ["trackSingle",META_PIXEL_ID,"Lead"]);
  h.accept(false); h.tracker.sync(); const count=h.calls.length;
  h.tracker.lead(); h.visit("/valutazione");
  assert.equal(h.calls.length, count);
  h.accept(true); h.tracker.sync();
  assert.equal(h.installations(),1);
  assert.equal(h.calls.filter(c=>c[2]==="Lead").length,1);
});

test("admin, authentication and API routes stay untracked with existing consent", () => {
  const h = harness(); h.accept(true);
  for (const path of ["/administration", "/%61dministration/strategia", "/connexion", "/connexion/mot-de-passe-oublie", "/api/leads", "/auth/callback", "/_next/data", "/bad%url"]) { h.visit(path); h.tracker.lead(); }
  assert.equal(h.installations(),0); assert.deepEqual(h.calls,[]);
  h.visit("/audit"); const count = h.calls.length;
  h.visit("/administration"); h.tracker.lead();
  assert.equal(h.calls.length,count); assert.ok(h.revocations()>0);
});

test("unavailable SDK cannot make a successful enquiry throw", () => {
  const tracker=createMetaTracker({allowed:()=>true,path:()=>"/audit",install:()=>{throw Error("blocked");},send:()=>{throw Error("unavailable");},revoke:()=>{}});
  assert.doesNotThrow(()=>tracker.sync()); assert.doesNotThrow(()=>tracker.lead());
});

test("real browser adapter defers its script, drops pending events on withdrawal and fails closed on storage errors", async () => {
  const scripts=[], cookies=[], values=new Map([["aurevia-cookie","accepted"]]);
  let storageFails=false;
  const originalWindow=globalThis.window, originalDocument=globalThis.document;
  globalThis.window={location:{pathname:"/audit",hostname:"aurevia-genova.com"},localStorage:{getItem:key=>values.get(key)??null,setItem:(key,value)=>{if(storageFails)throw Error("storage blocked");values.set(key,value);}}};
  globalThis.document={head:{appendChild:script=>scripts.push(script)},createElement:()=>({remove(){}}),set cookie(value){cookies.push(value);}};
  try {
    const pixel=await import(moduleUrl+"#browser-test");
    pixel.syncMetaTracking(); pixel.trackMetaLead();
    assert.equal(scripts.length,0); assert.equal(globalThis.window.fbq,undefined);
    consent.saveMarketingConsent("accepted");
    globalThis.window.location.hostname="localhost"; pixel.setMetaTrackingConsent(true);
    assert.equal(scripts.length,0);
    globalThis.window.location.hostname="aurevia-genova.com"; pixel.syncMetaTracking();
    assert.equal(scripts.length,1);
    assert.equal(scripts[0].src,"https://connect.facebook.net/en_US/fbevents.js");
    pixel.trackMetaLead();
    assert.equal(globalThis.window.fbq.queue.filter(c=>c[0]==="trackSingle").length,2);
    storageFails=true;
    assert.equal(consent.saveMarketingConsent("refused"),false);
    pixel.setMetaTrackingConsent(false); pixel.trackMetaLead();
    assert.equal(globalThis.window.fbq.queue.filter(c=>c[0]==="trackSingle").length,0);
    assert.deepEqual(globalThis.window.fbq.queue.at(-1),["consent","revoke"]);
    assert.ok(cookies.some(c=>c.startsWith("_fbp=; Max-Age=0")));
    assert.ok(cookies.some(c=>c.startsWith("_fbc=; Max-Age=0")));
  } finally { globalThis.window=originalWindow; globalThis.document=originalDocument; }
});
