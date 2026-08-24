import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth, signOut } from "../../../auth";
import { NavLink } from "@/components/dashboard/nav-link";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const canUpload = session.user.role === "CREATOR" || session.user.role === "ADMIN";

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      <aside className="flex w-60 flex-col justify-between border-r border-neutral-800 px-6 py-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">VelvetSole</p>
          <p className="mt-1 text-sm font-light tracking-wide text-neutral-300">Couture Studio</p>

          <nav className="mt-10 flex flex-col gap-1">
            <NavLink href="/dashboard">Overview</NavLink>
            {canUpload && <NavLink href="/dashboard/upload">Upload Studio</NavLink>}
            {canUpload && <NavLink href="/dashboard/library">Asset Library</NavLink>}
            {canUpload && <NavLink href="/dashboard/inventory">Inventory</NavLink>}
            {canUpload && <NavLink href="/dashboard/generate">AI Generate</NavLink>}
            {session.user.role === "ADMIN" && (
              <NavLink href="/admin/tenants">Franchise</NavLink>
            )}
          </nav>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-md border border-neutral-800 px-3 py-2 text-left text-sm text-neutral-400 transition hover:border-neutral-700 hover:text-neutral-100"
          >
            Sign out
          </button>
        </form>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
