import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin login" };

export default function LoginPage() {
  return (
    <main id="content" className="grid min-h-dvh place-items-center px-4">
      <div className="bp-frame w-full max-w-sm p-8">
        <p className="label">Portfolio admin</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
