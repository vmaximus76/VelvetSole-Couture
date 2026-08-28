import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "../../../auth";
import { LoginForm } from "@/components/auth/login-form";
import { VscLogo } from "@/components/site/VscLogo";

export const metadata = {
  title: "Sign In — VelvetSole Couture",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; registered?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/generate");

  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/store";
  const justRegistered = params.registered === "1";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link href="/" style={{ display: "inline-block", marginBottom: 28 }}>
            <VscLogo height={56} />
          </Link>
          <h1
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 300,
              fontSize: "1.7rem",
              letterSpacing: "0.04em",
              color: "#ede9e4",
              marginBottom: 8,
            }}
          >
            Welcome Back
          </h1>
          <p style={{ fontSize: "0.83rem", color: "#7e7a84", letterSpacing: "0.03em" }}>
            New here?{" "}
            <Link href="/register" style={{ color: "#a06070", textDecoration: "none" }}>
              Create an account
            </Link>
          </p>
        </div>

        {justRegistered && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 16px",
              background: "rgba(76,175,130,0.10)",
              border: "1px solid rgba(76,175,130,0.28)",
              borderRadius: 2,
              fontSize: "0.80rem",
              color: "#6ec9a0",
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            Account created — please sign in.
          </div>
        )}
        <div
          style={{
            background: "#141414",
            border: "1px solid rgba(117,8,81,0.20)",
            borderRadius: 3,
            padding: "36px 32px",
          }}
        >
          <LoginForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </main>
  );
}
