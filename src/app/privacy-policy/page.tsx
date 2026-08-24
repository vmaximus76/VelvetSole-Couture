import type { Metadata } from "next";
import { COMPLIANCE } from "@/config/compliance";

export const metadata: Metadata = {
  title: "Privacy Policy — VelvetSole Couture",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last Updated: {COMPLIANCE.lastUpdated}</p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Who We Are</h2>
        <p>
          VelvetSole Couture (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates {COMPLIANCE.domain} and any
          associated subdomains (the &ldquo;Platform&rdquo;). This Privacy Policy explains how we collect, use, and
          protect your personal information when you use our Platform.
        </p>
        <p>
          Our registered contact address is: {COMPLIANCE.businessAddress}
          <br />
          Privacy contact: {COMPLIANCE.privacyEmail}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What We Collect</h2>
        <h3 className="font-medium">Information you give us:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Email address and password (account registration)</li>
          <li>Billing information (processed by CCBill — we do not store card numbers)</li>
          <li>Age verification data (date of birth or ID document)</li>
          <li>Communications you send us (support requests, etc.)</li>
        </ul>
        <h3 className="font-medium">Information collected automatically:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>IP address and approximate location</li>
          <li>Browser type and operating system</li>
          <li>Pages viewed, time on page, click patterns</li>
          <li>Cookies and similar tracking technologies (see Cookie Policy)</li>
          <li>Device identifiers</li>
        </ul>
        <h3 className="font-medium">Information from third parties:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            CCBill may share transaction status, subscription state, and chargeback events with us
          </li>
          <li>We do not purchase or receive data from data brokers</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>To provide the service:</strong> Account management, content delivery, subscription billing
          </li>
          <li>
            <strong>To verify your age:</strong> You must be 18 or older. Age data is used solely for verification and
            is not sold
          </li>
          <li>
            <strong>To communicate with you:</strong> Transactional emails (receipts, password resets), and, with your
            consent, promotional emails
          </li>
          <li>
            <strong>To prevent fraud and abuse:</strong> Detecting chargebacks, account sharing, and policy violations
          </li>
          <li>
            <strong>To comply with law:</strong> Including 18 U.S.C. § 2257 record-keeping requirements
          </li>
          <li>
            <strong>To improve the Platform:</strong> Aggregated, anonymized analytics
          </li>
        </ul>
        <p>We do not use your data to train AI models. We do not sell your personal information.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">How We Share Your Information</h2>
        <p>We share data only as follows:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>CCBill:</strong> Payment processing and subscription management. CCBill is the Merchant of Record
            for all transactions.
          </li>
          <li>
            <strong>AWS:</strong> Encrypted video storage and delivery. AWS does not access content.
          </li>
          <li>
            <strong>Vercel:</strong> Hosting and CDN. Server logs may include IP addresses.
          </li>
          <li>
            <strong>Legal requirements:</strong> We will disclose information when required by valid legal process or to
            protect our legal rights.
          </li>
          <li>
            <strong>Business transfers:</strong> In the event of a merger or acquisition, user data may transfer to the
            successor entity.
          </li>
        </ul>
        <p>We do not share your information with advertisers or sell data to third parties.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Data Retention</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Account data is retained as long as your account is active plus 3 years after closure</li>
          <li>
            18 U.S.C. § 2257 performer records are retained for a minimum of 7 years as required by federal law
          </li>
          <li>Payment transaction records are retained for 7 years for tax and chargeback purposes</li>
          <li>You may request deletion of your account data — see Your Rights below</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Rights</h2>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data (subject to legal retention requirements)</li>
          <li>Opt out of marketing emails (unsubscribe link in every email)</li>
          <li>Data portability (receive your data in a machine-readable format)</li>
        </ul>
        <p>
          To exercise these rights, email {COMPLIANCE.privacyEmail}. We will respond within 30 days.
        </p>
        <p>
          <strong>California residents (CCPA):</strong> You have the right to know what categories of personal
          information we collect, the right to deletion, and the right to opt out of sale. We do not sell personal
          information.
        </p>
        <p>
          <strong>EU/UK residents (GDPR):</strong> Our legal basis for processing is contract performance
          (account/subscription), legal obligation (§ 2257), and legitimate interests (fraud prevention). You have the
          right to lodge a complaint with your supervisory authority.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Children</h2>
        <p>
          This Platform is for adults aged 18 and older only. We do not knowingly collect information from anyone under
          18. If you believe a minor has accessed the Platform, contact us immediately at {COMPLIANCE.privacyEmail}.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Changes</h2>
        <p>
          We may update this policy. Material changes will be communicated by email and/or a notice on the Platform at
          least 14 days before taking effect.
        </p>
      </section>
    </main>
  );
}
