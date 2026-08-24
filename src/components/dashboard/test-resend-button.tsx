"use client";

import { useState } from "react";
import { sendTestEmail } from "@/app/actions/test-email";

export function TestResendButton() {
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    setStatus(null);
    const result = await sendTestEmail();
    setStatus(result);
    setPending(false);
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleClick}
        disabled={pending}
        className="px-5 py-2.5 text-[10px] font-montserrat uppercase tracking-[0.25em] border disabled:opacity-40 transition-colors"
        style={{ borderColor: "#7F2A3C", color: "#7F2A3C" }}
      >
        {pending ? "Sending…" : "Test Resend"}
      </button>
      {status && (
        <span className={`text-xs font-opensans ${status.ok ? "text-emerald-400" : "text-red-400"}`}>
          {status.message}
        </span>
      )}
    </div>
  );
}
