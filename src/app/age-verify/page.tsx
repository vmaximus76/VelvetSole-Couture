"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmAge } from "@/app/actions/age-gate";

function AgeGateCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const raw = searchParams.get("redirect");
  const destination = raw && raw.startsWith("/") ? raw : "/";
  const [pending, setPending] = useState(false);

  async function handleEnter() {
    setPending(true);
    await confirmAge();
    router.push(destination);
  }

  return (
    <div className="w-full max-w-md border border-zinc-800/60 bg-zinc-900 p-10 space-y-8">

      {/* Brand */}
      <p className="text-[10px] font-montserrat uppercase tracking-[0.4em] text-zinc-500">
        VelvetSole Couture
      </p>

      {/* Divider */}
      <div className="h-px w-10 bg-[#7F2A3C]" />

      {/* Heading */}
      <div className="space-y-3">
        <h1 className="text-2xl font-montserrat font-light tracking-wide text-white">
          Adults Only
        </h1>
        <p className="text-sm font-opensans leading-relaxed text-zinc-400">
          This website contains explicit adult content. You must be at least 18 years
          of age to enter.
        </p>
      </div>

      {/* Confirmation points */}
      <ul className="space-y-2 text-xs font-opensans text-zinc-500">
        {[
          "I am at least 18 years of age",
          "Adult content is legal in my jurisdiction",
          "I am accessing this site of my own free will",
        ].map((line) => (
          <li key={line} className="flex items-start gap-2">
            <span className="mt-0.5 text-[#7F2A3C]">—</span>
            {line}
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleEnter}
          disabled={pending}
          className="w-full py-4 text-xs font-montserrat uppercase tracking-[0.2em] text-white transition-opacity duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#7F2A3C" }}
        >
          {pending ? "Entering…" : "Enter — I am 18 or older"}
        </button>

        <div className="flex justify-center">
          <a
            href="https://www.google.com"
            className="text-xs font-opensans text-zinc-600 transition-colors hover:text-zinc-400"
          >
            Exit
          </a>
        </div>
      </div>

      {/* Legal note */}
      <p className="text-[10px] font-opensans leading-relaxed text-zinc-700">
        By clicking Enter you agree to our Terms of Service and Privacy Policy.
      </p>

    </div>
  );
}

export default function AgeVerifyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <Suspense>
        <AgeGateCard />
      </Suspense>
    </main>
  );
}
