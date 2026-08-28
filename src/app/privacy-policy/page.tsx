import type { Metadata } from "next";
import { auth } from "../../../auth";
import { SiteNav } from "@/components/site/SiteNav";
import { COMPLIANCE } from "@/config/compliance";

export const metadata: Metadata = {
  title: "Privacy Policy — VelvetSole Couture",
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

const h3: React.CSSProperties = {
  fontFamily: "var(--font-jost), system-ui, sans-serif",
  fontSize: "0.78rem",
  fontWeight: 500,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "rgba(237,233,228,0.55)",
  marginBottom: 10,
  marginTop: 20,
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

export default async function PrivacyPolicyPage() {
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
          Privacy Policy
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
          <h2 style={h2}>Who We Are</h2>
          <p style={p}>
            VelvetSole Couture (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates {COMPLIANCE.domain} and
            any associated subdomains (the &ldquo;Platform&rdquo;). This Privacy Policy explains how we collect, use, and
            protect your personal information when you use our Platform.
          </p>
          <p style={{ ...p, marginBottom: 0 }}>
            Privacy contact: {COMPLIANCE.privacyEmail}
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>What We Collect</h2>
          <h3 style={h3}>Information you give us</h3>
          <ul style={ul}>
            <li style={{ marginBottom: 6 }}>Email address and password (account registration)</li>
            <li style={{ marginBottom: 6 }}>Billing information (processed by CCBill — we do not store card numbers)</li>
            <li style={{ marginBottom: 6 }}>Age confirmation (date of birth)</li>
            <li>Communications you send us (support requests, etc.)</li>
          </ul>
          <h3 style={h3}>Information collected automatically</h3>
          <ul style={ul}>
            <li style={{ marginBottom: 6 }}>IP address and approximate location</li>
            <li style={{ marginBottom: 6 }}>Browser type and operating system</li>
            <li style={{ marginBottom: 6 }}>Pages viewed, time on page, click patterns</li>
            <li style={{ marginBottom: 6 }}>Session cookies (see Cookie Policy)</li>
            <li>Device identifiers</li>
          </ul>
          <h3 style={h3}>Information from third parties</h3>
          <ul style={{ ...ul, marginBottom: 0 }}>
            <li style={{ marginBottom: 6 }}>CCBill may share transaction status, subscription state, and chargeback events with us</li>
            <li>We do not purchase or receive data from data brokers</li>
          </ul>
        </section>

        <section style={section}>
          <h2 style={h2}>How We Use Your Information</h2>
          <ul style={ul}>
            <li style={{ marginBottom: 8 }}><strong style={{ color: "#ede9e4", fontWeight: 400 }}>To provide the service:</strong> Account management, AI generation, content delivery, subscription billing</li>
            <li style={{ marginBottom: 8 }}><strong style={{ color: "#ede9e4", fontWeight: 400 }}>To verify your age:</strong> You must be 18 or older. Age data is used solely for verification and is not sold</li>
            <li style={{ marginBottom: 8 }}><strong style={{ color: "#ede9e4", fontWeight: 400 }}>To communicate with you:</strong> Transactional emails (receipts, password resets) and, with your consent, promotional emails</li>
            <li style={{ marginBottom: 8 }}><strong style={{ color: "#ede9e4", fontWeight: 400 }}>To prevent fraud and abuse:</strong> Detecting chargebacks, account sharing, and policy violations</li>
            <li style={{ marginBottom: 8 }}><strong style={{ color: "#ede9e4", fontWeight: 400 }}>To comply with law:</strong> Legal obligations and record-keeping requirements</li>
            <li><strong style={{ color: "#ede9e4", fontWeight: 400 }}>To improve the Platform:</strong> Aggregated, anonymized analytics</li>
          </ul>
          <p style={{ ...p, marginTop: 12, marginBottom: 0 }}>
            We do not use your data to train AI models. We do not sell your personal information.
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>How We Share Your Information</h2>
          <p style={p}>We share data only as follows:</p>
          <ul style={ul}>
            <li style={{ marginBottom: 8 }}><strong style={{ color: "#ede9e4", fontWeight: 400 }}>CCBill:</strong> Payment processing and subscription management. CCBill is the Merchant of Record for all transactions.</li>
            <li style={{ marginBottom: 8 }}><strong style={{ color: "#ede9e4", fontWeight: 400 }}>AWS:</strong> Encrypted image and video storage and delivery. AWS does not access content.</li>
            <li style={{ marginBottom: 8 }}><strong style={{ color: "#ede9e4", fontWeight: 400 }}>Vercel:</strong> Hosting and CDN. Server logs may include IP addresses.</li>
            <li style={{ marginBottom: 8 }}><strong style={{ color: "#ede9e4", fontWeight: 400 }}>Legal requirements:</strong> We will disclose information when required by valid legal process or to protect our legal rights.</li>
            <li><strong style={{ color: "#ede9e4", fontWeight: 400 }}>Business transfers:</strong> In the event of a merger or acquisition, user data may transfer to the successor entity.</li>
          </ul>
          <p style={{ ...p, marginTop: 12, marginBottom: 0 }}>
            We do not share your information with advertisers or sell data to third parties.
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>Data Retention</h2>
          <ul style={{ ...ul, marginBottom: 0 }}>
            <li style={{ marginBottom: 6 }}>Account data is retained as long as your account is active plus 3 years after closure</li>
            <li style={{ marginBottom: 6 }}>Payment transaction records are retained for 7 years for tax and chargeback purposes</li>
            <li>You may request deletion of your account data — see Your Rights below</li>
          </ul>
        </section>

        <section style={section}>
          <h2 style={h2}>Your Rights</h2>
          <p style={p}>Depending on your jurisdiction, you may have the right to:</p>
          <ul style={ul}>
            <li style={{ marginBottom: 6 }}>Access the personal data we hold about you</li>
            <li style={{ marginBottom: 6 }}>Correct inaccurate data</li>
            <li style={{ marginBottom: 6 }}>Request deletion of your data (subject to legal retention requirements)</li>
            <li style={{ marginBottom: 6 }}>Opt out of marketing emails (unsubscribe link in every email)</li>
            <li>Data portability (receive your data in a machine-readable format)</li>
          </ul>
          <p style={{ ...p, marginTop: 12 }}>
            To exercise these rights, email {COMPLIANCE.privacyEmail}. We will respond within 30 days.
          </p>
          <p style={p}>
            <strong style={{ color: "#ede9e4", fontWeight: 400 }}>California residents (CCPA):</strong> You have the right to know what categories of personal
            information we collect, the right to deletion, and the right to opt out of sale. We do not sell personal
            information.
          </p>
          <p style={{ ...p, marginBottom: 0 }}>
            <strong style={{ color: "#ede9e4", fontWeight: 400 }}>EU/UK residents (GDPR):</strong> Our legal basis for processing is contract performance
            (account/subscription), legal obligation, and legitimate interests (fraud prevention). You have the
            right to lodge a complaint with your supervisory authority.
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>Children</h2>
          <p style={{ ...p, marginBottom: 0 }}>
            This Platform is strictly for adults aged 18 and older. We do not knowingly collect information from anyone
            under 18. If you believe a minor has accessed the Platform, contact us immediately at {COMPLIANCE.privacyEmail}.
          </p>
        </section>

        <section style={{ marginBottom: 0 }}>
          <h2 style={h2}>Changes</h2>
          <p style={{ ...p, marginBottom: 0 }}>
            We may update this policy. Material changes will be communicated by email and/or a notice on the Platform
            at least 14 days before taking effect.
          </p>
        </section>
      </main>
    </div>
  );
}
