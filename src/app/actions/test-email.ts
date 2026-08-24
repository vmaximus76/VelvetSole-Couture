"use server";

import { auth } from "../../../auth";
import { sendVerificationEmail } from "@/lib/email";

export async function sendTestEmail(): Promise<{ ok: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.email) return { ok: false, message: "Not authenticated" };

  try {
    await sendVerificationEmail(
      session.user.email,
      `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/login`,
    );
    return { ok: true, message: `Test email sent to ${session.user.email}` };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Failed" };
  }
}
