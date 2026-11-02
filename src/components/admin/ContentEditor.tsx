"use client";

import { ExternalLink, FileText, LogOut, RotateCcw, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  discardDraft,
  logout,
  publish,
  restoreRevision,
  saveDraft,
  uploadMedia,
  type Result,
} from "@/app/admin/actions";
import type { AdminState } from "@/lib/content/admin";
import { siteContentSchema, type SiteContent } from "@/lib/content/schema";
import { EditorContext, pathKey, setAt, useField, type Path } from "./editor-context";
import { TextField } from "./fields";
import {
  AboutPanel,
  ExperiencePanel,
  Panel,
  ProfilePanel,
  ProjectsPanel,
  SectionsPanel,
  SeoPanel,
  SkillsPanel,
  WorkPanel,
} from "./panels";

const sections = [
  { id: "profile", label: "Profile", Component: ProfilePanel },
  { id: "about", label: "About", Component: AboutPanel },
  { id: "experience", label: "Experience", Component: ExperiencePanel },
  { id: "projects", label: "Projects", Component: ProjectsPanel },
  { id: "work", label: "Production work", Component: WorkPanel },
  { id: "skills", label: "Skills", Component: SkillsPanel },
  { id: "sections", label: "Sections & contact", Component: SectionsPanel },
  { id: "seo", label: "SEO", Component: SeoPanel },
  { id: "media", label: "Photo & resume", Component: MediaPanel },
  { id: "history", label: "History", Component: null },
] as const;

type SectionId = (typeof sections)[number]["id"];

function toErrors(content: SiteContent) {
  const parsed = siteContentSchema.safeParse(content);
  if (parsed.success) return {};
  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) errors[pathKey(issue.path as Path)] ??= issue.message;
  return errors;
}

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

export function ContentEditor({ initial }: { initial: AdminState }) {
  const [state, setState] = useState(initial);
  const [content, setContent] = useState(initial.content);
  const [dirty, setDirty] = useState(false);
  // Bumped whenever content is replaced from the server, to remount the fields.
  const [generation, setGeneration] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [active, setActive] = useState<SectionId>("profile");
  const [pending, startTransition] = useTransition();

  const set = useCallback((path: Path, value: unknown) => {
    setContent((c) => setAt(c, path, value));
    setDirty(true);
  }, []);

  // Once a save has failed validation, errors update live as fields are fixed.
  const errors = useMemo(() => (showErrors ? toErrors(content) : {}), [showErrors, content]);
  const ctx = useMemo(() => ({ content, set, errors }), [content, set, errors]);

  function run(
    action: () => Promise<Result<AdminState>>,
    success: string,
    opts?: { validate?: boolean; remount?: boolean },
  ) {
    if (opts?.validate) {
      const found = toErrors(content);
      setShowErrors(true);
      if (Object.keys(found).length) {
        setNotice({ kind: "error", text: `Fix ${Object.keys(found).length} field(s) before saving.` });
        return Promise.resolve(false);
      }
    }
    return new Promise<boolean>((resolve) =>
      startTransition(async () => {
        const res = await action();
        if (res.ok) {
          setState(res.data);
          setContent(res.data.content);
          if (opts?.remount) setGeneration((g) => g + 1);
          setShowErrors(false);
          setDirty(false);
          setNotice({ kind: "ok", text: success });
        } else {
          setNotice({ kind: "error", text: res.error });
        }
        resolve(res.ok);
      }),
    );
  }

  const onSave = () => run(() => saveDraft(content), "Draft saved.", { validate: true });
  const onPublish = () => run(() => publish(content), "Published — the live site is updated.", { validate: true });
  const onPreview = async () => {
    const ok = dirty || !state.hasDraft ? await onSave() : true;
    if (ok) window.open("/api/admin/preview", "_blank", "noopener");
  };
  const onDiscard = () => {
    if (confirm("Discard the draft and go back to the published content?")) {
      run(() => discardDraft(), "Draft discarded.", { remount: true });
    }
  };

  // Ctrl/Cmd+S saves the draft; warn before leaving with unsaved edits.
  const saveRef = useRef(onSave);
  useEffect(() => {
    saveRef.current = onSave;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current();
      }
    };
    const onUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [dirty]);

  const Active = sections.find((s) => s.id === active)?.Component;
  const status = dirty
    ? "Unsaved changes"
    : state.hasDraft
      ? `Draft saved ${fmt(state.draftSavedAt)} · not published`
      : `Published v${state.publishedVersion} · ${fmt(state.publishedAt)}`;

  return (
    <EditorContext.Provider value={ctx}>
      <div className="min-h-dvh bg-paper">
        <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
            <div className="mr-auto">
              <p className="label">Portfolio admin</p>
              <p className="text-sm text-muted" role="status" aria-live="polite">
                {status}
              </p>
            </div>
            <button type="button" onClick={onSave} disabled={pending} className={btn.secondary}>
              Save draft
            </button>
            <button type="button" onClick={onPreview} disabled={pending} className={btn.secondary}>
              <ExternalLink className="size-4" aria-hidden="true" /> Preview
            </button>
            {state.hasDraft && (
              <button type="button" onClick={onDiscard} disabled={pending} className={btn.ghost}>
                Discard draft
              </button>
            )}
            <button type="button" onClick={onPublish} disabled={pending} className={btn.primary}>
              {pending ? "Working…" : "Publish"}
            </button>
            <form action={logout}>
              <button type="submit" aria-label="Log out" className={btn.icon}>
                <LogOut className="size-4" aria-hidden="true" />
              </button>
            </form>
          </div>
          {notice && (
            <div
              role="alert"
              className={`border-t px-4 py-2 text-center text-sm ${
                notice.kind === "ok"
                  ? "border-line bg-accent-soft text-accent-ink"
                  : "border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
              }`}
            >
              {notice.text}
            </div>
          )}
        </header>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[13rem_1fr]">
          <nav aria-label="Content sections" className="md:sticky md:top-28 md:self-start">
            <ul className="flex gap-1 overflow-x-auto md:flex-col">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    aria-current={active === s.id ? "page" : undefined}
                    onClick={() => setActive(s.id)}
                    className={`w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      active === s.id ? "bg-accent-soft font-medium text-accent-ink" : "text-muted hover:bg-surface hover:text-ink"
                    }`}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <main className="bp-frame min-w-0 p-5 sm:p-8">
            {Active ? (
              <Active key={generation} />
            ) : (
              <HistoryPanel
                state={state}
                pending={pending}
                onRestore={(id) =>
                  run(() => restoreRevision(id), "Revision loaded into the draft — review, then publish.", {
                    remount: true,
                  })
                }
              />
            )}
          </main>
        </div>
      </div>
    </EditorContext.Provider>
  );
}

