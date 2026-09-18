// Keep Velyo's typography, layout and motion with Aurevia's navy/ivory/gold palette.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import postcss from 'postcss';

export const sourceStyles = ['globals.css', 'velyo.css', 'velyo-headings.css', 'velyo-mobile.css'];
export const sourceDirectory = 'vendor/velyo-styles';
export const publicScope = '[data-aurevia-site]';
const heroGuard = ':where(:not([data-aurevia-original-hero], [data-aurevia-original-hero] *))';
const root = new URL('../', import.meta.url);

export function publicNames(value) {
  return value.replaceAll('VELYO', 'AUREVIA').replaceAll('Velyo', 'AUREVIA').replaceAll('velyo', 'aurevia')
    .replaceAll('/images/', '/images/public-site/')
    .replace(/\/images\/public-site\/brand\/aurevia-logo-[\w-]+\.svg/g, '/images/brand/aurevia-logo-no-tagline.png');
}

export function aureviaColors(value, property = '') {
  const ink = [13, 27, 42];
  const gold = [221, 184, 94];
  const softGold = [242, 214, 148];
  const goldText = gold;
  const warmNeutrals = new Map([
    ['#172033', ink], ['#526074', [89, 97, 106]],
    ['#f5f2eb', [250, 249, 246]], ['#f3efe7', [250, 249, 246]],
    ['#f7fafe', [252, 250, 246]], ['#fbfaf7', [252, 250, 246]],
    ['#f8f6f1', [252, 250, 246]],
  ]);
  const replace = (rgb, isText = false) => {
    const [r, g, b] = rgb;
    if (b <= r + 18 || b <= g + 8) return rgb;
    if (r >= 180) return r >= 224 ? [250, 249, 246] : [234, 231, 221];
    if (r < 65 && b < 145) return ink;
    if ((b - r) / b < (b >= 190 ? .18 : .35)) return rgb; // Preserve neutral reading text, not pale blue accents.
    if (isText) return goldText;
    return r >= 90 ? softGold : gold;
  };
  const semanticText = property === 'color' || property === '--aurevia-watermark-eyebrow-color';
  const textColor = semanticText || /^(--blue|--aurevia-blue)$/.test(property);
  const recolored = value.replace(/#[\da-f]{6}\b/gi, hex => {
    const rgb = hex.slice(1).match(/../g).map(channel => parseInt(channel, 16));
    const next = warmNeutrals.get(hex.toLowerCase()) || replace(rgb, textColor);
    if (next === rgb) return hex;
    // A semantic accent also stays readable in the dark sections below.
    if (semanticText && next === goldText) return 'var(--aurevia-gold-text)';
    return '#' + next.map(channel => channel.toString(16).padStart(2, '0')).join('');
  }).replace(/(rgba?)\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(\s*,\s*[\d.]+)?\s*\)/gi, (full, fn, r, g, b, alpha = '') => {
    const rgb = [Number(r), Number(g), Number(b)];
    const next = replace(rgb, textColor);
    return next === rgb ? full : `${fn}(${next.join(', ')}${alpha})`;
  });
  return semanticText
    ? recolored.replace(/var\(--(?:aurevia-blue(?:-bright)?|blue|soft-blue)\)/g, 'var(--aurevia-gold-text)')
    : recolored;
}

export function protectHero(selector) {
  // Place the exclusion on the element, never after its pseudo-element.
  let depth = 0;
  let quote = '';
  for (let i = 0; i < selector.length; i++) {
    const char = selector[i];
    if (quote) { if (char === quote && selector[i - 1] !== '\\') quote = ''; continue; }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === '(' || char === '[') depth++;
    if (char === ')' || char === ']') depth--;
    if (depth === 0 && char === ':' && /^::|^:(?:before|after|first-letter|first-line)\b/.test(selector.slice(i))) {
      return selector.slice(0, i) + heroGuard + selector.slice(i);
    }
  }
  return selector + heroGuard;
}

export function scopeSelector(selector) {
  // Language belongs to the document; scroll-reveal-ready belongs to the public shell.
  const language = selector.match(/^html(\[lang[^\]]+\])\s+/);
  if (language) return protectHero(`html${language[1]} ${publicScope} ${selector.slice(language[0].length)}`);
  const scoped = /^(?::root|html|body)(?=$|[\s.:#\[])/.test(selector)
    ? selector.replace(/^(?::root|html|body)/, publicScope).replace(`${publicScope} body`, publicScope)
    : `${publicScope} ${selector}`;
  return protectHero(scoped);
}

export function buildVelyoPublicStyles() {
  const tree = postcss.parse(sourceStyles.map(file => readFileSync(new URL(`${sourceDirectory}/${file}`, root), 'utf8')).join('\n'));
  tree.walkAtRules('import', rule => rule.remove());
  const animations = new Map();
  tree.walkAtRules(/keyframes$/, rule => {
    const original = rule.params;
    const isolated = `public-${publicNames(original)}`;
    animations.set(original, isolated);
    rule.params = isolated;
  });
  tree.walkRules(rule => {
    for (let p = rule.parent; p; p = p.parent) if (p.type === 'atrule' && /keyframes$/.test(p.name)) return;
    if (rule.selector.includes('locale-pending')) { rule.remove(); return; }
    rule.selectors = rule.selectors.map(selector => scopeSelector(publicNames(selector)));
  });
  tree.walkDecls(declaration => {
    let value = declaration.value;
    if (/animation/.test(declaration.prop)) {
      for (const [name, isolated] of animations) value = value.replace(new RegExp(`(?<![\\w-])${name}(?![\\w-])`, 'g'), isolated);
    }
    declaration.prop = publicNames(declaration.prop);
    declaration.value = aureviaColors(publicNames(value), declaration.prop);
  });
  return '/* Velyo layout/type/motion with Aurevia colors; public scope only. Run scripts/sync-velyo-public-styles.mjs. */\n' + tree.toString();
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeFileSync(new URL('app/aurevia-public-layouts.css', root), buildVelyoPublicStyles());
  console.log('Synced the four Velyo stylesheets. Original hero and private screens excluded.');
}
