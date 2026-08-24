"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTenant, updateTenantCcbillSubAccount } from "@/app/actions/admin";

interface Tenant {
  id: string;
  brandName: string;
  domain: string;
  ccbillSubAcc: string | null;
}

interface Props {
  mode: "create" | "update";
  tenant?: Tenant;
  trigger: React.ReactNode;
}

export function TenantModal({ mode, tenant, trigger }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [brandName, setBrandName] = useState(tenant?.brandName ?? "");
  const [domain, setDomain] = useState(tenant?.domain ?? "");
  const [ccbillSubAcc, setCcbillSubAcc] = useState(tenant?.ccbillSubAcc ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (mode === "create") {
        await createTenant({ brandName, domain, ccbillSubAcc: ccbillSubAcc || undefined });
      } else if (tenant) {
        await updateTenantCcbillSubAccount({ tenantId: tenant.id, ccbillSubAcc });
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </span>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="w-full max-w-lg border border-zinc-800 bg-zinc-900 p-8 space-y-6">

            {/* Header */}
            <div className="space-y-1">
              <p className="text-[10px] font-montserrat uppercase tracking-[0.4em] text-zinc-500">
                {mode === "create" ? "New Franchisee" : "Update Franchise"}
              </p>
              <h2 className="text-xl font-montserrat font-light text-white">
                {mode === "create" ? "Create Tenant" : tenant?.brandName}
              </h2>
              <div className="h-px w-8 bg-[#7F2A3C]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "create" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-montserrat uppercase tracking-widest text-zinc-500">
                      Brand Name
                    </label>
                    <input
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      required
                      className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white font-opensans focus:border-[#7F2A3C] focus:outline-none transition-colors"
                      placeholder="Velvet Studios"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-montserrat uppercase tracking-widest text-zinc-500">
                      Domain
                    </label>
                    <input
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      required
                      className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white font-opensans focus:border-[#7F2A3C] focus:outline-none transition-colors"
                      placeholder="studio.example.com"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-montserrat uppercase tracking-widest text-zinc-500">
                  CCBill Sub-Account ID
                </label>
                <input
                  value={ccbillSubAcc}
                  onChange={(e) => setCcbillSubAcc(e.target.value)}
                  required={mode === "update"}
                  className="w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white font-montserrat tabular-nums tracking-widest focus:border-[#7F2A3C] focus:outline-none transition-colors"
                  placeholder="0000"
                  maxLength={20}
                />
              </div>

              {error && (
                <p className="text-xs font-opensans text-red-400">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={pending}
                  className="flex-1 py-3 text-xs font-montserrat uppercase tracking-[0.2em] text-white disabled:opacity-40 transition-opacity"
                  style={{ backgroundColor: "#7F2A3C" }}
                >
                  {pending ? "Saving…" : mode === "create" ? "Create Franchisee" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 text-xs font-montserrat uppercase tracking-[0.2em] text-zinc-500 border border-zinc-800 hover:text-zinc-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
