import type { NextRequest } from "next/server";
import { timingSafeEqual, createHash } from "node:crypto";

function ipToLong(ip: string): number | null {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) {
    return null;
  }
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function ipInCidr(ip: string, cidr: string): boolean {
  const [range, bitsStr] = cidr.split("/");
  const bits = bitsStr ? parseInt(bitsStr, 10) : 32;
  const ipLong = ipToLong(ip);
  const rangeLong = ipToLong(range);
  if (ipLong === null || rangeLong === null) return false;
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipLong & mask) === (rangeLong & mask);
}

function getClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip");
}

function secretMatches(provided: string | null): boolean {
  const expected = process.env.CCBILL_WEBHOOK_SECRET;
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * CCBill's standard/advanced webhooks are not HMAC-signed, so verification
 * relies on (1) a shared secret baked into the webhook URL configured in the
 * CCBill admin panel, e.g. `.../api/webhooks/ccbill?secret=<CCBILL_WEBHOOK_SECRET>`,
 * and (2) an optional IP allowlist. CCBILL_ALLOWED_IPS must be populated from
 * CCBill's currently published webhook IP list — do not trust a hardcoded
 * list here, CCBill can change it without notice.
 */
export function verifyCcbillRequest(req: NextRequest): { ok: boolean; reason?: string } {
  const providedSecret = req.nextUrl.searchParams.get("secret");
  if (!secretMatches(providedSecret)) {
    return { ok: false, reason: "Invalid or missing webhook secret" };
  }

  const allowList = (process.env.CCBILL_ALLOWED_IPS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (allowList.length > 0) {
    const clientIp = getClientIp(req);
    const allowed =
      clientIp !== null &&
      allowList.some((entry) => (entry.includes("/") ? ipInCidr(clientIp, entry) : clientIp === entry));

    if (!allowed) {
      return { ok: false, reason: `IP ${clientIp ?? "unknown"} not in CCBILL_ALLOWED_IPS` };
    }
  }

  return { ok: true };
}

/** Parses CCBill's form-urlencoded or JSON webhook body into a flat param map. */
export async function parseCcbillBody(req: NextRequest): Promise<URLSearchParams> {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = (await req.json()) as Record<string, unknown>;
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(json)) {
      if (value !== undefined && value !== null) params.set(key, String(value));
    }
    return params;
  }

  const text = await req.text();
  return new URLSearchParams(text);
}

/**
 * CCBill's Dynamic Pricing formDigest for a single (non-recurring) billing
 * transaction is MD5(formPrice + formPeriod + currencyCode + salt), values
 * concatenated with no separators, in that exact order. clientAccnum and
 * clientSubacc are NOT part of the hash — they're separate URL parameters —
 * confirmed against CCBill's own SDK examples and third-party integration
 * guides. Getting the field set/order wrong makes CCBill silently reject the
 * digest, so don't change this without re-verifying against current docs.
 */
export function createDynamicPricingDigest({
  formPrice,
  formPeriod,
  currencyCode,
}: {
  formPrice: string;
  formPeriod: number;
  currencyCode: number;
}): string {
  const salt = process.env.CCBILL_DYNAMIC_SALT;
  if (!salt) throw new Error("CCBILL_DYNAMIC_SALT is not configured");

  const raw = `${formPrice}${formPeriod}${currencyCode}${salt}`;
  return createHash("md5").update(raw).digest("hex");
}
