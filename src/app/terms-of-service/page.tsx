import type { Metadata } from "next";
import { COMPLIANCE } from "@/config/compliance";

export const metadata: Metadata = {
  title: "Terms of Service — VelvetSole Couture",
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-sm text-muted-foreground">Last Updated: {COMPLIANCE.lastUpdated} &nbsp;|&nbsp; Effective Date: {COMPLIANCE.effectiveDate}</p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Agreement</h2>
        <p>
          By accessing or using {COMPLIANCE.domain} (&ldquo;Platform&rdquo;), you agree to these Terms of Service
          (&ldquo;Terms&rdquo;). If you do not agree, do not use the Platform. These Terms form a binding legal
          agreement between you and {COMPLIANCE.legalEntityName} (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Eligibility — Age Requirement</h2>
        <p className="font-semibold">
          YOU MUST BE AT LEAST 18 YEARS OF AGE TO ACCESS OR USE THIS PLATFORM.
        </p>
        <p>
          This Platform contains explicit adult content. By accessing it, you represent and warrant that:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            You are at least 18 years of age (or the age of majority in your jurisdiction, whichever is higher)
          </li>
          <li>You are not located in a jurisdiction where accessing adult content is illegal</li>
          <li>You are accessing this Platform for personal use, not on behalf of a minor</li>
          <li>Adult content is not illegal in your jurisdiction</li>
        </ul>
        <p>We reserve the right to require age verification at any time.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Account</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials. You may not share your
          account with others. You must provide accurate registration information. We reserve the right to terminate
          accounts that violate these Terms.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Subscriptions and Purchases</h2>
        <p>
          <strong>Billing:</strong> All transactions are processed by CCBill, an independent payment processor. CCBill
          appears as the Merchant of Record on your billing statement. By purchasing a subscription or clip pack, you
          authorize recurring or one-time charges as described at checkout.
        </p>
        <p>
          <strong>Subscription Billing:</strong> Subscriptions renew automatically at the end of each billing period
          until cancelled. You will be notified of price changes in advance.
        </p>
        <p>
          <strong>Cancellation:</strong> You may cancel your subscription at any time through your account settings or
          by contacting support. Cancellation stops future charges. Access continues until the end of the paid period.
        </p>
        <p>
          <strong>Refunds:</strong> See our Refund &amp; Cancellation Policy.
        </p>
        <p>
          <strong>Chargebacks:</strong> Filing a chargeback for a transaction you authorized is a violation of these
          Terms and may result in permanent account termination and referral to collections.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Content License</h2>
        <p>
          When you purchase a subscription or clip pack, we grant you a limited, non-exclusive, non-transferable,
          personal license to view the content on this Platform. You may not:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Download, copy, or redistribute content without explicit written permission</li>
          <li>Resell, sublicense, or commercially exploit any content</li>
          <li>Use content to train AI models</li>
          <li>Remove or alter any watermarks or copyright notices</li>
        </ul>
        <p>
          All content remains the intellectual property of the Company and/or its licensors.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">6. Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Access the Platform if you are under 18</li>
          <li>Share login credentials with others</li>
          <li>Use automated tools to access, scrape, or download content</li>
          <li>Upload, post, or transmit unlawful, harassing, or infringing content</li>
          <li>Attempt to circumvent any security or access control measures</li>
          <li>Impersonate any person or entity</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">7. AI-Generated Content</h2>
        <p>
          The Platform uses AI processing to modify base footage. All underlying base footage is produced with adult
          performers who have provided written consent and age verification in accordance with 18 U.S.C. § 2257. AI
          modifications alter appearance only; the underlying performance is from a verified adult performer.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">8. Disclaimer of Warranties</h2>
        <p className="uppercase text-sm">
          The Platform is provided &ldquo;as is&rdquo; without warranty of any kind. We do not warrant that the
          Platform will be uninterrupted, error-free, or free of viruses. To the fullest extent permitted by law, we
          disclaim all warranties, express or implied.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">9. Limitation of Liability</h2>
        <p className="uppercase text-sm">
          To the fullest extent permitted by law, the Company shall not be liable for any indirect, incidental,
          special, or consequential damages. Our total liability shall not exceed the amount you paid us in the 12
          months preceding the claim.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">10. Governing Law</h2>
        <p>
          These Terms are governed by the laws of {COMPLIANCE.jurisdiction}. Any disputes shall be resolved in the courts of
          {COMPLIANCE.jurisdiction}.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">11. Changes</h2>
        <p>
          We may modify these Terms. We will provide at least 14 days&apos; notice of material changes via email or
          Platform notice. Continued use after the effective date constitutes acceptance.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">12. Contact</h2>
        <p>
          {COMPLIANCE.businessName}
          <br />
          {COMPLIANCE.businessAddress}
          <br />
          {COMPLIANCE.supportEmail}
        </p>
      </section>
    </main>
  );
}
