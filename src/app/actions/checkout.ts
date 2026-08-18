"use server";

import { auth } from "../../../auth";
import { createDynamicPricingDigest } from "@/lib/ccbill";

const CCBILL_DYNAMIC_PRICING_URL =
  process.env.CCBILL_DYNAMIC_PRICING_URL || "https://api.ccbill.com/wa/faces/inputs/process.xhtml";

const CURRENCY_CODE_USD = 840;
const FORM_PERIOD_DAYS = 30;

/**
 * Builds a CCBill Dynamic Pricing checkout URL for a one-time purchase.
 * priceCents is the final amount to charge (subtotal + tax, not just the
 * catalog subtotal) — whatever the buyer is shown as the total.
 */
export async function createCheckoutLink(productId: string, priceCents: number): Promise<string> {
  // The buyer's identity is read from their own server-side session, never
  // accepted as a client-supplied argument — otherwise a tampered request
  // could attribute the purchase to a different account than the one paying.
  const session = await auth();
  if (!session?.user) {
    throw new Error("AUTH_REQUIRED");
  }

  const clientAccnum = process.env.CCBILL_CLIENT_ACCOUNT;
  const clientSubacc = process.env.CCBILL_CLIENT_SUBACCOUNT;
  if (!clientAccnum || !clientSubacc) {
    throw new Error("CCBill client account is not configured");
  }

  const formPrice = (priceCents / 100).toFixed(2);
  const formDigest = createDynamicPricingDigest({
    formPrice,
    formPeriod: FORM_PERIOD_DAYS,
    currencyCode: CURRENCY_CODE_USD,
  });

  const url = new URL(CCBILL_DYNAMIC_PRICING_URL);
  url.searchParams.set("clientAccnum", clientAccnum);
  url.searchParams.set("clientSubacc", clientSubacc);
  url.searchParams.set("formPrice", formPrice);
  url.searchParams.set("formPeriod", String(FORM_PERIOD_DAYS));
  url.searchParams.set("currencyCode", String(CURRENCY_CODE_USD));
  url.searchParams.set("formDigest", formDigest);
  // X- prefix required for CCBill to echo custom fields back in the webhook.
  url.searchParams.set("X-productId", productId);
  url.searchParams.set("X-userId", session.user.id);

  return url.toString();
}
