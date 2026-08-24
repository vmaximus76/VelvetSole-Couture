"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "age_verified";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function confirmAge(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}
