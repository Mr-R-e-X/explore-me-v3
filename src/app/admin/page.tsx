import { Suspense } from "react";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { requireSession } from "@/lib/auth/session";
import { getAdminState } from "@/lib/content/admin";
import { isDbConfigured } from "@/lib/db/mongo";

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-muted">Loading editor…</p>}>
      <Editor />
    </Suspense>
  );
}

async function Editor() {
  await requireSession();
  if (!isDbConfigured()) {
    return (
      <p className="p-8 text-sm text-muted">
        Set <code>MONGODB_URI</code> to enable the editor.
      </p>
    );
  }
  return <ContentEditor initial={await getAdminState()} />;
}
