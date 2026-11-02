"use client";

import { useEffect, useRef } from "react";
import { DEFAULT_THEME_COLOR } from "@/lib/content/schema";

/** Must match `background-size` on body in globals.css */
const GRID = 24;
const TRACER_COUNT = 8;
const TRAIL_CELLS = 6;
/** Extra clearance around text so the stroke never kisses glyphs. */
const TEXT_PAD = 12;
const TEXT_SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,li,a,button,label,figcaption,time,.label,.chip,img,figure";

type Props = {
  color?: string;
};

type Dir = 0 | 1 | 2 | 3; // right, down, left, up

type Tracer = {
  gx: number;
  gy: number;
  dir: Dir;
  progress: number;
  speed: number;
  alpha: number;
  path: { gx: number; gy: number }[];
};

const DX = [1, 0, -1, 0] as const;
const DY = [0, 1, 0, -1] as const;

function cellKey(gx: number, gy: number) {
  return `${gx},${gy}`;
}

function hexToRgb(hex: string) {
  const c = hex.match(/^#[0-9A-Fa-f]{6}$/) ? hex : DEFAULT_THEME_COLOR;
  return {
    r: parseInt(c.slice(1, 3), 16),
    g: parseInt(c.slice(3, 5), 16),
    b: parseInt(c.slice(5, 7), 16),
  };
}

function inBounds(gx: number, gy: number, cols: number, rows: number) {
  return gx >= 0 && gy >= 0 && gx <= cols && gy <= rows;
}

function cornerSpawn(cols: number, rows: number, blocked: Set<string>): Tracer {
  const corners: { gx: number; gy: number; dirs: Dir[] }[] = [
    { gx: 0, gy: 0, dirs: [0, 1] },
    { gx: cols, gy: 0, dirs: [2, 1] },
    { gx: 0, gy: rows, dirs: [0, 3] },
    { gx: cols, gy: rows, dirs: [2, 3] },
  ];

  // Prefer free corners; fall back to any corner.
  const free = corners.filter((c) => !blocked.has(cellKey(c.gx, c.gy)));
  const pool = free.length ? free : corners;
  const corner = pool[Math.floor(Math.random() * pool.length)]!;
  const dirs = corner.dirs.filter((d) => {
    const nx = corner.gx + DX[d]!;
    const ny = corner.gy + DY[d]!;
    return inBounds(nx, ny, cols, rows) && !blocked.has(cellKey(nx, ny));
  });
  const dir = (dirs.length ? dirs : corner.dirs)[Math.floor(Math.random() * (dirs.length || corner.dirs.length))]!;

  return {
    gx: corner.gx,
    gy: corner.gy,
    dir,
    progress: 0,
    speed: 0.55 + Math.random() * 0.45,
    alpha: 0.5 + Math.random() * 0.4,
    path: [{ gx: corner.gx, gy: corner.gy }],
  };
}

/** Mark grid vertices that sit on / near visible text & media. */
function collectBlocked(cols: number, rows: number): Set<string> {
  const blocked = new Set<string>();
  const root = document.querySelector("[data-content-root]");
  if (!root) return blocked;

  const els = root.querySelectorAll(TEXT_SELECTOR);
  for (const el of els) {
    if (el.closest("[data-grid-flow]")) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none" || style.opacity === "0") continue;

    const rects = el.getClientRects();
    for (const r of rects) {
      if (r.width < 2 || r.height < 2) continue;
      const left = r.left - TEXT_PAD;
      const right = r.right + TEXT_PAD;
      const top = r.top - TEXT_PAD;
      const bottom = r.bottom + TEXT_PAD;

      const gx0 = Math.max(0, Math.floor(left / GRID));
      const gx1 = Math.min(cols, Math.ceil(right / GRID));
      const gy0 = Math.max(0, Math.floor(top / GRID));
      const gy1 = Math.min(rows, Math.ceil(bottom / GRID));

      for (let gx = gx0; gx <= gx1; gx++) {
        for (let gy = gy0; gy <= gy1; gy++) {
          blocked.add(cellKey(gx, gy));
        }
      }
    }
  }
  return blocked;
}

function freeDirs(
  gx: number,
  gy: number,
  cols: number,
  rows: number,
  blocked: Set<string>,
  exclude?: Dir,
): Dir[] {
  const dirs: Dir[] = [0, 1, 2, 3];
  return dirs.filter((d) => {
    if (exclude !== undefined && d === exclude) return false;
    const nx = gx + DX[d]!;
    const ny = gy + DY[d]!;
    return inBounds(nx, ny, cols, rows) && !blocked.has(cellKey(nx, ny));
  });
}

function randomDir(options: Dir[]): Dir | null {
  if (!options.length) return null;
  return options[Math.floor(Math.random() * options.length)]!;
}

/**
 * Color pulses that start at a corner, step box-by-box, and turn away from text.
 */
export function GridFlow({ color = DEFAULT_THEME_COLOR }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef(color);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let tracers: Tracer[] = [];
    let blocked = new Set<string>();
    let blockedDirty = true;
    let raf = 0;
    let last = performance.now();
    let lastBlockedAt = 0;

    const markBlockedDirty = () => {
      blockedDirty = true;
    };

    const refreshBlocked = (now: number) => {
      if (!blockedDirty && now - lastBlockedAt < 200) return;
      blocked = collectBlocked(cols, rows);
      blockedDirty = false;
      lastBlockedAt = now;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cols = Math.floor(w / GRID);
      rows = Math.floor(h / GRID);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      blockedDirty = true;
      if (tracers.length === 0) {
        refreshBlocked(performance.now());
        tracers = Array.from({ length: TRACER_COUNT }, () => cornerSpawn(cols, rows, blocked));
      }
    };

    const headPos = (t: Tracer) => ({
      x: (t.gx + DX[t.dir]! * t.progress) * GRID,
      y: (t.gy + DY[t.dir]! * t.progress) * GRID,
    });

    const turnAwayFromText = (t: Tracer) => {
      // Random free direction; avoid continuing straight into text when possible.
      const options = freeDirs(t.gx, t.gy, cols, rows, blocked);
      const turned = options.filter((d) => d !== t.dir);
      const pick = randomDir(turned.length ? turned : options);
      if (pick == null) {
        Object.assign(t, cornerSpawn(cols, rows, blocked));
        return;
      }
      t.dir = pick;
      t.progress = 0;
    };

    const step = (t: Tracer, dt: number) => {
      const nextGx = t.gx + DX[t.dir]!;
      const nextGy = t.gy + DY[t.dir]!;

      // About to enter / already aiming at text → turn randomly.
      if (
        blocked.has(cellKey(nextGx, nextGy)) ||
        blocked.has(cellKey(t.gx, t.gy)) ||
        !inBounds(nextGx, nextGy, cols, rows)
      ) {
        turnAwayFromText(t);
        return;
      }

      t.progress += t.speed * dt;

      while (t.progress >= 1) {
        t.progress -= 1;
        t.gx += DX[t.dir]!;
        t.gy += DY[t.dir]!;
        t.path.push({ gx: t.gx, gy: t.gy });
        if (t.path.length > TRAIL_CELLS + 1) t.path.shift();

        if (blocked.has(cellKey(t.gx, t.gy))) {
          turnAwayFromText(t);
          return;
        }

        const options = freeDirs(t.gx, t.gy, cols, rows, blocked);
        if (!options.length) {
          Object.assign(t, cornerSpawn(cols, rows, blocked));
          return;
        }

        // Prefer straight when free; otherwise random free direction.
        const forward = t.dir;
        if (options.includes(forward) && Math.random() < 0.65) {
          t.dir = forward;
        } else {
          t.dir = randomDir(options)!;
        }

        // Next step already blocked? Turn again immediately.
        const nx = t.gx + DX[t.dir]!;
        const ny = t.gy + DY[t.dir]!;
        if (blocked.has(cellKey(nx, ny))) {
          turnAwayFromText(t);
          return;
        }
      }
    };

    const draw = (t: Tracer, rgb: { r: number; g: number; b: number }) => {
      const head = headPos(t);
      const points: { x: number; y: number }[] = t.path.map((p) => ({
        x: p.gx * GRID,
        y: p.gy * GRID,
      }));
      points.push(head);
      if (points.length < 2) return;

      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1]!;
        const b = points[i]!;
        const age = i / (points.length - 1);
        const alpha = t.alpha * (0.15 + age * 0.85);

        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "square";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${Math.min(1, t.alpha + 0.35)})`;
      ctx.fillRect(head.x - 1.5, head.y - 1.5, 3, 3);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      refreshBlocked(now);
      const rgb = hexToRgb(colorRef.current);

      ctx.clearRect(0, 0, w, h);
      for (const t of tracers) {
        step(t, dt);
        draw(t, rgb);
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", markBlockedDirty, { passive: true, capture: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", markBlockedDirty, true);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-grid-flow
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    />
  );
}
