import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="content" className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="label">Error 404 · Sheet missing</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">This page isn&apos;t on the blueprint.</h1>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-on-accent"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
