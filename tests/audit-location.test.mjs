import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// Keep these pure-model tests independent of the React/Vite runtime.
async function moduleUrl(path, imports = {}) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  let output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  for (const [specifier, replacement] of Object.entries(imports)) {
    output = output.replaceAll(`"${specifier}"`, JSON.stringify(replacement));
  }
  return `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
}
const simulatorUrl = await moduleUrl("../lib/simulator.ts");
const locationUrl = await moduleUrl("../lib/audit-location.ts");
const portfolioUrl = await moduleUrl("../lib/audit-portfolio.ts");
const calendarUrl = await moduleUrl("../lib/audit-calendar.ts");
const distributionUrl = await moduleUrl("../lib/audit-distribution.ts");
const objectivesUrl = await moduleUrl("../lib/audit-objectives.ts");
const modelUrl = await moduleUrl("../lib/audit-model.ts", { "./simulator": simulatorUrl, "./audit-location": locationUrl, "./audit-portfolio": portfolioUrl, "./audit-calendar": calendarUrl, "./audit-distribution": distributionUrl, "./audit-objectives": objectivesUrl });
const contentUrl = await moduleUrl("../components/audit-content.ts", { "@/lib/audit-location": locationUrl, "@/lib/audit-distribution": distributionUrl });
const { auditResult, hasAuditRentalHistory, isAuditFinanceComplete } = await import(modelUrl);
const { auditZones, changeAuditLocation, isAuditLocationComplete, resolveAuditLocation, locationCopy } = await import(locationUrl);
const { initialAnswers, initialFinance: defaults } = await import(contentUrl);
const initialFinance = { ...defaults, currentNightly: 350, occupancy: 48, annualCosts: 4800, channelMix: { ...defaults.channelMix, airbnb: { share: 100, fee: 8 } } };
const { calculateRevenueEstimate, calculateRevenueOptimization } = await import(simulatorUrl);
const { isAuditPortfolioComplete, portfolioCopy } = await import(portfolioUrl);
const { calculateDistribution, calculateAuditDistribution, emptyChannelMix, distributionCopy } = await import(distributionUrl);
const { getAuditObjectives, toggleAuditObjective, describeAuditObjectives } = await import(objectivesUrl);
const sestri = { ...initialAnswers, portfolio: "1", status: "active", distribution: "airbnb", area: "genova", zone: "medio-ponente", neighborhood: "sestri-ponente" };
const nervi = { ...sestri, zone: "levante", neighborhood: "nervi" };

test("priorities can be combined, unchecked and restored without losing legacy answers", () => {
  assert.deepEqual(getAuditObjectives("care"), ["care"]);
  assert.deepEqual(getAuditObjectives(["time", "revenue", "time", "invalid"]), ["revenue", "time"]);
  assert.deepEqual(getAuditObjectives(undefined), []);
  const original = ["care"];
  const multiple = toggleAuditObjective(original, "revenue");
  assert.deepEqual(original, ["care"], "state updates must not mutate existing answers");
  assert.deepEqual(multiple, ["revenue", "care"]);
  assert.deepEqual(toggleAuditObjective(multiple, "care"), ["revenue"]);
  assert.deepEqual(toggleAuditObjective(["care"], "care"), []);
  assert.deepEqual(toggleAuditObjective("care", "time"), ["time", "care"]);
  assert.deepEqual(toggleAuditObjective(multiple, "invalid"), multiple);
  assert.deepEqual(getAuditObjectives(JSON.parse(JSON.stringify(multiple))), multiple);
});

test("combined priorities affect every relevant recommendation, never the financial forecast", () => {
  const single = auditResult(nervi, initialFinance);
  const result = auditResult({ ...nervi, objective: ["revenue", "time", "care", "scale"] }, initialFinance);
  assert.ok(result.revenue > single.revenue);
  assert.ok(result.operations > single.operations);
  assert.ok(result.protection > single.protection);
  assert.equal(result.offer, "privilege");
  assert.deepEqual(result.objectives, ["revenue", "time", "care", "scale"]);
  for (const key of ["currentGross", "currentNet", "projectedGross", "projectedNet", "targetNightly", "targetOccupancy"]) {
    assert.equal(result[key], single[key]);
  }
});

test("the internal objective list retains every selected code and translated label", async () => {
  const { auditCopy } = await import(contentUrl);
  for (const locale of ["it", "fr", "en"]) {
    const options = auditCopy[locale].questions.find(question => question.key === "objective").options;
    const details = describeAuditObjectives(["care", "time"], options);
    assert.deepEqual(details.map(item => item.code), ["time", "care"]);
    assert.deepEqual(details.map(item => item.label), options.filter(option => ["time", "care"].includes(option.value)).map(option => option.label));
    assert.deepEqual(JSON.parse(JSON.stringify(details)), details);
  }
});

test("zone and neighbourhood are both mandatory and geographically consistent", () => {
  assert.equal(isAuditLocationComplete(initialAnswers), false);
  assert.equal(isAuditLocationComplete({ ...initialAnswers, area: "genova" }), false);
  assert.equal(isAuditLocationComplete({ ...sestri, neighborhood: "" }), false);
  assert.equal(isAuditLocationComplete(sestri), true);
  assert.equal(isAuditLocationComplete(nervi), true);
  assert.equal(isAuditLocationComplete({ ...sestri, neighborhood: "nervi" }), false);
  assert.equal(resolveAuditLocation({ ...sestri, neighborhood: "nervi" }).nightlyBaseOverride, undefined);
});

test("changing zone resets its dependent fields without losing other answers", () => {
  const next = changeAuditLocation({ ...nervi, objective: "time", address: "Test street", neighborhoodName: "Old text" }, "zone", "medio-ponente");
  assert.equal(next.neighborhood, "");
  assert.equal(next.neighborhoodName, "");
  assert.equal(next.address, "");
  assert.equal(next.objective, "time");
  assert.equal(next.area, "genova");
  assert.equal(isAuditLocationComplete(next), false);
});

test("changing territory resets Genoa-specific selections", () => {
  const next = changeAuditLocation(nervi, "area", "ponente");
  assert.equal(next.zone, "custom");
  assert.equal(next.neighborhood, "");
  assert.equal(next.localityName, "");
  assert.equal(isAuditLocationComplete(next), false);
});

test("every catalogue district belongs to exactly one listed zone", () => {
  const zoneIds = new Set();
  for (const zone of auditZones) {
    const key = `${zone.territory}/${zone.id}`;
    assert.ok(!zoneIds.has(key)); zoneIds.add(key);
    const districts = new Set();
    for (const district of zone.neighborhoods) {
      assert.ok(!districts.has(district.id)); districts.add(district.id);
      assert.equal(isAuditLocationComplete({ ...initialAnswers, area: zone.territory, zone: zone.id, neighborhood: district.id }), true);
    }
  }
});

test("declared rate gets exactly 20% without stacking neighbourhood reference prices", () => {
  for (const currentNightly of [180, 260, 350, 1200]) {
    const finance = { ...initialFinance, currentNightly };
    const n = auditResult(nervi, finance), s = auditResult(sestri, finance);
    assert.ok(n.location.propertyNightly > s.location.propertyNightly);
    assert.equal(n.location.indicativeAnnualGrossPerProperty, n.perProperty.projectedGross);
    assert.equal(n.targetNightly, currentNightly * 1.2);
    assert.equal(n.location.projectedNightly, n.targetNightly);
    assert.equal(n.location.declaredNightly, currentNightly);
    assert.equal(n.location.appliedToCentralRate, false);
    assert.equal(n.optimization.pricingBasis, "declared-rate-plus-20");
    assert.equal(n.optimization.estimatedNightly, n.targetNightly);
    assert.equal(n.projectedGross, s.projectedGross);
    assert.equal(n.currentGross, s.currentGross);
    assert.equal(n.currentNet, s.currentNet);
    assert.equal(n.location.appliedBaseNightly, 190);
    assert.equal(s.location.appliedBaseNightly, 155);
    assert.equal(n.location.neighborhoodName, "Nervi");
    assert.equal(s.location.neighborhoodName, "Sestri Ponente");
  }
});

test("a 20% rate scenario does not guarantee an increase over historical performance", () => {
  const result = auditResult(sestri, { ...initialFinance, currentNightly: 1200, occupancy: 90 });
  assert.equal(result.targetNightly, 1440);
  assert.ok(result.annualGain < 0);
});

test("platform 8% and Aurevia 25% apply after simulator occupancy and pricing optimization", () => {
  const result = auditResult(nervi, initialFinance);
  assert.equal(result.platformRate, 8);
  assert.equal(result.aureviaFeeRate, 25);
  assert.equal(result.targetOccupancy, 70);
  assert.equal(result.targetBookedNights, 256);
  assert.equal(result.projectedGross, result.targetNightly * 256);
  assert.equal(result.projectedNet, Math.round(result.projectedGross * .67 - initialFinance.annualCosts));
  assert.equal(result.annualGain, result.projectedNet - result.currentNet);
});

test("district scenario and locality fallback are honestly differentiated", () => {
  const n = auditResult(nervi, initialFinance), s = auditResult(sestri, initialFinance);
  assert.equal(n.location.calibration, "district-scenario");
  assert.equal(s.location.calibration, "locality-fallback");
  assert.equal(n.location.marketValidated, false);
  assert.equal(s.location.marketValidated, false);
  assert.ok(s.location.uncertainty > n.location.uncertainty);
  assert.equal(s.low, Math.round(s.projectedGross * .65));
  assert.equal(n.low, Math.round(n.projectedGross * .75));
});

test("unknown neighbourhoods use an explicit fallback, not Nervi's premium", () => {
  const selection = { ...nervi, neighborhood: "custom", neighborhoodName: "Test micro-area" };
  assert.equal(isAuditLocationComplete(selection), true);
  assert.equal(isAuditLocationComplete({ ...selection, neighborhoodName: "  " }), false);
  const result = auditResult(selection, initialFinance);
  assert.equal(result.location.calibration, "locality-fallback");
  assert.equal(result.location.appliedBaseNightly, 155);
  assert.equal(result.location.neighborhoodName, "Test micro-area");
});

test("named Riviera towns retain their own existing bases and free-text districts", () => {
  const bases = { camogli: 215, rapallo: 205, "santa-margherita": 245, portofino: 340 };
  for (const [zone, base] of Object.entries(bases)) {
    const selection = { ...initialAnswers, area: "levante", zone, neighborhoodName: "Centro" };
    assert.equal(isAuditLocationComplete(selection), true);
    assert.equal(auditResult(selection, initialFinance).location.appliedBaseNightly, base);
  }
  const custom = { ...initialAnswers, area: "ponente", zone: "custom", localityName: "Varazze", neighborhoodName: "Centro" };
  assert.equal(isAuditLocationComplete(custom), true);
  const result = auditResult(custom, initialFinance);
  assert.equal(result.location.appliedBaseNightly, 165);
  assert.equal(result.location.marketValidated, false);
});

test("the shared site simulator retains its previous Nervi result", () => {
  const f = initialFinance;
  const shared = calculateRevenueEstimate({ location: "Nervi", type: f.propertyType, bedrooms: f.bedrooms, guests: f.guests, area: f.area, finish: f.finish, sea: f.sea, pool: f.pool, terrace: f.terrace, parking: f.parking, days: f.days });
  assert.equal(auditResult(nervi, f).location.propertyNightly, shared.nightly);
});

test("location copy covers all three languages and keeps source keys identical", () => {
  const keys = Object.keys(locationCopy.it).sort();
  for (const locale of ["it", "fr", "en"]) {
    assert.deepEqual(Object.keys(locationCopy[locale]).sort(), keys);
    assert.ok(Object.values(locationCopy[locale]).every(value => typeof value === "string" && value.trim()));
  }
});

test("serialized internal results retain the exact location and model assumptions", () => {
  const result = JSON.parse(JSON.stringify(auditResult(nervi, initialFinance)));
  assert.equal(result.location.zoneCode, "levante");
  assert.equal(result.location.neighborhoodCode, "nervi");
  assert.equal(result.location.geographicCoefficient, 190 / 155);
  assert.match(result.location.assumptions, /not market-validated/);
  assert.ok(result.location.modelVersion);
});

test("portfolio count must be exact and consistent with the selected range", () => {
  for (const [group, count] of [["1", 1], ["2-4", 2], ["2-4", 4], ["5-15", 5], ["5-15", 15], ["16+", 16], ["16+", 37]]) {
    assert.equal(isAuditPortfolioComplete(group, count), true);
  }
  for (const count of [NaN, 0, 1, 15, 16.5, Infinity, 10001]) {
    assert.equal(isAuditPortfolioComplete("16+", count), false);
  }
});

for (const [group, count] of [["2-4", 3], ["5-15", 12], ["16+", 16], ["16+", 37]]) {
  test(`${count} properties scale financial totals, not nightly rates or percentages`, () => {
    const single = auditResult(nervi, initialFinance);
    const multi = auditResult({ ...nervi, portfolio: group }, { ...initialFinance, propertyCount: count });
    assert.equal(multi.portfolio, count);
    assert.equal(multi.portfolioCountConfirmed, true);
    assert.equal(multi.basis, "representative-property-extrapolation");
    for (const metric of ["currentGross", "currentNet", "projectedGross", "projectedNet", "annualGain", "grossGain", "occupancyContribution", "pricingContribution", "annualCosts", "low", "high", "currentBookedNights", "targetBookedNights"]) {
      assert.equal(multi[metric], single[metric] * count, metric);
      assert.equal(multi.perProperty[metric], single[metric], `${metric} per property`);
    }
    for (const metric of ["targetNightly", "targetOccupancy", "platformRate", "aureviaFeeRate"]) assert.equal(multi[metric], single[metric], metric);
    assert.equal(multi.monthlyGross, Math.round(multi.projectedGross / 12));
    assert.equal(multi.location.neighborhoodName, single.location.neighborhoodName);
    assert.equal(multi.offer, count >= 5 ? "privilege" : "serenity");
  });
}

test("no guessed count or positive claim is substituted for incomplete or negative results", () => {
  const incomplete = auditResult({ ...nervi, portfolio: "16+" }, { ...initialFinance, propertyCount: NaN });
  assert.equal(incomplete.portfolioCountConfirmed, false);
  assert.equal(incomplete.projectedGross, 0);
  const losing = auditResult({ ...nervi, portfolio: "16+" }, { ...initialFinance, propertyCount: 16, annualCosts: 1000000 });
  assert.ok(losing.projectedNet < 0);
  assert.equal(losing.projectedNet, losing.perProperty.projectedNet * 16);
});

test("portfolio caveats are available in all three languages", () => {
  for (const locale of ["it", "fr", "en"]) {
    assert.deepEqual(Object.keys(portfolioCopy[locale]).sort(), Object.keys(portfolioCopy.it).sort());
    assert.ok(portfolioCopy[locale].assumption);
  }
});

test("a private pool at €150 still uses €180 without confusing property and portfolio", () => {
  const result = auditResult({ ...nervi, portfolio: "2-4", status: "active" }, {
    ...initialFinance, propertyCount: 3, currentNightly: 150, days: 365, occupancy: 30,
    propertyType: "Appartement", finish: "Soigné", bedrooms: 1, guests: 2, area: 70, sea: false, pool: true, poolKind: "private", terrace: false,
  });
  assert.equal(result.targetNightly, 180);
  assert.equal(result.location.propertyNightly, 219, "legacy property reference is internal context only");
  assert.equal(result.targetOccupancy, 70);
  assert.equal(result.perProperty.targetBookedNights, 256);
  assert.equal(result.perProperty.currentBookedNights, 110);
  assert.equal(result.perProperty.currentGross, 16500);
  assert.equal(result.currentGross, 49500);
  assert.equal(result.perProperty.projectedGross, result.targetNightly * 256);
  assert.equal(result.projectedGross, result.perProperty.projectedGross * 3);
  assert.equal(result.projectedGross, 138240);
  assert.equal(result.perProperty.occupancyContribution, 21900);
  assert.equal(result.grossGain, result.occupancyContribution + result.pricingContribution);
  assert.equal(result.evidence.marketValidated, false);
});

test("every rented-property status honours the explicitly entered management percentage", () => {
  for (const status of ["active", "managed", "secondary"]) {
    for (const currentManagementRate of [0, 12.5, 18.75, 20, 25, 50]) {
      const result = auditResult({ ...nervi, status, portfolio: "2-4" }, {
        ...initialFinance, propertyCount: 3, currentNightly: 100, days: 100, occupancy: 50, annualCosts: 0, currentManagementRate,
      });
      assert.equal(result.currentManagementRate, currentManagementRate);
      assert.equal(result.perProperty.currentGross, 5000);
      assert.equal(result.perProperty.currentNet, Math.round(5000 * (100 - 8 - currentManagementRate) / 100));
      assert.equal(result.currentNet, result.perProperty.currentNet * 3);
      assert.equal(result.annualGain, result.projectedNet - result.currentNet);
      assert.equal(result.targetNightly, 120);
      assert.equal(result.aureviaFeeRate, 25);
      assert.equal(result.platformRate, 8);
    }
  }
});

test("management fee validation accepts zero and decimals but rejects missing or out-of-range rates", () => {
  for (const status of ["active", "managed", "secondary"]) {
    for (const currentManagementRate of [0, 12.5, 18.75, 50]) {
      assert.equal(isAuditFinanceComplete({ ...nervi, status }, { ...initialFinance, currentManagementRate }), true);
    }
    for (const currentManagementRate of [NaN, Infinity, -1, 50.01]) {
      assert.equal(isAuditFinanceComplete({ ...nervi, status }, { ...initialFinance, currentManagementRate }), false);
    }
  }
  for (const answers of [{ ...nervi, status: "launch" }, { ...nervi, status: "secondary", distribution: "none" }]) {
    assert.equal(isAuditFinanceComplete(answers, { ...initialFinance, currentManagementRate: NaN }), true);
    assert.equal(auditResult(answers, { ...initialFinance, currentManagementRate: 20 }).currentManagementRate, 0);
  }
});

test("an explicit history choice unlocks actual figures without inventing a launch history", () => {
  for (const status of ["active", "managed", "launch", "secondary"]) {
    for (const distribution of ["airbnb", "none"]) {
      const answers = { ...nervi, status, distribution };
      const withHistory = { ...initialFinance, hasRentalHistory: true, currentNightly: 160, occupancy: 40, currentManagementRate: 20, days: 365 };
      const before = JSON.stringify(withHistory);
      const actual = auditResult(answers, withHistory);
      assert.equal(hasAuditRentalHistory(answers, withHistory), true);
      assert.equal(actual.hasRentalHistory, true);
      assert.equal(actual.currentNightly, 160);
      assert.equal(actual.currentOccupancy, 40);
      assert.equal(actual.currentManagementRate, 20);
      assert.equal(actual.currentGross, 23360);
      assert.equal(actual.targetNightly, 192);
      assert.equal(isAuditFinanceComplete(answers, { ...withHistory, currentNightly: NaN }), false);
      if (distribution === "none") {
        assert.equal(actual.currentPlatformRate, null, "no listing does not prove zero historical channel fees");
        assert.equal(actual.currentNet, null);
      }
      const noHistory = { ...withHistory, hasRentalHistory: false };
      assert.equal(hasAuditRentalHistory(answers, noHistory), false);
      assert.equal(auditResult(answers, noHistory).currentGross, 0);
      assert.equal(auditResult(answers, noHistory).currentNightly, 0);
      assert.equal(isAuditFinanceComplete(answers, { ...noHistory, currentNightly: NaN, occupancy: NaN, currentManagementRate: NaN }), true);
      assert.equal(JSON.stringify(withHistory), before, "switching modes must not erase entered data");
    }
  }
});

test("no current listing does not automatically erase an active property's rental history", () => {
  for (const status of ["active", "managed"]) {
    const answers = { ...nervi, status, distribution: "none" };
    assert.equal(hasAuditRentalHistory(answers, initialFinance), true);
    assert.ok(auditResult(answers, initialFinance).currentGross > 0);
    assert.equal(auditResult(answers, initialFinance).currentPlatformRate, null);
  }
});

test("not-yet-rented properties have no fictitious current occupancy or revenue", () => {
  const result = auditResult({ ...nervi, status: "launch" }, initialFinance);
  assert.equal(result.currentOccupancy, 0);
  assert.equal(result.currentBookedNights, 0);
  assert.equal(result.currentGross, 0);
});

test("monthly public and internal figures reconcile with nights, capacity and annual totals", () => {
  for (const days of [30, 100, 300, 365]) {
    const result = auditResult({ ...nervi, portfolio: "2-4" }, { ...initialFinance, propertyCount: 3, currentNightly: 180, days });
    const rows = result.monthlyPlan;
    assert.equal(rows.reduce((sum, row) => sum + row.availableNightsPerProperty, 0), days);
    assert.equal(rows.reduce((sum, row) => sum + row.bookedNightsPerProperty, 0), result.perProperty.targetBookedNights);
    assert.equal(rows.reduce((sum, row) => sum + row.projectedGrossPerProperty, 0), result.perProperty.projectedGross);
    assert.equal(rows.reduce((sum, row) => sum + row.projectedGrossPortfolio, 0), result.projectedGross);
    for (const row of rows) {
      assert.ok(row.bookedNightsPerProperty <= row.availableNightsPerProperty);
      assert.ok(row.occupancyRate >= 0 && row.occupancyRate <= 100);
      assert.equal(row.nightlyRate, result.targetNightly);
    }
  }
});

test("decimal historical rates keep cents and monthly totals reconcile", () => {
  const result = auditResult({ ...nervi, portfolio: "2-4", status: "active" }, {
    ...initialFinance, propertyCount: 3, currentNightly: 180.50, days: 365, occupancy: 70,
  });
  assert.equal(result.perProperty.currentGross, 46208);
  assert.equal(result.targetNightly, 216.60);
  assert.equal(result.perProperty.projectedGross, 55449.60);
  assert.equal(result.monthlyPlan.reduce((sum, row) => sum + Math.round(row.projectedGrossPerProperty * 100), 0), Math.round(result.perProperty.projectedGross * 100));
  assert.equal(result.monthlyPlan.reduce((sum, row) => sum + Math.round(row.projectedGrossPortfolio * 100), 0), Math.round(result.projectedGross * 100));
});

test("net half-euro rounding is not changed by binary percentage subtraction", () => {
  const result = auditResult(nervi, { ...initialFinance, currentNightly: 291.67, occupancy: 58, days: 364, annualCosts: 4800 });
  assert.equal(result.projectedGross, 89250);
  assert.equal(result.projectedNet, 54998);
});

test("audit and public simulator share exactly the same gross model across profiles", () => {
  for (const occupancy of [0, 45, 58, 70, 80, 90, 100]) {
    for (const currentNightly of [180, 260, 350, 1200]) {
      const f = { ...initialFinance, occupancy, currentNightly };
      const actual = auditResult({ ...nervi, status: "active" }, f);
      const expected = calculateRevenueOptimization({ location: "Nervi", type: f.propertyType, bedrooms: f.bedrooms, guests: f.guests, area: f.area, finish: f.finish, sea: f.sea, pool: f.pool, terrace: f.terrace, parking: f.parking, days: f.days }, currentNightly, occupancy);
      assert.equal(actual.targetNightly, expected.nightly);
      assert.equal(actual.targetOccupancy, expected.occupancy);
      assert.equal(actual.projectedGross, expected.annual);
      assert.equal(actual.currentGross, expected.currentAnnual);
      assert.equal(actual.occupancyContribution + actual.pricingContribution, actual.grossGain);
      assert.equal(actual.projectedGross - actual.currentGross, actual.grossGain);
      assert.ok(actual.targetOccupancy >= 70);
      assert.ok(actual.targetOccupancy <= Math.max(70, occupancy));
      assert.equal(actual.evidence.jointPriceOccupancyValidated, false);
    }
  }
});

test("high historical occupancy can produce a loss despite the 20% rate assumption", () => {
  const result = auditResult({ ...nervi, status: "active" }, { ...initialFinance, currentNightly: 1200, occupancy: 90 });
  assert.equal(result.targetOccupancy, 70);
  assert.equal(result.targetNightly, 1440);
  assert.ok(result.grossGain < 0);
  assert.ok(result.annualGain < 0);
});

test("repricing does not automatically preserve a high historical occupancy", () => {
  const result = auditResult({ ...nervi, status: "managed" }, { ...initialFinance, currentNightly: 180, occupancy: 80, currentManagementRate: 25 });
  assert.equal(result.targetOccupancy, 70);
  assert.equal(result.occupancyContribution, -6480);
  assert.equal(result.targetNightly, 216);
  assert.equal(result.pricingContribution, result.grossGain - result.occupancyContribution);
  assert.ok(result.annualGain > 0);
});

test("public simulator uses the same declared-rate +20% model and 70% stated target", () => {
  const result = calculateRevenueOptimization({ location: "Gênes", type: "Appartement", bedrooms: 2, guests: 4, area: 90, finish: "Soigné", sea: true, pool: false, terrace: true, parking: false, days: 300 }, 185, 45);
  assert.equal(result.currentAnnual, 24975);
  assert.equal(result.nightly, 222);
  assert.equal(result.occupancy, 70);
  assert.equal(result.annual, result.nightly * 210);
  assert.equal(result.occupancyContribution, 13875);
  assert.equal(result.pricingContribution, result.gain - 13875);
  assert.equal(result.gain, result.annual - 24975);
});

test("actual single-channel costs change current net, not fabricated historical revenue", () => {
  const cases = [["airbnb", "airbnb", 15.5, 4225], ["booking", "booking", 18, 4100], ["direct-only", "direct", 2, 4900]];
  for (const [distribution, channel, fee, expectedNet] of cases) {
    const channelMix = emptyChannelMix(); channelMix[channel] = { share: 100, fee };
    const result = auditResult({ ...nervi, distribution }, { ...initialFinance, currentNightly: 100, days: 100, occupancy: 50, annualCosts: 0, channelMix });
    assert.equal(result.currentGross, 5000);
    assert.equal(result.currentNet, expectedNet);
    assert.equal(result.currentPlatformRate, fee);
    assert.equal(result.platformRate, 8, "future 8% remains the owner's stated assumption, not a platform fact");
    assert.equal(result.evidence.channelRevenueUpliftCalibrated, false);
  }
});

test("channel costs are weighted by revenue shares, not a simple fee average", () => {
  const channelMix = { airbnb: { share: 50, fee: 15.5 }, booking: { share: 30, fee: 18 }, direct: { share: 20, fee: 2 }, other: { share: 0, fee: null } };
  const distribution = calculateDistribution("direct", channelMix);
  assert.equal(distribution.complete, true);
  assert.equal(distribution.effectiveRate, 13.55);
  const result = auditResult({ ...nervi, distribution: "direct" }, { ...initialFinance, currentNightly: 100, days: 100, occupancy: 50, annualCosts: 0, channelMix });
  assert.equal(result.currentNet, 4323);
  assert.deepEqual(JSON.parse(JSON.stringify(result)).distribution.rows.map(row => row.share), [50, 30, 20, 0]);
});

test("every selected channel can continue without a mandatory cost breakdown", () => {
  for (const distribution of ["airbnb", "booking", "direct-only", "multi", "direct"]) {
    const finance = { ...initialFinance, channelMix: emptyChannelMix() };
    const fees = calculateAuditDistribution(distribution, finance);
    assert.equal(fees.canContinue, true);
    assert.equal(fees.inputMode, "unknown");
    assert.equal(fees.complete, false, "skipping is not confirmation of actual costs");
    assert.equal(fees.effectiveRate, null);
    const result = auditResult({ ...nervi, distribution }, finance);
    assert.equal(result.currentNet, null);
    assert.equal(result.annualGain, null);
    assert.equal(result.evidence.channelCostBasis, "historical-channel-costs-not-provided");
    assert.ok(result.currentGross > 0);
    assert.ok(result.projectedNet > 0);
  }
  for (const distribution of ["", "invalid"]) assert.equal(calculateAuditDistribution(distribution, {}).canContinue, false);
  assert.equal(calculateAuditDistribution("none", {}).canContinue, true);
});

test("an optional owner-declared average replaces the breakdown without stacking fees", () => {
  for (const averageChannelFee of [0, 8, 13.55, 100]) {
    const finance = { ...initialFinance, currentNightly: 100, days: 100, occupancy: 50, annualCosts: 0, currentManagementRate: 20, channelFeeMode: "average", averageChannelFee };
    const result = auditResult({ ...nervi, distribution: "multi" }, finance);
    assert.equal(result.distribution.canContinue, true);
    assert.equal(result.distribution.complete, true);
    assert.equal(result.distribution.basis, "owner-declared-average-fee");
    assert.deepEqual(result.distribution.rows, [], "ignored per-channel figures are not presented as used");
    assert.equal(result.currentPlatformRate, averageChannelFee);
    assert.equal(result.currentNet, Math.round((5000 * (100 - averageChannelFee - 20)) / 100));
    assert.equal(result.platformRate, 8);
    assert.equal(result.aureviaFeeRate, 25);
    assert.equal(result.targetNightly, 120);
  }
});

test("optional fees can be cleared or deferred without stale or invalid costs leaking into the model", () => {
  for (const averageChannelFee of [null, undefined, NaN, Infinity, -1, 101]) {
    const finance = { ...initialFinance, channelFeeMode: "average", averageChannelFee };
    const fees = calculateAuditDistribution("airbnb", finance);
    assert.equal(fees.canContinue, averageChannelFee == null);
    assert.equal(fees.effectiveRate, null);
    const deferred = { ...finance, channelFeeMode: "unknown" };
    assert.equal(calculateAuditDistribution("airbnb", deferred).canContinue, true);
    assert.equal(auditResult(nervi, deferred).currentNet, null);
  }
  const partial = { ...initialFinance, channelFeeMode: "detailed", channelMix: { ...emptyChannelMix(), airbnb: { share: 60, fee: 15 } } };
  assert.equal(calculateAuditDistribution("multi", partial).canContinue, false);
  const deferred = { ...partial, channelFeeMode: "unknown" };
  assert.equal(calculateAuditDistribution("multi", deferred).canContinue, true);
  assert.equal(calculateAuditDistribution("multi", deferred).effectiveRate, null);
  const restored = { ...partial, channelMix: { ...partial.channelMix, booking: { share: 40, fee: 18 } } };
  assert.equal(calculateAuditDistribution("multi", restored).effectiveRate, 16.2);
  assert.equal(calculateAuditDistribution("multi", restored).canContinue, true);
});

test("missing fees and invalid mix totals never masquerade as zero-cost distribution", () => {
  assert.equal(calculateDistribution("airbnb", emptyChannelMix()).effectiveRate, null);
  for (const share of [40, 101, -10, NaN, Infinity]) {
    const mix = emptyChannelMix(); mix.airbnb = { share, fee: 3 };
    assert.equal(calculateDistribution("multi", mix).complete, false);
  }
  const invalid = emptyChannelMix(); invalid.airbnb = { share: 100, fee: 3 }; invalid.booking = { share: -10, fee: 12 };
  assert.equal(calculateDistribution("multi", invalid).complete, false);
  for (const fee of [null, NaN, Infinity, -1, 101]) {
    const mix = emptyChannelMix(); mix.airbnb = { share: 100, fee };
    assert.equal(calculateDistribution("airbnb", mix).complete, false);
  }
  const result = auditResult(nervi, { ...initialFinance, channelMix: emptyChannelMix() });
  assert.equal(result.currentNet, null);
  assert.equal(result.annualGain, null);
  assert.ok(Number.isFinite(result.projectedGross));
});

test("unused channel costs do not leak when changing the selected distribution", () => {
  const mix = emptyChannelMix(); mix.airbnb = { share: 50, fee: 3 }; mix.booking = { share: 50, fee: 18 };
  assert.equal(calculateDistribution("multi", mix).effectiveRate, 10.5);
  assert.equal(calculateDistribution("airbnb", mix).effectiveRate, 3);
  mix.direct = { share: 100, fee: 0 };
  assert.equal(calculateDistribution("direct-only", mix).effectiveRate, 0);
  assert.equal(calculateDistribution("none", mix).effectiveRate, 0);
});

test("a pool does not create a universal €200 floor or a verified market valuation", () => {
  const f = { ...initialFinance, propertyType: "Appartement", bedrooms: 1, guests: 2, area: 70, finish: "Soigné", terrace: false, pool: true, poolKind: "private", currentNightly: 150, occupancy: 30 };
  const n = auditResult(nervi, f), s = auditResult(sestri, f);
  assert.equal(n.targetNightly, 180);
  assert.equal(s.targetNightly, 180);
  assert.equal(n.evidence.marketValidated, false);
  assert.equal(s.location.calibration, "locality-fallback");
  for (const poolKind of ["shared", "jacuzzi"]) {
    const result = auditResult(nervi, { ...f, poolKind });
    assert.equal(result.targetNightly, 180, "no extra amenity coefficient on top of the declared price +20%");
    assert.equal(result.evidence.jointPriceOccupancyValidated, false);
  }
});

test("distribution questions and evidence copy cover IT, FR and EN", () => {
  for (const locale of ["it", "fr", "en"]) {
    assert.deepEqual(Object.keys(distributionCopy[locale]).sort(), Object.keys(distributionCopy.it).sort());
  }
});

test("historical figures are not prefilled and a launch has no invented current rate", () => {
  assert.ok(Number.isNaN(defaults.currentNightly) && Number.isNaN(defaults.occupancy) && Number.isNaN(defaults.annualCosts));
  assert.equal(isAuditFinanceComplete(nervi, defaults), false);
  const launch = { ...nervi, status: "launch", distribution: "none" };
  const finance = { ...defaults, annualCosts: 4800 };
  assert.equal(isAuditFinanceComplete(launch, finance), true);
  const result = auditResult(launch, finance);
  assert.equal(result.currentGross, 0);
  assert.equal(result.currentNightly, 0);
  assert.ok(Number.isFinite(result.projectedGross));
  assert.equal(result.optimization.pricingBasis, "launch-property-scenario");
  assert.equal(result.location.appliedToCentralRate, true);
  assert.equal(result.targetNightly, result.location.propertyNightly, "launch reference is not uplifted again");
});

test("owner example: €160 becomes €192 and seven properties total €344064 gross", () => {
  const result = auditResult({ ...nervi, portfolio: "5-15" }, {
    ...initialFinance, propertyCount: 7, currentNightly: 160, occupancy: 40, days: 365,
  });
  assert.equal(result.currentNightly, 160);
  assert.equal(result.targetNightly, 192);
  assert.equal(result.optimization.nightlyUpliftPercent, 20);
  assert.equal(result.perProperty.currentBookedNights, 146);
  assert.equal(result.perProperty.targetBookedNights, 256);
  assert.equal(result.perProperty.currentGross, 23360);
  assert.equal(result.currentGross, 163520);
  assert.equal(result.perProperty.projectedGross, 49152);
  assert.equal(result.projectedGross, 344064);
  assert.equal(result.location.indicativeAnnualGrossPortfolio, result.projectedGross);
  assert.equal(result.grossGain, result.occupancyContribution + result.pricingContribution);
});

test("rate uplift stays 20% across property types, standards, amenities and cent rounding", () => {
  for (const propertyType of ["Appartement", "Attique", "Villa", "Maison indépendante"]) {
    for (const finish of ["Essentiel", "Soigné", "Premium", "Luxe"]) {
      for (const [currentNightly, targetNightly] of [[100, 120], [150, 180], [160, 192], [180.50, 216.60], [160.01, 192.01], [160.03, 192.04], [1200, 1440]]) {
        const result = auditResult(nervi, { ...initialFinance, propertyType, finish, currentNightly, bedrooms: 12, guests: 30, area: 1000, sea: true, terrace: true, parking: true, pool: true, poolKind: "private" });
        assert.equal(result.targetNightly, targetNightly);
        assert.equal(result.location.appliedToCentralRate, false);
      }
    }
  }
});
