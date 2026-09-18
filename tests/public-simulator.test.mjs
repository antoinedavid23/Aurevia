import assert from 'node:assert/strict';
import test from 'node:test';
import { typescriptModuleUrl } from './helpers/import-typescript.mjs';

const { calculateManagedProjection } = await import(await typescriptModuleUrl('lib/public-site/simulator.ts'));
const property = {
  location: 'Castelletto', type: 'Trois-pièces', bedrooms: 2, guests: 4,
  area: 75, finish: 'Soigné', transit: true, elevator: true, outdoor: true,
  parking: false, days: 365, currentNightly: 100,
};

test('declared occupancy is retained through 100%, including above the old 80% limit', () => {
  for (const currentOccupancy of [25, 60, 80, 85, 92, 95, 99, 100]) {
    const result = calculateManagedProjection({ ...property, currentOccupancy });
    assert.equal(result.currentAnnual, Math.round(365 * currentOccupancy / 100) * 100);
    assert.ok(result.occupancy >= currentOccupancy);
    assert.ok(result.occupancy <= 100);
    assert.ok(result.bookedNights <= 365);
    assert.ok(Math.abs(result.occupancyLift - (result.occupancy - currentOccupancy)) < .001);
  }
});

test('100% occupancy cannot create extra nights or an artificial occupancy uplift', () => {
  for (const days of [90, 260, 365]) {
    const result = calculateManagedProjection({ ...property, days, currentOccupancy: 100 });
    assert.equal(result.currentAnnual, days * 100);
    assert.equal(result.bookedNights, days);
    assert.equal(result.occupancy, 100);
    assert.equal(result.occupancyLift, 0);
    assert.equal(result.additionalNights, 0);
    assert.equal(result.occupancyContribution, 0);
    assert.equal(result.annual, result.nightly * days);
  }
});

test('the existing projection ceiling remains 92% for lower declared occupancy', () => {
  const result = calculateManagedProjection({ ...property, currentOccupancy: 90 });
  assert.equal(result.occupancy, 92);
  assert.equal(result.occupancyLift, 2);
});

test('occupancy above 100% is capped at the available inventory', () => {
  const result = calculateManagedProjection({ ...property, currentOccupancy: 120 });
  assert.equal(result.currentAnnual, 36500);
  assert.equal(result.bookedNights, 365);
  assert.equal(result.occupancyLift, 0);
});
