import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

// Outside /api/admin on purpose: leaving preview must work even after the session expires.
export async function GET() {
  (await draftMode()).disable();
  redirect("/");
}
