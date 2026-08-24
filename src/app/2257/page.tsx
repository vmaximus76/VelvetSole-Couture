import type { Metadata } from "next";
import { COMPLIANCE } from "@/config/compliance";

export const metadata: Metadata = {
  title: "18 U.S.C. § 2257 Compliance — VelvetSole Couture",
};

export default function Compliance2257Page() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold">18 U.S.C. § 2257 Record-Keeping Requirements Compliance Statement</h1>

      <section className="space-y-4">
        <p>
          All visual depictions displayed on this website are exempt from the provisions of 18 U.S.C. § 2257 and 28
          C.F.R. 75 because all materials displayed on this site were produced after July 3, 1995.
        </p>
        <p>
          Records required to be maintained pursuant to 18 U.S.C. § 2257 and 28 C.F.R. 75 are kept by the Custodian
          of Records identified below.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Custodian of Records</h2>
        <address className="not-italic space-y-1">
          <p>{COMPLIANCE.custodianOfRecords.name}</p>
          <p>{COMPLIANCE.custodianOfRecords.address}</p>
          <p>{COMPLIANCE.custodianOfRecords.city}, {COMPLIANCE.custodianOfRecords.state} {COMPLIANCE.custodianOfRecords.zip}</p>
          <p>{COMPLIANCE.custodianOfRecords.country}</p>
        </address>
      </section>

      <section className="space-y-4">
        <p>
          All performers depicted on this website were at least 18 years of age at the time of production. All
          performers have provided valid government-issued photo identification confirming their age and identity, which
          records are maintained at the address listed above.
        </p>
        <p>
          For inquiries regarding these records, contact: {COMPLIANCE.complianceEmail}
        </p>
      </section>
    </main>
  );
}
