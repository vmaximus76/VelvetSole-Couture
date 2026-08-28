import type { Metadata } from "next";
import { auth } from "../../../auth";
import { SiteNav } from "@/components/site/SiteNav";
import { COMPLIANCE } from "@/config/compliance";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — VelvetSole Couture",
};

const h2: React.CSSProperties = {
  fontFamily: "var(--font-cormorant), Georgia, serif",
  fontSize: "1.30rem",
  fontWeight: 300,
  letterSpacing: "0.04em",
  color: "#ede9e4",
  marginBottom: 14,
  marginTop: 0,
};

const p: React.CSSProperties = {
  fontFamily: "var(--font-jost), system-ui, sans-serif",
  fontSize: "0.88rem",
  fontWeight: 300,
  lineHeight: 1.78,
  color: "rgba(237,233,228,0.68)",
  marginBottom: 12,
  marginTop: 0,
};

const ul: React.CSSProperties = {
  fontFamily: "var(--font-jost), system-ui, sans-serif",
  fontSize: "0.88rem",
  fontWeight: 300,
  lineHeight: 1.78,
  color: "rgba(237,233,228,0.68)",
  paddingLeft: 20,
  marginBottom: 12,
  marginTop: 0,
};

const section: React.CSSProperties = {
  marginBottom: 40,
  paddingBottom: 40,
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

export default async function RefundPolicyPage() {
  const session = await auth();

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#ede9e4" }}>
      <SiteNav session={session} />
      <div style={{ height: 1, background: "#750851" }} />

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 28px 96px" }}>
        <p style={{
          fontFamily: "var(--font-jost), system-ui, sans-serif",
          fontSize: "0.70rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#750851",
          marginBottom: 12,
        }}>
          Legal
        </p>
        <h1 style={{
          fontFamily: "var(--font-cormorant), Georgia, serif",
          fontSize: "clamp(2rem, 5vw, 2.8rem)",
          fontWeight: 300,
          letterSpacing: "0.02em",
          color: "#ede9e4",
          marginBottom: 10,
          marginTop: 0,
        }}>
          Refund &amp; Cancellation Policy
        </h1>
        <p style={{
          fontFamily: "var(--font-jost), system-ui, sans-serif",
          fontSize: "0.76rem",
          color: "#7e7a84",
          marginBottom: 56,
        }}>
          Last updated {COMPLIANCE.lastUpdated}
        </p>

        <section style={section}>
          <h2 style={h2}>Digital Content</h2>
          <p style={{ ...p, marginBottom: 0 }}>
            All purchases on this Platform are for digital content delivered immediately upon payment. Because digital
            content is delivered instantly and cannot be &ldquo;returned,&rdquo; all sales are final except as
            described below.
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>Subscriptions</h2>
          <p style={p}>
            You may cancel a subscription at any time from your account dashboard or by contacting support.
            Cancellation:
          </p>
          <ul style={{ ...ul, marginBottom: 0 }}>
            <li style={{ marginBottom: 6 }}>Stops future automatic billing immediately</li>
            <li style={{ marginBottom: 6 }}>Does not generate a refund for the current billing period</li>
            <li>Maintains your access to content until the end of the paid period</li>
          </ul>
        </section>

        <section style={section}>
          <h2 style={h2}>When We Will Issue Refunds</h2>
          <p style={p}>We will issue a full refund if:</p>
          <ul style={ul}>
            <li style={{ marginBottom: 6 }}>You were charged after a cancellation was confirmed and the charge was in error</li>
            <li style={{ marginBottom: 6 }}>You were billed twice for the same period due to a technical error</li>
            <li>You did not access the Platform or any content after purchase and contact us within 48 hours</li>
          </ul>
          <p style={{ ...p, marginTop: 12 }}>We will issue a partial refund or credit at our discretion if:</p>
          <ul style={{ ...ul, marginBottom: 0 }}>
            <li>A significant technical error prevented you from accessing purchased content for more than 48 hours</li>
          </ul>
        </section>

        <section style={section}>
          <h2 style={h2}>Chargebacks</h2>
          <p style={{ ...p, marginBottom: 0 }}>
            We strongly encourage you to contact us before initiating a chargeback. Unauthorized chargebacks for
            purchases you made violate our Terms of Service and may result in account termination. If a chargeback is
            filed, we may dispute it with documentation of your purchase and access history.
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>How to Request a Refund</h2>
          <p style={p}>Email {COMPLIANCE.supportEmail} with:</p>
          <ul style={ul}>
            <li style={{ marginBottom: 6 }}>Your account email address</li>
            <li style={{ marginBottom: 6 }}>The transaction ID from your CCBill receipt</li>
            <li>The reason for your request</li>
          </ul>
          <p style={{ ...p, marginTop: 12, marginBottom: 0 }}>We will respond within 3 business days.</p>
        </section>

        <section style={{ marginBottom: 0 }}>
          <h2 style={h2}>CCBill</h2>
          <p style={{ ...p, marginBottom: 0 }}>
            All transactions are processed by CCBill. CCBill customer support is also available at their website for
            billing inquiries.
          </p>
        </section>
      </main>
    </div>
  );
}
