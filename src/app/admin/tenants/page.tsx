import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { listTenants } from "@/app/actions/admin";
import { TenantModal } from "@/components/admin/tenant-modal";

export const metadata = { title: "Franchise Admin — VelvetSole Couture" };

export default async function TenantsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

  const tenants = await listTenants();

  return (
    <div className="min-h-screen bg-zinc-950 px-8 py-12">
      <div className="mx-auto max-w-5xl space-y-10">

        {/* Header */}
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <p className="text-[10px] font-montserrat uppercase tracking-[0.4em] text-zinc-500">
              Master Control
            </p>
            <h1 className="text-2xl font-montserrat font-light tracking-wide text-white">
              Franchise Network
            </h1>
            <div className="h-px w-10" style={{ backgroundColor: "#7F2A3C" }} />
          </div>

          <TenantModal
            mode="create"
            trigger={
              <button
                className="px-6 py-3 text-xs font-montserrat uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#7F2A3C" }}
              >
                + Add Franchisee
              </button>
            }
          />
        </div>

        {/* Table */}
        {tenants.length === 0 ? (
          <p className="text-sm font-opensans text-zinc-600">No franchisees yet.</p>
        ) : (
          <div className="border border-zinc-800">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_1fr_140px_80px_96px] border-b border-zinc-800 px-6 py-3">
              {["Brand", "Domain", "CCBill Sub-Acc", "Sites", ""].map((h) => (
                <span key={h} className="text-[10px] font-montserrat uppercase tracking-widest text-zinc-600">
                  {h}
                </span>
              ))}
            </div>

            {tenants.map((tenant, i) => (
              <div
                key={tenant.id}
                className={`grid grid-cols-[1fr_1fr_140px_80px_96px] items-center px-6 py-4 transition-colors hover:bg-zinc-900/50 ${
                  i < tenants.length - 1 ? "border-b border-zinc-800/60" : ""
                }`}
              >
                <span className="text-sm font-montserrat text-white">{tenant.brandName}</span>

                <span className="text-sm font-opensans text-zinc-400">{tenant.domain}</span>

                <span className="font-montserrat text-sm tabular-nums tracking-widest">
                  {tenant.ccbillSubAcc ? (
                    <span style={{ color: "#7F2A3C" }}>{tenant.ccbillSubAcc}</span>
                  ) : (
                    <span className="text-zinc-700">—</span>
                  )}
                </span>

                <span className="text-xs font-opensans text-zinc-500">
                  {tenant._count.products} products
                </span>

                <TenantModal
                  mode="update"
                  tenant={tenant}
                  trigger={
                    <button className="text-[10px] font-montserrat uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                      Edit
                    </button>
                  }
                />
              </div>
            ))}
          </div>
        )}

        {/* Stats footer */}
        <p className="text-[10px] font-opensans text-zinc-700">
          {tenants.length} franchise{tenants.length !== 1 ? "s" : ""} in network
        </p>
      </div>
    </div>
  );
}
