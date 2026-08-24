import { NextRequest, NextResponse } from "next/server";

const AGE_COOKIE = "age_verified";

// Routes accessible without age verification
const EXEMPT_PREFIXES = [
  "/age-verify",
  "/login",
  "/api/auth",
  "/api/age-verify",
  "/privacy-policy",
  "/terms-of-service",
  "/2257",
  "/dmca",
  "/cookie-policy",
  "/refund-policy",
  "/_next",
  "/favicon",
];

function isExempt(pathname: string): boolean {
  return EXEMPT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Homepage is exempt — marketing page is publicly visible
  if (pathname === "/") return NextResponse.next();

  if (isExempt(pathname)) return NextResponse.next();

  const verified = req.cookies.get(AGE_COOKIE)?.value === "1";
  if (!verified) {
    const redirect = req.nextUrl.clone();
    redirect.pathname = "/age-verify";
    redirect.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirect);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files. The actual exemption logic is
     * handled inside the middleware function above so it's easy to audit.
     */
    "/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|svg|webp|woff2?)).*)",
  ],
};
