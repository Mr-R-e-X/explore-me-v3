"use client";

import { createContext, useContext } from "react";
import type { SiteContent } from "@/lib/content/schema";

export type Path = (string | number)[];

export function getAt(obj: unknown, path: Path): unknown {
  return path.reduce<unknown>((acc, key) => (acc == null ? undefined : (acc as Record<string | number, unknown>)[key]), obj);
}

export function setAt<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [key, ...rest] = path;
  const base =
    obj == null
      ? typeof key === "number"
        ? []
        : {}
      : obj;
  const current = (base as Record<string | number, unknown>)[key];
  const next = setAt(current, rest, value);
  if (Array.isArray(base)) {
    const copy = base.slice();
    copy[key as number] = next;
    return copy as T;
  }
  return { ...(base as object), [key]: next } as T;
}

export const pathKey = (path: Path) => path.join(".");

type EditorContextValue = {
  content: SiteContent;
  set: (path: Path, value: unknown) => void;
  errors: Record<string, string>;
};

export const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used inside <EditorContext>");
  return ctx;
}

/** Value + setter + error for one path in the content tree. */
export function useField<T>(path: Path) {
  const { content, set, errors } = useEditor();
  return {
    value: getAt(content, path) as T,
    onChange: (v: T) => set(path, v),
    error: errors[pathKey(path)],
  };
}

export function newId(prefix = "item") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
