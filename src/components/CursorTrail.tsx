"use client";

import { useEffect, useRef } from "react";
import { DEFAULT_THEME_COLOR } from "@/lib/content/schema";

const DOT_COUNT = 14;
const LERP = 0.28;

type Props = {
  color?: string;
};

/**
 * Soft color dots that lag behind the pointer. Disabled for touch,
 * coarse pointers, and prefers-reduced-motion.
 */
export function CursorTrail({ color = DEFAULT_THEME_COLOR }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots = Array.from({ length: DOT_COUNT }, () => ({ x: -100, y: -100 }));
    let pointer = { x: -100, y: -100 };
    let raf = 0;
    let visible = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      visible = true;
    };

    const onLeave = () => {
      visible = false;
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (visible) {
        let prev = pointer;
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i]!;
          d.x += (prev.x - d.x) * LERP;
          d.y += (prev.y - d.y) * LERP;
          prev = d;

          const t = 1 - i / dots.length;
          const radius = 2.2 + t * 5.5;
          ctx.beginPath();
          ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.12 + t * 0.38;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] hidden touch-none md:block"
    />
  );
}
