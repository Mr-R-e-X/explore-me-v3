"use client";

import { useEffect, useState } from "react";
import { navItems } from "@/lib/content/helpers";

export function ScrollSpyNav() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));

    // The last section can be too short to reach the observer band; at the
    // bottom of the page, mark it active explicitly.
    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) setActive(navItems[navItems.length - 1].id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav aria-label="Sections" className="mt-8 hidden lg:block">
      <ol>
        {navItems.map((item, i) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className="group flex min-h-8 items-center gap-4"
              >
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <span
                  aria-hidden="true"
                  className={`h-px transition-all duration-300 group-hover:w-16 group-hover:bg-accent ${
                    isActive ? "w-16 bg-accent" : "w-8 bg-line-strong"
                  }`}
                />
                <span
                  className={`font-mono text-xs uppercase tracking-[0.14em] transition-colors group-hover:text-ink ${
                    isActive ? "text-ink" : "text-muted"
                  }`}
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
