"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { createCheckoutLink } from "@/app/actions/checkout";

// Placeholder flat rate until real tax calculation is wired up (e.g. via CCBill or a tax service).
const MOCK_TAX_RATE = 0.08;

export function CheckoutPanel({
  productId,
  title,
  priceCents,
}: {
  productId: string;
  title: string;
  priceCents: number;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  const taxCents = Math.round(priceCents * MOCK_TAX_RATE);
  const totalCents = priceCents + taxCents;

  const handleCheckout = async () => {
    setError(null);
    setNeedsAuth(false);
    setLoading(true);
    try {
      // Charge the total shown to the buyer (subtotal + tax), not just the catalog subtotal.
      const url = await createCheckoutLink(productId, totalCents);
      window.location.href = url;
    } catch (err) {
      if (err instanceof Error && err.message === "AUTH_REQUIRED") {
        setNeedsAuth(true);
      } else {
        setError(err instanceof Error ? err.message : "Could not start checkout. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <Card className="border-neutral-800 bg-neutral-950">
      <CardContent className="space-y-4 pt-6">
        <p className="sr-only">{title}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Subtotal</span>
          <span className="text-neutral-200">{formatPrice(priceCents)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Tax</span>
          <span className="text-neutral-200">{formatPrice(taxCents)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-neutral-800 pt-4 text-sm">
          <span className="text-neutral-300">Total</span>
          <span className="text-base text-neutral-100">{formatPrice(totalCents)}</span>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {needsAuth ? (
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
            className={buttonVariants({ className: "w-full" })}
          >
            Sign in to checkout
          </Link>
        ) : (
          <Button onClick={handleCheckout} disabled={loading} className="w-full">
            {loading ? "Redirecting…" : "Secure Checkout"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
