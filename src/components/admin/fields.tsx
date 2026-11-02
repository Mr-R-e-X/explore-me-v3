"use client";

import { ChevronDown, Copy, Plus, Trash2 } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { themeColorPresets } from "@/lib/content/schema";
import { newId, useField, type Path } from "./editor-context";
import { SortableList } from "./Sortable";

const inputClass =
  "w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent aria-[invalid=true]:border-red-500";

function FieldShell({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium tracking-wide text-muted">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

type FieldProps = { path: Path; label: string; hint?: string; placeholder?: string };

export function TextField({ path, label, hint, placeholder, type = "text" }: FieldProps & { type?: string }) {
  const id = useId();
  const { value, onChange, error } = useField<string>(path);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClass}
      />
    </FieldShell>
  );
}

export function ToggleField({ path, label, hint }: FieldProps) {
  const id = useId();
  const { value, onChange, error } = useField<boolean>(path);
  const enabled = Boolean(value);

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className="inline-flex rounded-md border border-line-strong p-0.5" role="group" aria-labelledby={id}>
        <button
          type="button"
          aria-pressed={enabled}
          onClick={() => onChange(true)}
          className={`rounded px-3 py-1.5 text-xs font-medium transition ${
            enabled ? "bg-accent text-on-accent" : "text-muted hover:text-ink"
          }`}
        >
          Enabled
        </button>
        <button
          type="button"
          aria-pressed={!enabled}
          onClick={() => onChange(false)}
          className={`rounded px-3 py-1.5 text-xs font-medium transition ${
            !enabled ? "bg-ink text-paper" : "text-muted hover:text-ink"
          }`}
        >
          Disabled
        </button>
      </div>
    </FieldShell>
  );
}

export function ColorField({ path, label, hint }: FieldProps) {
  const id = useId();
  const { value, onChange, error } = useField<string>(path);
  const hex = value?.match(/^#[0-9A-Fa-f]{6}$/) ? value : "#5b4cf0";

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className="flex flex-wrap items-center gap-2">
        {themeColorPresets.map((preset) => {
          const selected = hex.toLowerCase() === preset.value.toLowerCase();
          return (
            <button
              key={preset.id}
              type="button"
              title={preset.label}
              aria-label={`${preset.label} (${preset.value})`}
              aria-pressed={selected}
              onClick={() => onChange(preset.value)}
              className={`h-8 w-8 rounded-md border-2 transition ${
                selected ? "border-ink scale-105" : "border-transparent hover:border-line-strong"
              }`}
              style={{ backgroundColor: preset.value }}
            />
          );
        })}
        <label
          htmlFor={id}
          className="ml-1 inline-flex items-center gap-2 rounded-md border border-line-strong bg-surface px-2 py-1.5 text-xs text-muted"
        >
          <input
            id={id}
            type="color"
            value={hex}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={Boolean(error)}
            className="h-6 w-6 cursor-pointer border-0 bg-transparent p-0"
          />
          Custom
        </label>
        <span className="font-mono text-xs text-muted">{hex}</span>
      </div>
    </FieldShell>
  );
}

export function TextArea({ path, label, hint, rows = 4 }: FieldProps & { rows?: number }) {
  const id = useId();
  const { value, onChange, error } = useField<string>(path);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className={`${inputClass} resize-y leading-relaxed`}
      />
    </FieldShell>
  );
}

