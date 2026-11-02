import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** Every admin Server Action and route handler calls this — proxy.ts is only the first gate. */
export async function requireSession() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}
