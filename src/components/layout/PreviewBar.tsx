import Link from "next/link";

// Shown on the public page only while draft mode is on.
export function PreviewBar() {
  return (
    <div
      role="status"
      className="sticky top-0 z-50 flex items-center justify-center gap-4 bg-ink px-4 py-2 font-mono text-xs text-paper"
    >
      <span>Preview of unpublished draft</span>
      <a href="/api/preview/exit" className="underline underline-offset-4">
        Exit preview
      </a>
      <Link href="/admin" className="underline underline-offset-4">
        Back to admin
      </Link>
    </div>
  );
}
