import { cookies } from "next/headers";

const COOKIE_NAME = "aurevia_admin";
const SESSION_DURATION_SECONDS = 60 * 60 * 10;
const INTERNAL_PASSWORD_HASH =
  "100000:XzuFeHAidB7HQDMTYgXvOA==:VGs3PNyh3gC/Dl/OMWUhtMlgyYzHRDiwmEBeWnmNBzk=";

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}

function base64ToBytes(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function hmac(value: string) {
  const secret = process.env.ADMIN_AUTH_SECRET || INTERNAL_PASSWORD_HASH;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return bytesToBase64(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))));
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

export async function verifyAdminPassword(password: string) {
  const stored = process.env.ADMIN_PASSWORD_HASH || INTERNAL_PASSWORD_HASH;
  const [iterationsValue, saltValue, expectedValue] = stored.split(":");
  const iterations = Number(iterationsValue);
  if (!iterations || !saltValue || !expectedValue) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: base64ToBytes(saltValue),
      iterations,
    },
    key,
    256,
  );
  return safeEqual(bytesToBase64(new Uint8Array(derived)), expectedValue);
}

export async function createAdminSessionValue(username: string) {
  const payload = bytesToBase64(
    new TextEncoder().encode(
      JSON.stringify({
        username,
        expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
      }),
    ),
  );
  return `${payload}.${await hmac(payload)}`;
}

export async function getInternalAdminUser() {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature || !safeEqual(await hmac(payload), signature)) return null;
  try {
    const parsed = JSON.parse(new TextDecoder().decode(base64ToBytes(payload))) as {
      username: string;
      expiresAt: number;
    };
    if (parsed.expiresAt < Date.now()) return null;
    return {
      displayName: parsed.username,
      email: process.env.ADMIN_RECOVERY_EMAIL || "administration@aurevia.local",
      fullName: parsed.username,
    };
  } catch {
    return null;
  }
}

export const adminSession = {
  cookieName: COOKIE_NAME,
  maxAge: SESSION_DURATION_SECONDS,
};
