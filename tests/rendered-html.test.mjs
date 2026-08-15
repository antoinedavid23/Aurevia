import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("the homepage keeps the Aurevia multi-section structure without a video hero", async () => {
  const home = await source("app/page.tsx");
  assert.match(home, /trust-marquee/);
  assert.match(home, /home-services/);
  assert.match(home, /simulator-teaser/);
  assert.match(home, /experience-mosaic/);
  assert.match(home, /MethodJourney/);
  assert.match(home, /ReviewCards/);
  assert.match(home, /images\/home\/genova-night\.webp/);
  assert.doesNotMatch(home, /HeroVideo|<video|\.mp4|\.webm/);
});

test("the public navigation points to separate routes", async () => {
  const shell = await source("components/SiteShell.tsx");
  for (const route of ["/servizi", "/esperienze", "/proprietari", "/proprieta", "/simulatore", "/chi-siamo", "/contatti"]) {
    assert.match(shell, new RegExp(route.replace("/", "\\/")));
  }
});

test("Velyo branding and Genova imagery are configured", async () => {
  const [layout, data, css] = await Promise.all([
    source("app/layout.tsx"),
    source("data/content.ts"),
    source("app/velyo.css"),
  ]);
  assert.match(layout, /Velyo Property Manager/);
  assert.match(data, /Genova/);
  assert.match(css, /--velyo-gold/);
});
