import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSessionToken, verifySessionToken } from "./token";

export async function createSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, await signSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAuthenticated() {
  // jose's jwtVerify compares exp to Date.now(); wait for a real request so
  // Cache Components doesn't treat that as unstable during prerender.
  await connection();
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** Every admin Server Action and route handler calls this — proxy.ts is only the first gate. */
export async function requireSession() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}
