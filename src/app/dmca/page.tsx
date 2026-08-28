import type { Metadata } from "next";
import { auth } from "../../../auth";
import { SiteNav } from "@/components/site/SiteNav";
import { COMPLIANCE } from "@/config/compliance";

export const metadata: Metadata = {
  title: "DMCA Policy — VelvetSole Couture",
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

const ol: React.CSSProperties = {
  fontFamily: "var(--font-jost), system-ui, sans-serif",
  fontSize: "0.88rem",
  fontWeight: 300,
  lineHeight: 1.78,
  color: "rgba(237,233,228,0.68)",
  paddingLeft: 22,
  marginBottom: 12,
  marginTop: 0,
};

const section: React.CSSProperties = {
  marginBottom: 40,
  paddingBottom: 40,
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

export default async function DmcaPage() {
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
          DMCA / Copyright Policy
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
          <h2 style={h2}>Our Policy</h2>
          <p style={{ ...p, marginBottom: 0 }}>
            VelvetSole Couture respects intellectual property rights and expects users to do the same. We comply with
            the Digital Millennium Copyright Act (17 U.S.C. § 512).
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>Reporting Copyright Infringement</h2>
          <p style={p}>
            If you believe content on this Platform infringes your copyright, send a written notice to our designated
            DMCA agent containing:
          </p>
          <ol style={ol}>
            <li style={{ marginBottom: 8 }}>Your physical or electronic signature (or that of the authorized person)</li>
            <li style={{ marginBottom: 8 }}>Identification of the copyrighted work you claim has been infringed</li>
            <li style={{ marginBottom: 8 }}>Identification of the infringing material and its location on the Platform (URL)</li>
            <li style={{ marginBottom: 8 }}>Your contact information (name, address, telephone, email)</li>
            <li style={{ marginBottom: 8 }}>A statement that you have a good faith belief the use is not authorized by the copyright owner, its agent, or the law</li>
            <li>A statement under penalty of perjury that the information in your notice is accurate and you are authorized to act on behalf of the copyright owner</li>
          </ol>
        </section>

        <section style={section}>
          <h2 style={h2}>DMCA Agent</h2>
          <address style={{
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            fontSize: "0.88rem",
            fontWeight: 300,
            lineHeight: 2,
            color: "rgba(237,233,228,0.68)",
            fontStyle: "normal",
          }}>
            {COMPLIANCE.dmcaAgent.name}<br />
            {COMPLIANCE.dmcaAgent.address}<br />
            {COMPLIANCE.dmcaAgent.email}
          </address>
        </section>

        <section style={section}>
          <h2 style={h2}>Counter-Notification</h2>
          <p style={p}>
            If you believe your content was removed in error, you may send a counter-notification to the DMCA Agent
            containing:
          </p>
          <ol style={ol}>
            <li style={{ marginBottom: 8 }}>Your physical or electronic signature</li>
            <li style={{ marginBottom: 8 }}>Identification of the removed material and its prior location</li>
            <li style={{ marginBottom: 8 }}>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake or misidentification</li>
            <li>Your name, address, telephone number, and consent to jurisdiction in your federal district court</li>
          </ol>
          <p style={{ ...p, marginTop: 12, marginBottom: 0 }}>
            Upon receipt of a valid counter-notice, we will restore the material within 10–14 business days unless the
            original complainant files a court action.
          </p>
        </section>

        <section style={{ marginBottom: 0 }}>
          <h2 style={h2}>Repeat Infringers</h2>
          <p style={{ ...p, marginBottom: 0 }}>
            We will terminate the accounts of users who are determined to be repeat infringers.
          </p>
        </section>
      </main>
    </div>
  );
}