export function SelectField({
  path,
  label,
  options,
}: FieldProps & { options: readonly { value: string; label: string }[] }) {
  const id = useId();
  const { value, onChange, error } = useField<string>(path);
  return (
    <FieldShell id={id} label={label} error={error}>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

const iconButton =
  "inline-flex size-8 shrink-0 items-center justify-center rounded text-muted transition-colors hover:bg-accent-soft hover:text-accent-ink";

/** Sortable list of strings (bullet points, tags, paragraphs). */
export function StringList({
  path,
  label,
  multiline = false,
  addLabel = "Add",
}: FieldProps & { multiline?: boolean; addLabel?: string }) {
  const { value = [], onChange, error } = useField<string[]>(path);
  // One stable drag key per row. Lists only change length through the handlers
  // below; content replaced from the server remounts the editor (see ContentEditor).
  const [keys, setKeys] = useState(() => value.map(() => newId("row")));
  const rows = value.map((v, i) => ({ key: keys[i] ?? `row-${i}`, value: v }));

  const commit = (next: { key: string; value: string }[]) => {
    setKeys(next.map((r) => r.key));
    onChange(next.map((r) => r.value));
  };

  return (
    <fieldset className="space-y-2">
      <legend className="mb-1.5 text-xs font-medium tracking-wide text-muted">{label}</legend>
      <SortableList
        items={rows}
        getId={(r) => r.key}
        onReorder={commit}
        renderItem={(row, i, handle) => (
          <ListRowField
            handle={handle}
            path={[...path, i]}
            multiline={multiline}
            label={`${label} ${i + 1}`}
            onRemove={() => commit(rows.filter((_, j) => j !== i))}
          />
        )}
      />
      <button
        type="button"
        onClick={() => commit([...rows, { key: newId("row"), value: "" }])}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-accent-ink hover:bg-accent-soft"
      >
        <Plus className="size-3.5" aria-hidden="true" /> {addLabel}
      </button>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </fieldset>
  );
}

function ListRowField({
  handle,
  path,
  multiline,
  label,
  onRemove,
}: {
  handle: ReactNode;
  path: Path;
  multiline: boolean;
  label: string;
  onRemove: () => void;
}) {
  const { value, onChange, error } = useField<string>(path);
  return (
    <div className="mb-2 flex items-start gap-1">
      <div className="pt-1">{handle}</div>
      <div className="flex-1">
        {multiline ? (
          <textarea
            aria-label={label}
            rows={3}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={Boolean(error)}
            className={`${inputClass} resize-y leading-relaxed`}
          />
        ) : (
          <input
            aria-label={label}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={Boolean(error)}
            className={inputClass}
          />
        )}
        {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
      <button type="button" onClick={onRemove} aria-label={`Remove ${label}`} className={`${iconButton} mt-1`}>
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/** Sortable, collapsible list of objects that each carry an `id`. */
export function ObjectList<T extends { id: string }>({
  path,
  label,
  itemTitle,
  create,
  children,
  addLabel = "Add item",
}: {
  path: Path;
  label: string;
  itemTitle: (item: T) => string;
  create: () => T;
  children: (index: number) => ReactNode;
  addLabel?: string;
}) {
  const { value = [], onChange } = useField<T[]>(path);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <SortableList
        items={value}
        getId={(item) => item.id}
        onReorder={onChange}
        renderItem={(item, i, handle) => {
          const isOpen = open === item.id;
          return (
            <div className="mb-3 rounded-lg border border-line bg-surface">
              <div className="flex items-center gap-1 px-2 py-1.5">
                {handle}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className="flex min-h-9 flex-1 items-center justify-between gap-2 rounded px-2 text-left text-sm font-medium hover:bg-accent-soft/60"
                >
                  <span className="truncate">{itemTitle(item) || `Untitled ${label.toLowerCase()}`}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  aria-label="Duplicate"
                  className={iconButton}
                  onClick={() => {
                    const copy = { ...structuredClone(item), id: newId(item.id.split("-")[0]) };
                    onChange([...value.slice(0, i + 1), copy, ...value.slice(i + 1)]);
                    setOpen(copy.id);
                  }}
                >
                  <Copy className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Delete"
                  className={iconButton}
                  onClick={() => {
                    if (confirm(`Delete "${itemTitle(item) || "this item"}"?`)) {
                      onChange(value.filter((_, j) => j !== i));
                    }
                  }}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
              {isOpen && <div className="space-y-4 border-t border-line p-4">{children(i)}</div>}
            </div>
          );
        }}
      />
      <button
        type="button"
        onClick={() => {
          const item = create();
          onChange([...value, item]);
          setOpen(item.id);
        }}
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-line-strong px-3 py-2 text-sm font-medium text-accent-ink hover:border-accent hover:bg-accent-soft"
      >
        <Plus className="size-4" aria-hidden="true" /> {addLabel}
      </button>
    </div>
  );
}
