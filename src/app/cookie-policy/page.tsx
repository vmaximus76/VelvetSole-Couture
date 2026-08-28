import type { Metadata } from "next";
import { auth } from "../../../auth";
import { SiteNav } from "@/components/site/SiteNav";
import { COMPLIANCE } from "@/config/compliance";

export const metadata: Metadata = {
  title: "Cookie Policy — VelvetSole Couture",
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

export default async function CookiePolicyPage() {
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
          Cookie Policy
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
          <h2 style={h2}>What Are Cookies</h2>
          <p style={{ ...p, marginBottom: 0 }}>
            Cookies are small text files placed on your device when you visit a website. We use cookies and similar
            technologies (local storage, session storage) to operate the Platform.
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>Cookies We Use</h2>

          <h3 style={h3}>Strictly Necessary</h3>
          <ul style={ul}>
            <li style={{ marginBottom: 6 }}>Session cookie — keeps you logged in during your visit</li>
            <li style={{ marginBottom: 6 }}>CSRF token — security cookie preventing cross-site request forgery</li>
            <li>Age-gate cookie — records that you have confirmed your age (expires after session or 30 days)</li>
          </ul>
          <p style={p}>These cookies cannot be turned off without breaking the Platform.</p>

          <h3 style={h3}>Analytics</h3>
          <p style={p}>
            We use anonymized page-view analytics to understand how the Platform is used. No personal information is
            sent to any analytics provider. We do not use Google Analytics or other behavioral tracking services.
          </p>

          <h3 style={h3}>No Advertising Cookies</h3>
          <p style={{ ...p, marginBottom: 0 }}>
            We do not use advertising or tracking cookies. We do not participate in behavioral advertising networks.
          </p>
        </section>

        <section style={{ marginBottom: 0 }}>
          <h2 style={h2}>Managing Cookies</h2>
          <p style={{ ...p, marginBottom: 0 }}>
            You can delete cookies through your browser settings. Disabling strictly necessary cookies will prevent you
            from logging in. We honor &ldquo;Do Not Track&rdquo; browser signals by not loading any optional analytics
            when a DNT header is present.
          </p>
        </section>
      </main>
    </div>
  );
}
