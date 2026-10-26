import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "accesssj_admin";

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET);
}

function sameText(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function checkAdminPassword(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!adminConfigured()) return false;
  return sameText(username.trim(), expectedUser) && sameText(password, expectedPassword);
}

export function adminCookieValue(now = Date.now()): string {
  const expires = String(now + 12 * 60 * 60 * 1000);
  const signature = createHmac("sha256", process.env.ADMIN_SECRET ?? "").update(expires).digest("hex");
  return `${expires}.${signature}`;
}

export function adminCookieValid(value: string | undefined, now = Date.now()): boolean {
  if (!value || !process.env.ADMIN_SECRET) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature || Number(expires) < now) return false;
  const expected = createHmac("sha256", process.env.ADMIN_SECRET).update(expires).digest("hex");
  return sameText(signature, expected);
}
