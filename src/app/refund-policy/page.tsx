import type { Metadata } from "next";
import { COMPLIANCE } from "@/config/compliance";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — VelvetSole Couture",
};

export default function RefundPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold">Refund &amp; Cancellation Policy</h1>
      <p className="text-sm text-muted-foreground">Last Updated: {COMPLIANCE.lastUpdated}</p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Digital Content</h2>
        <p>
          All purchases on this Platform are for digital content delivered immediately upon payment. Because digital
          content is delivered instantly and cannot be &ldquo;returned,&rdquo; all sales are final except as described
          below.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Subscriptions</h2>
        <p>
          You may cancel a subscription at any time from your account dashboard or by contacting support.
          Cancellation:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Stops future automatic billing immediately</li>
          <li>Does not generate a refund for the current billing period</li>
          <li>Maintains your access to content until the end of the paid period</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">When We Will Issue Refunds</h2>
        <p>We will issue a full refund if:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>You were charged after a cancellation was confirmed and the charge was in error</li>
          <li>You were billed twice for the same period due to a technical error</li>
          <li>
            You did not access the Platform or any content after purchase and contact us within 48 hours
          </li>
        </ul>
        <p>We will issue a partial refund or credit at our discretion if:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            A significant technical error prevented you from accessing purchased content for more than 48 hours
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Chargebacks</h2>
        <p>
          We strongly encourage you to contact us before initiating a chargeback. Unauthorized chargebacks for
          purchases you made violate our Terms of Service and may result in account termination. If a chargeback is
          filed, we may dispute it with documentation of your purchase and access history.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">How to Request a Refund</h2>
        <p>Email {COMPLIANCE.supportEmail} with:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Your account email address</li>
          <li>The transaction ID from your CCBill receipt</li>
          <li>The reason for your request</li>
        </ul>
        <p>We will respond within 3 business days.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">CCBill</h2>
        <p>
          All transactions are processed by CCBill. CCBill customer support is also available at their website for
          billing inquiries.
        </p>
      </section>
    </main>
  );
}
