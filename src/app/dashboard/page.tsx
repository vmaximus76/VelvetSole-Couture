import { auth } from "../../../auth";

export default async function DashboardOverviewPage() {
  const session = await auth();

  return (
    <main className="mx-auto max-w-2xl px-8 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Overview</p>
      <h1 className="mt-2 text-2xl font-light tracking-wide text-neutral-100">
        Welcome, {session?.user?.name ?? session?.user?.email}
      </h1>
      <p className="mt-4 text-sm text-neutral-400">
        Signed in as <span className="text-neutral-200">{session?.user?.email}</span> — role{" "}
        <span className="text-neutral-200">{session?.user?.role}</span>, tenant{" "}
        <span className="text-neutral-200">{session?.user?.tenantId}</span>.
      </p>
    </main>
  );
}
