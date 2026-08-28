import type { Metadata } from "next";
import { auth } from "../../../auth";
import { SiteNav } from "@/components/site/SiteNav";
import { COMPLIANCE } from "@/config/compliance";

export const metadata: Metadata = {
  title: "Terms of Service — VelvetSole Couture",
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

export default async function TermsOfServicePage() {
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
          Terms of Service
        </h1>
        <p style={{
          fontFamily: "var(--font-jost), system-ui, sans-serif",
          fontSize: "0.76rem",
          color: "#7e7a84",
          marginBottom: 56,
        }}>
          Last updated {COMPLIANCE.lastUpdated} &nbsp;·&nbsp; Effective {COMPLIANCE.effectiveDate}
        </p>

        <section style={section}>
          <h2 style={h2}>1. Agreement</h2>
          <p style={p}>
            By accessing or using {COMPLIANCE.domain} (&ldquo;Platform&rdquo;), you agree to these Terms of Service
            (&ldquo;Terms&rdquo;). If you do not agree, do not use the Platform. These Terms form a binding legal
            agreement between you and {COMPLIANCE.legalEntityName} (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;).
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>2. Eligibility — Age Requirement</h2>
          <p style={{ ...p, color: "#ede9e4", fontWeight: 400 }}>
            YOU MUST BE AT LEAST 18 YEARS OF AGE TO ACCESS OR USE THIS PLATFORM.
          </p>
          <p style={p}>
            This Platform contains explicit adult content. By accessing it, you represent and warrant that:
          </p>
          <ul style={ul}>
            <li style={{ marginBottom: 6 }}>You are at least 18 years of age (or the age of majority in your jurisdiction, whichever is higher)</li>
            <li style={{ marginBottom: 6 }}>You are not located in a jurisdiction where accessing adult content is illegal</li>
            <li style={{ marginBottom: 6 }}>You are accessing this Platform for personal use, not on behalf of a minor</li>
            <li>Adult content is not illegal in your jurisdiction</li>
          </ul>
          <p style={{ ...p, marginTop: 12 }}>We reserve the right to require age verification at any time.</p>
        </section>

        <section style={section}>
          <h2 style={h2}>3. Account</h2>
          <p style={p}>
            You are responsible for maintaining the confidentiality of your account credentials. You may not share your
            account with others. You must provide accurate registration information. We reserve the right to terminate
            accounts that violate these Terms.
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>4. Subscriptions and Purchases</h2>
          <p style={p}>
            <strong style={{ color: "#ede9e4", fontWeight: 400 }}>Billing:</strong> All transactions are processed by CCBill, an independent payment processor. CCBill
            appears as the Merchant of Record on your billing statement. By purchasing a subscription or clip pack, you
            authorize recurring or one-time charges as described at checkout.
          </p>
          <p style={p}>
            <strong style={{ color: "#ede9e4", fontWeight: 400 }}>Subscription Billing:</strong> Subscriptions renew automatically at the end of each billing period
            until cancelled. You will be notified of price changes in advance.
          </p>
          <p style={p}>
            <strong style={{ color: "#ede9e4", fontWeight: 400 }}>Cancellation:</strong> You may cancel your subscription at any time through your account settings or
            by contacting support. Cancellation stops future charges; access continues until the end of the paid period.
          </p>
          <p style={p}>
            <strong style={{ color: "#ede9e4", fontWeight: 400 }}>Refunds:</strong> See our Refund &amp; Cancellation Policy.
          </p>
          <p style={{ ...p, marginBottom: 0 }}>
            <strong style={{ color: "#ede9e4", fontWeight: 400 }}>Chargebacks:</strong> Filing a chargeback for a transaction you authorized is a violation of these
            Terms and may result in permanent account termination and referral to collections.
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>5. Content License</h2>
          <p style={p}>
            When you purchase a subscription or clip pack, we grant you a limited, non-exclusive, non-transferable,
            personal license to view the content on this Platform. You may not:
          </p>
          <ul style={ul}>
            <li style={{ marginBottom: 6 }}>Download, copy, or redistribute content without explicit written permission</li>
            <li style={{ marginBottom: 6 }}>Resell, sublicense, or commercially exploit any content</li>
            <li style={{ marginBottom: 6 }}>Use content to train AI models</li>
            <li>Remove or alter any watermarks or copyright notices</li>
          </ul>
          <p style={{ ...p, marginTop: 12, marginBottom: 0 }}>
            All content remains the intellectual property of the Company and/or its licensors.
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>6. Prohibited Conduct</h2>
          <p style={p}>You agree not to:</p>
          <ul style={ul}>
            <li style={{ marginBottom: 6 }}>Access the Platform if you are under 18</li>
            <li style={{ marginBottom: 6 }}>Share login credentials with others</li>
            <li style={{ marginBottom: 6 }}>Use automated tools to access, scrape, or download content</li>
            <li style={{ marginBottom: 6 }}>Upload, post, or transmit unlawful, harassing, or infringing content</li>
            <li style={{ marginBottom: 6 }}>Attempt to circumvent any security or access control measures</li>
            <li>Impersonate any person or entity</li>
          </ul>
        </section>

        <section style={section}>
          <h2 style={h2}>7. AI-Generated Content</h2>
          <p style={p}>
            The Platform uses AI processing to generate synthetic foot and leg imagery. All AI-generated content is
            fully synthetic — no real performers are depicted. The Platform does not produce content involving minors
            and all generated subjects are explicitly rendered as adults. You may not prompt the system to generate
            content involving minors, violence, or non-consensual scenarios.
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>8. Disclaimer of Warranties</h2>
          <p style={{ ...p, textTransform: "uppercase", fontSize: "0.78rem", letterSpacing: "0.04em", marginBottom: 0 }}>
            The Platform is provided &ldquo;as is&rdquo; without warranty of any kind. We do not warrant that the
            Platform will be uninterrupted, error-free, or free of viruses. To the fullest extent permitted by law, we
            disclaim all warranties, express or implied.
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>9. Limitation of Liability</h2>
          <p style={{ ...p, textTransform: "uppercase", fontSize: "0.78rem", letterSpacing: "0.04em", marginBottom: 0 }}>
            To the fullest extent permitted by law, the Company shall not be liable for any indirect, incidental,
            special, or consequential damages. Our total liability shall not exceed the amount you paid us in the 12
            months preceding the claim.
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>10. Governing Law</h2>
          <p style={{ ...p, marginBottom: 0 }}>
            These Terms are governed by the laws of {COMPLIANCE.jurisdiction}. Any disputes shall be resolved in the
            courts of {COMPLIANCE.jurisdiction}.
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>11. Changes</h2>
          <p style={{ ...p, marginBottom: 0 }}>
            We may modify these Terms. We will provide at least 14 days&apos; notice of material changes via email or
            Platform notice. Continued use after the effective date constitutes acceptance.
          </p>
        </section>

        <section style={{ marginBottom: 0 }}>
          <h2 style={h2}>12. Contact</h2>
          <p style={{ ...p, marginBottom: 0, lineHeight: 2 }}>
            {COMPLIANCE.businessName}<br />
            {COMPLIANCE.businessAddress}<br />
            {COMPLIANCE.supportEmail}
          </p>
        </section>
      </main>
    </div>
  );
}
