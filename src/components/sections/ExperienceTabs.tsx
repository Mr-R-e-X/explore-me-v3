"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type Tab = { id: string; label: string };

// WAI-ARIA tabs: roving tabindex + arrow/Home/End keys. Panels are rendered by
// the server and passed in, so all content is in the initial HTML.
export function ExperienceTabs({ tabs, panels }: { tabs: Tab[]; panels: ReactNode[] }) {
  const [selected, setSelected] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const last = tabs.length - 1;
    const keys: Record<string, number> = {
      ArrowDown: selected === last ? 0 : selected + 1,
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowUp: selected === 0 ? last : selected - 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = keys[e.key];
    setSelected(next);
    refs.current[next]?.focus();
  }

  return (
    <div className="grid gap-6 md:grid-cols-[13rem_1fr]">
      <div
        role="tablist"
        aria-label="Companies"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="relative -mx-4 flex overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0 md:flex-col md:overflow-visible md:border-b-0 md:border-l"
      >
        {tabs.map((tab, i) => {
          const isSel = i === selected;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isSel}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isSel ? 0 : -1}
              onClick={() => setSelected(i)}
              className={`relative min-h-11 shrink-0 whitespace-nowrap px-4 text-left font-mono text-[13px] transition-colors md:-ml-px md:border-l-2 ${
                isSel
                  ? "bg-accent-soft text-accent-ink md:border-accent"
                  : "text-muted hover:bg-accent-soft/60 hover:text-ink md:border-transparent"
              }`}
            >
              {tab.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 -bottom-px h-0.5 md:hidden ${isSel ? "bg-accent" : ""}`}
              />
            </button>
          );
        })}
      </div>

      {panels.map((panel, i) => (
        <div
          key={tabs[i].id}
          id={`panel-${tabs[i].id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tabs[i].id}`}
          hidden={i !== selected}
          tabIndex={0}
          className="min-h-[22rem] focus-visible:outline-offset-8"
        >
          {panel}
        </div>
      ))}
      <noscript>
        <style>{`[role=tabpanel]{display:block!important}`}</style>
      </noscript>
    </div>
  );
}
