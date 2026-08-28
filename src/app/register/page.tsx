import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "../../../auth";
import { VscLogo } from "@/components/site/VscLogo";

export const metadata = {
  title: "Register — VelvetSole Couture",
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Please enter a valid email and a password of at least 8 characters.",
  mismatch: "Passwords do not match.",
  exists: "An account with that email already exists.",
  tenant: "Registration is unavailable. Please contact support.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const session = await auth();
  if (session?.user) redirect("/store");

  const params = await searchParams;
  const errorMsg = params.error ? (ERROR_MESSAGES[params.error] ?? "Something went wrong. Please try again.") : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#141214",
        backgroundImage: "linear-gradient(138deg, #2b2430 0%, #1c181d 42%, #111012 100%)",
        backgroundAttachment: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
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
            Create Account
          </h1>
          <p style={{ fontSize: "0.83rem", color: "#7e7a84", letterSpacing: "0.03em" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#a06070", textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>

        <div
          style={{
            background: "#1c171d",
            border: "1px solid rgba(117,8,81,0.20)",
            borderRadius: 3,
            padding: "36px 32px",
          }}
        >
          {errorMsg && (
            <div
              style={{
                marginBottom: 20,
                padding: "11px 14px",
                background: "rgba(224,90,90,0.10)",
                border: "1px solid rgba(224,90,90,0.28)",
                borderRadius: 2,
                fontSize: "0.80rem",
                color: "#e08080",
                fontFamily: "var(--font-jost), system-ui, sans-serif",
                lineHeight: 1.5,
              }}
            >
              {errorMsg}
            </div>
          )}
          <RegisterForm />
        </div>

        <p
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: "0.75rem",
            color: "#4a4650",
            lineHeight: 1.6,
          }}
        >
          By creating an account you agree to our{" "}
          <Link href="/terms-of-service" style={{ color: "inherit", textDecoration: "underline" }}>Terms</Link>
          {" "}and{" "}
          <Link href="/privacy-policy" style={{ color: "inherit", textDecoration: "underline" }}>Privacy Policy</Link>.
          You must be 18 or older to register.
        </p>
      </div>
    </main>
  );
}

function RegisterForm() {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    background: "#141214",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 2,
    color: "#ede9e4",
    fontSize: "0.88rem",
    fontFamily: "var(--font-jost), system-ui, sans-serif",
    outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.78rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#7e7a84",
    marginBottom: 8,
    fontFamily: "var(--font-jost), system-ui, sans-serif",
  };

  return (
    <form action="/api/auth/register" method="POST">
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="reg-email" style={labelStyle}>Email</label>
        <input id="reg-email" name="email" type="email" autoComplete="email" required style={inputStyle} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="reg-password" style={labelStyle}>Password</label>
        <input id="reg-password" name="password" type="password" autoComplete="new-password" required style={inputStyle} />
      </div>
      <div style={{ marginBottom: 32 }}>
        <label htmlFor="reg-confirm" style={labelStyle}>Confirm Password</label>
        <input id="reg-confirm" name="confirmPassword" type="password" autoComplete="new-password" required style={inputStyle} />
      </div>
      <button
        type="submit"
        style={{
          width: "100%",
          padding: "13px",
          background: "#750851",
          color: "#ede9e4",
          border: "none",
          borderRadius: 2,
          fontFamily: "var(--font-jost), system-ui, sans-serif",
          fontSize: "0.80rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Create Account
      </button>
    </form>
  );
}
