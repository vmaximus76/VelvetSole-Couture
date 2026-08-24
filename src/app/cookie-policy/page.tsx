import type { Metadata } from "next";
import { COMPLIANCE } from "@/config/compliance";

export const metadata: Metadata = {
  title: "Cookie Policy — VelvetSole Couture",
};

export default function CookiePolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      <h1 className="text-3xl font-bold">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground">Last Updated: {COMPLIANCE.lastUpdated}</p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What Are Cookies</h2>
        <p>
          Cookies are small text files placed on your device when you visit a website. We use cookies and similar
          technologies (local storage, session storage) to operate the Platform.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Cookies We Use</h2>

        <h3 className="font-medium">Strictly Necessary</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Session cookie — keeps you logged in during your visit</li>
          <li>CSRF token — security cookie preventing cross-site request forgery</li>
          <li>
            Age-gate cookie — records that you have confirmed your age (expires after session or 30 days)
          </li>
        </ul>
        <p className="text-sm">These cookies cannot be turned off without breaking the Platform.</p>

        <h3 className="font-medium">Analytics</h3>
        <p>
          We use anonymized page view analytics to understand how the Platform is used. No personal information is sent
          to any analytics provider. We do not use Google Analytics or other behavioral tracking services.
        </p>

        <h3 className="font-medium">No Advertising Cookies</h3>
        <p>
          We do not use advertising or tracking cookies. We do not participate in behavioral advertising networks.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Managing Cookies</h2>
        <p>
          You can delete cookies through your browser settings. Disabling strictly necessary cookies will prevent you
          from logging in. We honor &ldquo;Do Not Track&rdquo; browser signals by not loading any optional analytics
          when a DNT header is present.
        </p>
      </section>
    </main>
  );
}