const btn = {
  primary:
    "inline-flex min-h-10 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-on-accent hover:opacity-90 disabled:opacity-60",
  secondary:
    "inline-flex min-h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-medium hover:border-accent hover:text-accent-ink disabled:opacity-60",
  ghost: "inline-flex min-h-10 items-center rounded-full px-3 text-sm text-muted hover:text-ink disabled:opacity-60",
  icon: "inline-flex size-10 items-center justify-center rounded-full border border-line text-muted hover:text-ink",
};

function HistoryPanel({
  state,
  pending,
  onRestore,
}: {
  state: AdminState;
  pending: boolean;
  onRestore: (id: string) => void;
}) {
  return (
    <Panel
      title="History"
      description="Every publish is kept (latest 50). Restoring loads a version into the draft; publish to make it live."
    >
      {state.revisions.length === 0 ? (
        <p className="text-sm text-muted">Nothing published yet.</p>
      ) : (
        <ol className="divide-y divide-line rounded-lg border border-line">
          {state.revisions.map((r, i) => (
            <li key={r.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-medium">
                  Version {r.version}
                  {i === 0 && <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent-ink">live</span>}
                </p>
                <p className="text-xs text-muted">{fmt(r.publishedAt)}</p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (confirm(`Load version ${r.version} into the draft? Unsaved edits will be lost.`)) onRestore(r.id);
                }}
                className={btn.secondary}
              >
                <RotateCcw className="size-4" aria-hidden="true" /> Restore
              </button>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}

function MediaPanel() {
  return (
    <Panel title="Photo & resume" description="Files are stored in MongoDB. Upload, then save and publish.">
      <MediaField kind="photo" />
      <TextField path={["profile", "photo", "alt"]} label="Photo alt text" />
      <MediaField kind="resume" />
    </Panel>
  );
}

function MediaField({ kind }: { kind: "photo" | "resume" }) {
  const id = useField<string | null>(["profile", kind, "fileId"]);
  const filename = useField<string>(["profile", "resume", "filename"]);
  const [error, setError] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();
  const current = id.value ? `/media/${id.value}` : kind === "photo" ? "/souvik.webp" : "/resume/Souvik_Hazra_SDE.pdf";

  function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.set("kind", kind);
    fd.set("file", file);
    startTransition(async () => {
      const res = await uploadMedia(fd);
      if (!res.ok) return setError(res.error);
      id.onChange(res.data.fileId);
      if (kind === "resume") filename.onChange(res.data.filename);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-5 rounded-lg border border-line p-4">
      {kind === "photo" ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin preview of the raw upload
        <img src={current} alt="" className="size-24 rounded object-cover" />
      ) : (
        <a href={current} target="_blank" rel="noreferrer" className="flex size-24 flex-col items-center justify-center gap-1 rounded bg-accent-soft text-accent-ink">
          <FileText className="size-8" aria-hidden="true" />
          <span className="text-xs">Open</span>
        </a>
      )}
      <div className="space-y-2">
        <p className="text-sm font-medium">{kind === "photo" ? "Profile photo" : "Resume PDF"}</p>
        <p className="text-xs text-muted">
          {kind === "photo" ? "WebP, PNG, JPEG or AVIF · up to 2 MB · square works best" : `PDF · up to 5 MB · ${filename.value}`}
        </p>
        <label className={`${btn.secondary} cursor-pointer`}>
          <Upload className="size-4" aria-hidden="true" />
          {busy ? "Uploading…" : "Upload new"}
          <input
            type="file"
            className="sr-only"
            accept={kind === "photo" ? "image/webp,image/png,image/jpeg,image/avif" : "application/pdf"}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>
        {id.value && (
          <button type="button" onClick={() => id.onChange(null)} className={`${btn.ghost} ml-2`}>
            Use default file
          </button>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
