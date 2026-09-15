export const CONSENT_KEY = "aurevia-marketing-consent-v1";
export type MarketingChoice = "accepted" | "refused";
export type ConsentRecord = { version: 1; choice: MarketingChoice; savedAt: number; expiresAt: number };

export function createConsent(choice: MarketingChoice, now = Date.now()): ConsentRecord {
  const expiry = new Date(now);
  expiry.setUTCMonth(expiry.getUTCMonth() + 6);
  return { version: 1, choice, savedAt: now, expiresAt: expiry.getTime() };
}

export function parseConsent(raw: string | null, now = Date.now()): ConsentRecord | null {
  try {
    const value = JSON.parse(raw || "null");
    if (!value || value.version !== 1 || !["accepted", "refused"].includes(value.choice)
      || !Number.isFinite(value.savedAt) || !Number.isFinite(value.expiresAt)
      || value.savedAt > now || value.expiresAt <= now
      || value.expiresAt > createConsent(value.choice, value.savedAt).expiresAt) return null;
    return value;
  } catch { return null; }
}

export function readMarketingConsent(): ConsentRecord | null {
  try { return parseConsent(window.localStorage.getItem(CONSENT_KEY)); }
  catch { return null; }
}

export function saveMarketingConsent(choice: MarketingChoice): boolean {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(createConsent(choice)));
    return readMarketingConsent()?.choice === choice;
  } catch { return false; }
}

export function isPublicTrackingPath(path: string): boolean {
  try {
    const decoded = decodeURIComponent(path);
    return decoded.startsWith("/") && !/^\/(administration|connexion|api|auth|_next)(\/|$)/i.test(decoded);
  } catch { return false; }
}
