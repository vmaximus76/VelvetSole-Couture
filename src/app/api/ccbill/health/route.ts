import { NextResponse } from "next/server";
import { createDynamicPricingDigest } from "@/lib/ccbill";

/**
 * Local health-check for the CCBill Dynamic Pricing formDigest.
 * Hit GET /api/ccbill/health to verify the hash output matches what CCBill
 * expects before submitting for merchant underwriting.
 *
 * Example CCBill test values (verify against their documentation):
 *   formPrice: "9.99", formPeriod: 30, currencyCode: 840
 *
 * Never expose this route in production — gate it with a header check.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const testCases = [
    { formPrice: "9.99", formPeriod: 30, currencyCode: 840 },
    { formPrice: "19.99", formPeriod: 30, currencyCode: 840 },
    { formPrice: "49.99", formPeriod: 30, currencyCode: 840 },
  ];

  try {
    const results = testCases.map((tc) => ({
      input: tc,
      formDigest: createDynamicPricingDigest(tc),
      raw: `${tc.formPrice}${tc.formPeriod}${tc.currencyCode}<CCBILL_DYNAMIC_SALT>`,
    }));

    return NextResponse.json({
      ok: true,
      note: "Compare formDigest values against CCBill's test tool or sandbox results.",
      results,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
