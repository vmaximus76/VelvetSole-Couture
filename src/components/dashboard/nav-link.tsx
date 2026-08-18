"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm transition ${
        active
          ? "bg-neutral-900 text-neutral-100"
          : "text-neutral-500 hover:bg-neutral-900/60 hover:text-neutral-200"
      }`}
    >
      {children}
    </Link>
  );
}
