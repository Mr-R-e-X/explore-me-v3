"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems } from "@/lib/content/helpers";
import { ThemeToggle } from "./ThemeToggle";

export function MobileHeader({ name, resumeHref }: { name: string; resumeHref: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex min-h-11 items-center gap-2 font-mono text-sm tracking-wider">
          <span className="grid size-7 place-items-center rounded-sm bg-accent text-[11px] font-semibold text-on-accent">
            {initials(name)}
          </span>
          <span className="sr-only">{name}, back to top</span>
        </a>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line text-ink"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav
        id="mobile-nav"
        aria-label="Sections"
        hidden={!open}
        className="border-t border-line bg-paper px-4 pb-6 pt-2 sm:px-6"
      >
        <ol>
          {navItems.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center gap-4 border-b border-line font-mono text-sm uppercase tracking-[0.14em]"
              >
                <span className="text-xs text-accent-ink">0{i + 1}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
        <a
          href={resumeHref}
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-on-accent"
        >
          Download resume
        </a>
      </nav>
    </header>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
