import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCcbillRequest, parseCcbillBody } from "@/lib/ccbill";

// CCBill event types this handler understands. Exact field names/values are
// configured per-account in the CCBill admin panel under Webhooks — confirm
// against that config before going live, these are the common defaults.
const ACTIVATING_EVENTS = new Set(["NewSaleSuccess", "UpSellSuccess", "RenewalSuccess", "Renewal"]);
const CANCELING_EVENTS = new Set(["Cancellation"]);
const EXPIRING_EVENTS = new Set(["Expiration"]);
const REVOKING_EVENTS = new Set(["Chargeback", "Refund", "Void"]);

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function activateOrRenewSubscription(params: URLSearchParams) {
  const subscriptionId = params.get("subscriptionId");
  if (!subscriptionId) return;

  const tier = params.get("subscriptionTypeId") ?? params.get("tier") ?? "BASIC";
  const nextBillingDate = parseDate(params.get("nextRenewalDate") ?? params.get("recurringDate"));
  // Custom pass-through field set on the CCBill subscription/checkout form so
  // a first-time sale can be mapped back to our internal user record.
  const internalUserId = params.get("userId");

  const existing = await prisma.subscription.findUnique({ where: { ccbillSubscriptionId: subscriptionId } });

  const userId = existing?.userId ?? internalUserId;
  if (!userId) {
    console.error(
      "[ccbill webhook] activating event with no known userId and no existing subscription; needs manual reconciliation",
      { subscriptionId },
    );
    return;
  }

  await prisma.subscription.upsert({
    where: { ccbillSubscriptionId: subscriptionId },
    create: {
      ccbillSubscriptionId: subscriptionId,
      userId,
      status: "ACTIVE",
      tier,
      nextBillingDate,
    },
    update: {
      status: "ACTIVE",
      tier,
      ...(nextBillingDate ? { nextBillingDate } : {}),
    },
  });
}

async function setSubscriptionStatus(subscriptionId: string | null, status: string) {
  if (!subscriptionId) return;
  await prisma.subscription.updateMany({
    where: { ccbillSubscriptionId: subscriptionId },
    data: { status },
  });
}

/**
 * One-time storefront purchases (Product/Purchase) are distinguished from
 * recurring Subscription sales by the presence of the X-productId/X-userId
 * pass-through fields set in createCheckoutLink. ccbillTransactionId is the
 * upsert key so retried webhook deliveries for the same sale don't create
 * duplicate access grants.
 */
async function recordPurchase(params: URLSearchParams, transactionId: string) {
  const userId = params.get("X-userId");
  const productId = params.get("X-productId");

  if (!userId || !productId) {
    console.error(
      "[ccbill webhook] NewSaleSuccess missing X-userId/X-productId; cannot record purchase",
      { transactionId },
    );
    return;
  }

  await prisma.purchase.upsert({
    where: { ccbillTransactionId: transactionId },
    create: { userId, productId, ccbillTransactionId: transactionId },
    update: {},
  });
}

export async function POST(req: NextRequest) {
  const verification = verifyCcbillRequest(req);
  if (!verification.ok) {
    console.warn("[ccbill webhook] rejected:", verification.reason);
    return NextResponse.json({ error: verification.reason }, { status: 401 });
  }

  const params = await parseCcbillBody(req);
  const eventType = params.get("eventType") ?? params.get("event");
  const subscriptionId = params.get("subscriptionId");
  const clientAccnum = params.get("clientAccnum");
  const clientSubacc = params.get("clientSubacc");

  if (!eventType || !subscriptionId) {
    return NextResponse.json({ error: "Missing eventType or subscriptionId" }, { status: 400 });
  }

  // CCBill's own transaction identifier for this specific sale, when present;
  // subscriptionId is a reasonable fallback since it's always populated.
  const transactionId = params.get("transactionId") ?? subscriptionId;

  console.log("[ccbill webhook]", { eventType, clientAccnum, clientSubacc, subscriptionId });

  try {
    if (eventType === "NewSaleSuccess" && params.get("X-productId")) {
      await recordPurchase(params, transactionId);
    } else if (ACTIVATING_EVENTS.has(eventType)) {
      await activateOrRenewSubscription(params);
    } else if (CANCELING_EVENTS.has(eventType)) {
      await setSubscriptionStatus(subscriptionId, "CANCELED");
    } else if (EXPIRING_EVENTS.has(eventType)) {
      await setSubscriptionStatus(subscriptionId, "EXPIRED");
    } else if (REVOKING_EVENTS.has(eventType)) {
      await setSubscriptionStatus(subscriptionId, "REVOKED");
    } else {
      console.warn("[ccbill webhook] unhandled eventType", eventType);
    }
  } catch (err) {
    console.error("[ccbill webhook] handler error", err);
    // Non-200 tells CCBill to retry delivery.
    return NextResponse.json({ error: "Internal error processing webhook" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
