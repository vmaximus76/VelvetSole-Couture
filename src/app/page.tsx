import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950">
      {/* Ambient glow effects */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #881337 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full opacity-10 blur-[100px]"
        style={{ background: "radial-gradient(circle, #881337 0%, transparent 70%)" }}
      />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Navigation */}
      <nav className="absolute top-0 z-10 flex w-full items-center justify-between px-8 py-6 md:px-16">
        <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-500">
          VelvetSole Couture
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="/store"
            className="text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:text-neutral-100"
          >
            Store
          </Link>
          <Link
            href="/login"
            className="text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:text-neutral-100"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex max-w-2xl flex-col items-center px-6 text-center">
        {/* Decorative line */}
        <div className="mb-10 h-px w-16 bg-gradient-to-r from-transparent via-rose-900/60 to-transparent" />

        <p
          className="mb-4 text-[11px] uppercase tracking-[0.4em] text-rose-400/70"
          style={{ animationDelay: "0.1s" }}
        >
          Real Motion · Infinite Skins
        </p>

        <h1 className="text-4xl font-extralight leading-tight tracking-wide text-neutral-100 md:text-6xl md:leading-tight">
          Premium Content,{" "}
          <span className="bg-gradient-to-r from-rose-300 via-rose-400 to-rose-600 bg-clip-text text-transparent">
            Reimagined
          </span>
        </h1>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-neutral-500 md:text-base">
          One session. Infinite variations. AI-powered visual transformation
          that preserves authentic motion and studio-grade quality.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/store"
            id="cta-browse"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-8 text-xs font-medium uppercase tracking-widest text-rose-50 transition-all duration-300"
          >
            <span
              className="absolute inset-0 bg-gradient-to-r from-rose-900 to-rose-800 transition-opacity duration-300 group-hover:opacity-90"
            />
            <span
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)",
              }}
            />
            <span className="relative">Browse Collection</span>
          </Link>

          <Link
            href="/login"
            id="cta-creator"
            className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-800 px-8 text-xs font-medium uppercase tracking-widest text-neutral-400 transition-all duration-300 hover:border-neutral-600 hover:text-neutral-200"
          >
            Creator Access
          </Link>
        </div>

        {/* Trust line */}
        <div className="mt-16 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-neutral-600">
          <span className="h-px w-8 bg-neutral-800" />
          Studio Quality · AI Enhanced · Secure Delivery
          <span className="h-px w-8 bg-neutral-800" />
        </div>
      </main>

      {/* Bottom decorative line */}
      <div className="absolute bottom-12 h-px w-32 bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
    </div>
  );
}
