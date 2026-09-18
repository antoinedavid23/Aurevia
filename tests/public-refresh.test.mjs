import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import postcss from 'postcss';
import { typescriptModuleUrl } from './helpers/import-typescript.mjs';
import { buildVelyoPublicStyles, sourceStyles, sourceDirectory, publicNames, scopeSelector, aureviaColors } from '../scripts/sync-velyo-public-styles.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const files = directory => readdirSync(directory, {withFileTypes:true}).flatMap(item => item.isDirectory() ? files(`${directory}/${item.name}`) : [`${directory}/${item.name}`]);

test('public refresh explicitly preserves the original login, administration and audit shell', () => {
  const source = read('components/BrandSiteShell.tsx');
  for(const route of ['/connexion','/administration','/audit']) assert.ok(source.includes(`"${route}"`));
  assert.match(source, /OriginalSiteShell/);
  assert.match(source, /PublicSiteShell/);
  assert.match(read('components/public-site/SiteShell.tsx'), /data-aurevia-site data-no-translate/);
});

test('the original video hero and logo remain on the homepage', () => {
  const source = read('app/page.tsx');
  assert.match(source, /data-aurevia-original-hero/);
  assert.match(source, /<HeroVideo\s*\//);
  assert.match(source, /L’art de prendre soin/);
  assert.match(source, /images\/brand\/aurevia-logo-no-tagline.png/);
  assert.doesNotMatch(source, /aurevia-hero-image/);
});

test('public styles and animation names cannot leak into private screens', () => {
  for (const file of ['app/aurevia-public-layouts.css','app/aurevia-public-theme.css']) {
    const tree = postcss.parse(read(file));
    tree.walkAtRules(/keyframes$/, rule => assert.ok(rule.params.startsWith('public-')));
    tree.walkRules(rule => {
      for(let p = rule.parent; p; p = p.parent) if (p.type === 'atrule' && /keyframes$/.test(p.name)) return;
      for(const selector of rule.selectors) assert.ok(selector.includes('[data-aurevia-site]') || selector.startsWith('[data-aurevia-original-hero]'), selector);
    });
  }
});

test('Velyo layout, typography and motion keep their exact values; only colors change', () => {
  const css = read('app/aurevia-public-layouts.css');
  assert.equal(css, buildVelyoPublicStyles(), 'Regenerate CSS from the source sheets');
  const source = postcss.parse(sourceStyles.map(file => read(`${sourceDirectory}/${file}`)).join('\n'));
  source.walkRules(rule => { if (rule.selector.includes('locale-pending')) rule.remove(); });
  const declarations = tree => {
    const values = [];
    tree.walkDecls(decl => {
      if (!/animation/.test(decl.prop)) values.push([publicNames(decl.prop), aureviaColors(publicNames(decl.value), publicNames(decl.prop)), Boolean(decl.important)]);
    });
    return values;
  };
  // Compare every non-animation value, not just a handful of representative tokens.
  const actual = [];
  postcss.parse(css).walkDecls(decl => {
    if (!/animation/.test(decl.prop)) actual.push([decl.prop, decl.value, Boolean(decl.important)]);
  });
  assert.deepEqual(actual, declarations(source));
  assert.match(css, /--aurevia-blue: #ddb85e/);
  assert.doesNotMatch(css, /#806127/i);
  assert.doesNotMatch(css, /#(?:1f5fbf|65a9f8|78b7ff|2867c7)\b/i);
  assert.match(css, /--font-sans:\s*"Lato"/);
  assert.doesNotMatch(css, /"Cinzel"|"Manrope"/);
});

test('Aurevia palette covers gradients, alpha effects, sliders and readable text', () => {
  assert.equal(aureviaColors('#78b7ff', 'background'), '#f2d694');
  assert.equal(aureviaColors('#a9d2ff', 'background'), '#f2d694');
  assert.equal(aureviaColors('#1F5FBF', 'color'), 'var(--aurevia-gold-text)');
  assert.equal(aureviaColors('var(--aurevia-blue)', '--aurevia-watermark-eyebrow-color'), 'var(--aurevia-gold-text)');
  assert.equal(aureviaColors('rgba(31, 95, 191, .2)', 'box-shadow'), 'rgba(221, 184, 94, .2)');
  assert.equal(aureviaColors('#123A66', 'background'), '#0d1b2a');
  assert.equal(aureviaColors('clamp(2rem, 5vw, 4rem)', 'font-size'), 'clamp(2rem, 5vw, 4rem)');
  assert.doesNotMatch(read('components/public-site/RevenueSimulator.tsx'), /#65A9F8/i);
  const luminance = hex => hex.slice(1).match(/../g).map(x => parseInt(x, 16) / 255)
    .map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4)
    .reduce((total, x, i) => total + x * [.2126, .7152, .0722][i], 0);
  for (const [front, back] of [['#0d1b2a', '#ddb85e'], ['#0d1b2a', '#faf9f6'], ['#f2d694', '#0d1b2a']]) {
    const pair = [luminance(front), luminance(back)].sort((a, b) => b - a);
    assert.ok((pair[0] + .05) / (pair[1] + .05) >= 4.5, `${front} / ${back}`);
  }
  assert.ok((luminance('#faf9f6') + .05) / (luminance('#b28b2f') + .05) >= 3, 'Large gold headings on the light surface');
});

test('all displayed logos reuse the approved no-tagline artwork', () => {
  // Fingerprint of the approved export; no dependency on untracked local outputs.
  assert.equal(createHash('sha256').update(readFileSync('public/images/brand/aurevia-logo-no-tagline.png')).digest('hex'), 'd5dcc07249ecc83cff7423089a2ef626d3fcd99caac90db0cebc651cb891330a');
  for (const file of ['app/page.tsx', 'app/layout.tsx', 'components/SiteShell.tsx', 'components/public-site/SiteShell.tsx', 'components/AuditFunnel.tsx', 'components/AuditThankYou.tsx', 'components/AuditAppointment.tsx']) {
    assert.match(read(file), /aurevia-logo-no-tagline\.png/);
    assert.doesNotMatch(read(file), /aurevia-logo-transparent-gold\.png/);
  }
  const theme = postcss.parse(read('app/aurevia-public-theme.css'));
  let navyHeader = false;
  theme.walkRules(rule => {
    if (rule.selector !== '[data-aurevia-site] header.aurevia-header.site-header') return;
    rule.walkDecls('background', decl => { navyHeader = decl.value === '#0d1b2a'; });
  });
  assert.ok(navyHeader);
  assert.match(read('app/layout.tsx'), /<BrandLogoFilter\s*\//);
  assert.match(read('app/globals.css'), /filter:url\(#aurevia-logo-cutout\)!important/);
});

test('Velyo font files are imported alongside, not in place of, original Aurevia fonts', () => {
  const layout = read('app/layout.tsx');
  for (const weight of [400, 500, 600, 700, 800]) assert.ok(layout.includes(`@fontsource/montserrat/${weight}.css`));
  for (const weight of [400, 700]) assert.ok(layout.includes(`@fontsource/lato/${weight}.css`));
  assert.match(layout, /@fontsource\/cinzel\/400.css/);
  assert.match(layout, /@fontsource\/manrope\/400.css/);
  const theme = postcss.parse(read('app/aurevia-public-theme.css'));
  theme.walkDecls(/font-family|^--font-/, decl => assert.equal(decl.parent.selector, '[data-aurevia-original-hero]'));
});

test('direct contact block offers independent email and phone links', () => {
  const shell = read('components/public-site/SiteShell.tsx');
  const block = shell.match(/<div className="footer-direct-contact">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(block);
  assert.match(block, /href=\{`mailto:\$\{email\}`\}/);
  assert.match(block, /href=\{contactPhoneHref\} data-no-translate/);
  assert.match(block, /<strong>\{contactPhone\}<\/strong>/);
  assert.match(shell, /import \{ contactPhone, contactPhoneHref \} from "@\/lib\/contact-details"/);
  assert.equal((block.match(/<a /g) || []).length, 2);
});

test('scoping preserves language, reveal state and pseudo-element behavior', () => {
  assert.match(scopeSelector('html[lang="it"] .heading::before'), /^html\[lang="it"\] \[data-aurevia-site\] \.heading:where\(.+\)::before$/);
  assert.match(scopeSelector('html.scroll-reveal-ready .card'), /^\[data-aurevia-site\]\.scroll-reveal-ready \.card/);
  assert.match(scopeSelector('.hero:after'), /\):after$/);
  assert.match(scopeSelector('body:has(.valuation-page) .sticky-cta'), /^\[data-aurevia-site\]:has\(\.valuation-page\)/);
});

test('all static image references in the copied public presentation resolve locally', () => {
  const directories = ['components/public-site','data/public-site','lib/public-site'];
  const sourceFiles = directories.flatMap(files).filter(file => /\.(tsx?|css)$/.test(file));
  sourceFiles.push('app/page.tsx','app/aurevia-public-layouts.css','app/aurevia-public-theme.css');
  for(const directory of ['chi-siamo','servizi','esperienze','proprietari','proprieta','simulatore','valutazione','contatti','faq','grazie']) sourceFiles.push(...files(`app/${directory}`).filter(file=>file.endsWith('.tsx')));
  const missing = new Set();
  for(const file of sourceFiles) {
    for(const [asset] of read(file).matchAll(/\/images\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g|svg)/g)) {
      if(!existsSync(`public${asset}`)) missing.add(`${file}: ${asset}`);
    }
  }
  assert.deepEqual([...missing], []);
});

test('public content switches Italian, French and English without changing the private translator', async () => {
  const {translate} = await import(await typescriptModuleUrl('lib/public-site/i18n.ts'));
  const {translate: privateTranslate} = await import(await typescriptModuleUrl('lib/i18n.ts'));
  const source = 'Vous déléguez l’exploitation.';
  const it = translate(source,'it');
  assert.notEqual(it,source);
  assert.equal(translate(it,'fr'),source);
  assert.equal(translate(it,'en'),translate(source,'en'));
  assert.equal(privateTranslate('Se connecter','fr'),'Se connecter');
  assert.doesNotMatch(read('lib/i18n.ts'),/public-site/);
});

test('new public forms use existing Aurevia lead endpoints and tracking consent', () => {
  for(const [component,endpoint] of [['LeadForm','contact'],['ValuationForm','valuation']]) {
    const source = read(`components/public-site/${component}.tsx`);
    assert.ok(source.includes(`/api/${endpoint}`));
    assert.match(source,/isConfirmedAuditDelivery/);
    assert.match(source,/trackMetaLead/);
  }
  assert.doesNotMatch(read('components/public-site/SiteShell.tsx'),/velyo\.(com|it)|aurevia\.com/i);
});

test('chauffeur and chef services appear in their categories in all three languages', async () => {
  const { experienceCategories } = await import(await typescriptModuleUrl('data/public-site/experience-categories.ts'));
  const { translateDeep, translate } = await import(await typescriptModuleUrl('lib/public-site/i18n.ts'));
  const { experienceMessages } = await import(await typescriptModuleUrl('lib/public-site/experience-messages.ts'));
  for (const [slug, title] of [['transfert-prive', 'Chauffeur privé'], ['reservations-locales', 'Chef privé']]) {
    const category = experienceCategories.find(item => item.slug === slug);
    assert.ok(category);
    assert.equal(category.possibilities.length, 7, 'Existing choices remain alongside the new service');
    for (const locale of ['fr', 'it', 'en']) {
      const localized = translateDeep(category, locale);
      assert.equal(localized.possibilities[0].title, translate(title, locale));
      assert.ok(localized.possibilities[0].text.length > 50);
    }
  }
  for (const [source, translations] of Object.entries(experienceMessages)) {
    assert.equal(translate(source, 'it'), translations.it);
    assert.equal(translate(translations.it, 'fr'), source);
    assert.equal(translate(translations.it, 'en'), translations.en);
  }
  assert.doesNotMatch(read('data/public-site/experience-categories.ts'), /sans promettre un chauffeur privé|sans vendre un chef privé|gastronomiques coûteuses restent hors/);
});
