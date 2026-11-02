import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth/session";

export async function GET() {
  if (!(await isAuthenticated())) return new Response("Unauthorized", { status: 401 });
  (await draftMode()).enable();
  redirect("/");
}
