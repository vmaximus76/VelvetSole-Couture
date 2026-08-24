import type { Metadata } from "next";
import { COMPLIANCE } from "@/config/compliance";

export const metadata: Metadata = {
  title: "DMCA / Copyright Policy — VelvetSole Couture",
};

export default function DmcaPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold">DMCA / Copyright Policy</h1>
      <p className="text-sm text-muted-foreground">Last Updated: {COMPLIANCE.lastUpdated}</p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Our Policy</h2>
        <p>
          VelvetSole Couture respects intellectual property rights and expects users to do the same. We comply with the
          Digital Millennium Copyright Act (17 U.S.C. § 512).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Reporting Copyright Infringement</h2>
        <p>
          If you believe content on this Platform infringes your copyright, send a written notice to our designated
          DMCA agent containing:
        </p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Your physical or electronic signature (or that of the authorized person)</li>
          <li>Identification of the copyrighted work you claim has been infringed</li>
          <li>
            Identification of the infringing material and its location on the Platform (URL)
          </li>
          <li>Your contact information (name, address, telephone, email)</li>
          <li>
            A statement that you have a good faith belief the use is not authorized by the copyright owner, its agent,
            or the law
          </li>
          <li>
            A statement under penalty of perjury that the information in your notice is accurate and you are authorized
            to act on behalf of the copyright owner
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">DMCA Agent</h2>
        <address className="not-italic space-y-1">
          <p>{COMPLIANCE.dmcaAgent.name}</p>
          <p>{COMPLIANCE.dmcaAgent.address}</p>
          <p>{COMPLIANCE.dmcaAgent.email}</p>
        </address>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Counter-Notification</h2>
        <p>
          If you believe your content was removed in error, you may send a counter-notification to the DMCA Agent
          containing:
        </p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Your physical or electronic signature</li>
          <li>Identification of the removed material and its prior location</li>
          <li>
            A statement under penalty of perjury that you have a good faith belief the material was removed by mistake
            or misidentification
          </li>
          <li>
            Your name, address, telephone number, and consent to jurisdiction in your federal district court
          </li>
        </ol>
        <p>
          Upon receipt of a valid counter-notice, we will restore the material within 10–14 business days unless the
          original complainant files a court action.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Repeat Infringers</h2>
        <p>
          We will terminate the accounts of users who are determined to be repeat infringers.
        </p>
      </section>
    </main>
  );
}
